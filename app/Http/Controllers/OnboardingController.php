<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\DemoRequest;
use App\Models\OnboardingSession;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function edit(Request $request): Response
    {
        $onboarding = $this->session($request);
        return Inertia::render('Onboarding/Business', [
            'draft' => $onboarding->payload ?? [],
            'currentStep' => $onboarding->current_step,
        ]);
    }

    public function save(Request $request): RedirectResponse
    {
        $step = $request->integer('step', 1);
        abort_unless($step >= 1 && $step <= 7, 422);

        $rules = match ($step) {
            1 => ['business_name' => ['required', 'string', 'max:255'], 'business_category' => ['required', 'string'], 'country' => ['required', 'string'], 'city' => ['required', 'string']],
            2 => ['booking_model' => ['required', 'string'], 'capacity_mode' => ['required', 'string']],
            3 => ['duration_mode' => ['required', 'string'], 'booking_fields' => ['required', 'array', 'min:1']],
            4 => ['location_mode' => ['required', 'string'], 'resource_types' => ['array']],
            5 => ['features' => ['required', 'array', 'min:1']],
            6 => ['monthly_booking_range' => ['required', 'string'], 'team_size_range' => ['required', 'string'], 'estimated_locations' => ['required', 'string']],
            7 => ['first_name' => ['required', 'string'], 'last_name' => ['required', 'string'], 'email' => ['required', 'email'], 'password' => ['required', 'string', 'min:8'], 'objective' => ['required', 'string'], 'demo_mode' => ['required', 'in:try_now,guided,both']],
        };

        $validated = $request->validate($rules);
        $onboarding = $this->session($request);
        $onboarding->update([
            'payload' => array_replace($onboarding->payload ?? [], $validated),
            'current_step' => max($onboarding->current_step, min($step + 1, 8)),
        ]);

        return back()->with('onboarding_saved', true);
    }

    public function complete(Request $request): RedirectResponse
    {
        $onboarding = $this->session($request);
        $payload = $onboarding->payload ?? [];
        validator($payload, [
            'business_name' => ['required', 'string'], 'business_category' => ['required', 'string'], 'country' => ['required', 'string'], 'city' => ['required', 'string'],
            'booking_model' => ['required', 'string'], 'capacity_mode' => ['required', 'string'], 'duration_mode' => ['required', 'string'], 'booking_fields' => ['required', 'array', 'min:1'],
            'location_mode' => ['required', 'string'], 'features' => ['required', 'array', 'min:1'], 'monthly_booking_range' => ['required', 'string'], 'team_size_range' => ['required', 'string'], 'estimated_locations' => ['required', 'string'],
            'first_name' => ['required', 'string'], 'last_name' => ['required', 'string'], 'email' => ['required', 'email', 'unique:'.User::class], 'password' => ['required', 'string', 'min:8'],
        ])->validate();

        $user = User::create(['name' => trim($payload['first_name'].' '.$payload['last_name']), 'email' => $payload['email'], 'password' => Hash::make($payload['password'])]);
        event(new Registered($user));
        Auth::login($user);

        $business = Business::create([
            'name' => $payload['business_name'],
            'slug' => Str::slug($payload['business_name']).'-'.Str::lower(Str::random(5)),
            'industry' => $payload['business_category'],
            'capabilities' => [
                'booking_mode' => $payload['booking_model'], 'capacity_mode' => $payload['capacity_mode'],
                'requires_staff' => in_array('staff', $payload['booking_fields'] ?? [], true),
                'requires_resource' => count($payload['resource_types'] ?? []) > 0,
                'requires_location' => $payload['location_mode'] !== 'virtual',
                'supports_guest_count' => in_array('guest_count', $payload['booking_fields'] ?? [], true),
            ],
            'settings' => [
                'country' => $payload['country'], 'city' => $payload['city'], 'duration_mode' => $payload['duration_mode'],
                'booking_fields' => $payload['booking_fields'], 'location_mode' => $payload['location_mode'], 'resource_types' => $payload['resource_types'] ?? [],
                'features' => $payload['features'], 'monthly_booking_range' => $payload['monthly_booking_range'], 'team_size_range' => $payload['team_size_range'],
                'estimated_locations' => $payload['estimated_locations'], 'demo_mode' => true, 'demo_expires_at' => now()->addDays(10)->toIso8601String(), 'onboarding_completed' => true,
            ],
            'demo_requested_at' => now(),
        ]);
        $business->users()->attach($user, ['role' => 'owner']);

        DemoRequest::create([
            'user_id' => $user->id, 'business_id' => $business->id,
            'contact_data' => ['first_name' => $payload['first_name'], 'last_name' => $payload['last_name'], 'email' => $payload['email'], 'phone' => $payload['phone'] ?? null, 'role' => $payload['role'] ?? null],
            'objective' => $payload['objective'], 'demo_mode' => $payload['demo_mode'],
        ]);

        $onboarding->update(['user_id' => $user->id, 'business_id' => $business->id, 'current_step' => 8, 'status' => 'completed', 'completed_at' => now()]);
        $request->session()->regenerate();
        $request->session()->put('active_business_id', $business->id);

        return redirect()->route('dashboard')->with('success', 'Tu workspace demo está listo.')
            ->cookie('noryvaq_demo', '1', 60 * 24 * 30, '/', null, false, false, false, 'Lax');
    }

    private function session(Request $request): OnboardingSession
    {
        $token = $request->session()->get('onboarding_token');
        if (!$token) {
            $token = (string) Str::uuid();
            $request->session()->put('onboarding_token', $token);
        }
        return OnboardingSession::firstOrCreate(['token' => $token]);
    }
}
