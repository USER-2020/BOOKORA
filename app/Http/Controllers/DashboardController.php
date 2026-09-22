<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Support\CurrentBusiness;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(CurrentBusiness $currentBusiness): Response
    {
        $business = $currentBusiness->get();

        abort_unless($business, 403, 'Your account has no active business.');

        $timezone = $business->timezone ?: config('app.timezone', 'UTC');
        $today = now($timezone);
        $weekStart = $today->copy()->startOfDay()->subDays(6);
        $rangeBookings = $business->bookings()
            ->with(['customer:id,name', 'service:id,name,price_minor,currency'])
            ->whereBetween('starts_at', [$weekStart->copy()->utc(), $today->copy()->endOfDay()->utc()])
            ->orderBy('starts_at')
            ->get();

        $todayBookings = $rangeBookings->filter(fn ($booking) => $booking->starts_at->setTimezone($timezone)->isSameDay($today));
        $newCustomers = $business->customers()->where('created_at', '>=', $weekStart->copy()->utc())->count();
        $upcoming = $business->bookings()
            ->with(['customer:id,name', 'service:id,name'])
            ->where('starts_at', '>=', now())
            ->orderBy('starts_at')
            ->limit(5)
            ->get();

        $dailyBookings = collect(range(6, 0))->map(function ($daysAgo) use ($rangeBookings, $today, $timezone) {
            $date = $today->copy()->subDays($daysAgo);
            return [
                'label' => ucfirst($date->locale('es')->isoFormat('ddd')),
                'date' => $date->toDateString(),
                'count' => $rangeBookings->filter(fn ($booking) => $booking->starts_at->setTimezone($timezone)->isSameDay($date))->count(),
            ];
        })->values();

        $serviceDistribution = $rangeBookings->groupBy(fn ($booking) => $booking->service?->name ?: 'Otros')
            ->map(fn ($items, $name) => ['name' => $name, 'count' => $items->count()])
            ->sortByDesc('count')->values();
        $totalServiceBookings = max(1, $serviceDistribution->sum('count'));
        $serviceDistribution = $serviceDistribution->map(fn ($item) => [...$item, 'percentage' => (int) round($item['count'] / $totalServiceBookings * 100)])->values();

        $recentActivity = $rangeBookings->sortByDesc('created_at')->take(5)->map(fn ($booking) => [
            'type' => $booking->status === 'cancelled' ? 'Cancelación' : 'Nueva reserva',
            'detail' => trim(($booking->customer?->name ?: 'Cliente') . ' · ' . ($booking->service?->name ?: 'Reserva')),
            'time' => Carbon::parse($booking->created_at)->diffForHumans(),
            'tone' => $booking->status === 'cancelled' ? 'red' : 'blue',
        ])->values();

        $customers = $business->customers()->latest()->limit(6)->get(['id', 'name', 'created_at'])->map(fn ($customer) => [
            'name' => $customer->name,
            'time' => Carbon::parse($customer->created_at)->diffForHumans(),
        ]);

        return Inertia::render('Dashboard/Index', [
            'business' => $business->only(['id', 'name', 'slug', 'industry', 'timezone', 'currency', 'capabilities', 'settings']),
            'metrics' => [
                'bookings_today' => $todayBookings->count(),
                'new_customers' => $newCustomers,
                'services' => $business->services()->where('active', true)->count(),
                'revenue_today' => $todayBookings->sum(fn ($booking) => $booking->service?->price_minor ?: 0),
                'rating' => $business->settings['rating'] ?? 0,
                'reviews_count' => $business->settings['reviews_count'] ?? 0,
            ],
            'dailyBookings' => $dailyBookings,
            'recentActivity' => $recentActivity,
            'upcomingBookings' => $upcoming->map(fn ($booking) => [
                'time' => $booking->starts_at->setTimezone($timezone)->format('H:i'),
                'customer' => $booking->customer?->name ?: 'Cliente',
                'service' => $booking->service?->name ?: 'Reserva',
                'status' => $booking->status,
            ])->values(),
            'serviceDistribution' => $serviceDistribution,
            'customers' => $customers,
        ]);
    }
}
