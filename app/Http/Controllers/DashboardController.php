<?php

namespace App\Http\Controllers;

use App\Support\CurrentBusiness;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(CurrentBusiness $currentBusiness): Response
    {
        $business = $currentBusiness->get();

        abort_unless($business, 403, 'Your account has no active business.');

        return Inertia::render('Dashboard', [
            'business' => $business->only(['id', 'name', 'slug', 'industry', 'timezone', 'currency', 'capabilities', 'settings']),
            'metrics' => [
                'bookings_today' => $business->bookings()->whereDate('starts_at', now($business->timezone))->count(),
                'customers' => $business->customers()->count(),
                'services' => $business->services()->where('active', true)->count(),
            ],
        ]);
    }
}
