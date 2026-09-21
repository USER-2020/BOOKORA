<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        $business = Business::create([
            'name' => $user->name.' Workspace',
            'slug' => Str::slug($user->name).'-'.Str::lower(Str::random(5)),
            'industry' => 'other',
            'capabilities' => [
                'booking_mode' => 'appointment',
                'requires_staff' => false,
                'requires_resource' => false,
                'supports_party_size' => false,
                'supports_deposit' => false,
            ],
        ]);

        $business->users()->attach($user, ['role' => 'owner']);
        $request->session()->put('active_business_id', $business->id);

        return redirect(route('dashboard', absolute: false));
    }
}
