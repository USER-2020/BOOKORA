<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PublicBookingController extends Controller
{
    public function show(Business $business): Response
    {
        return Inertia::render('Noryvaq', [
            'screen' => 'booking',
            'business' => $business->only(['id', 'name', 'slug', 'industry', 'timezone', 'currency', 'capabilities']),
            'services' => $business->services()->where('active', true)->orderBy('name')->get(['id', 'name', 'description', 'duration_minutes', 'price_minor', 'currency']),
        ]);
    }

    public function store(Request $request, Business $business): RedirectResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'integer'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'starts_at' => ['required', 'date'],
            'custom_responses' => ['nullable', 'array'],
        ]);

        $service = $business->services()->whereKey($validated['service_id'])->where('active', true)->firstOrFail();
        $startsAt = Carbon::parse($validated['starts_at'], $business->timezone);
        $endsAt = $startsAt->copy()->addMinutes($service->duration_minutes);

        $conflict = $business->bookings()
            ->whereIn('status', ['pending', 'confirmed', 'checked_in', 'in_progress'])
            ->where('starts_at', '<', $endsAt)
            ->where('ends_at', '>', $startsAt)
            ->exists();

        if ($conflict) {
            throw ValidationException::withMessages(['starts_at' => 'Ese horario ya no está disponible.']);
        }

        $customer = $business->customers()->updateOrCreate(
            ['email' => $validated['email']],
            ['name' => $validated['name'], 'phone' => $validated['phone'] ?? null],
        );

        $booking = $business->bookings()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'custom_responses' => $validated['custom_responses'] ?? null,
        ]);

        return back()->with('booking', ['id' => $booking->id, 'code' => 'NY-'.$booking->id]);
    }
}
