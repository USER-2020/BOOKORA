<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicBookingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::get('/book/{business:slug}', [PublicBookingController::class, 'show'])
    ->middleware('current.business')
    ->name('booking.show');

Route::post('/book/{business:slug}/reservations', [PublicBookingController::class, 'store'])
    ->middleware('current.business')
    ->name('booking.store');

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'current.business'])
    ->name('dashboard');

Route::get('/availability', fn () => Inertia::render('Availability'))
    ->middleware(['auth', 'current.business'])
    ->name('availability.index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
