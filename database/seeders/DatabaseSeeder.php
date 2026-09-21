<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Location;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'demo@noryvaq.com'],
            ['name' => 'Ana Noryvaq', 'password' => Hash::make('password')],
        );

        $business = Business::updateOrCreate(
            ['slug' => 'luna-beauty-studio'],
            [
                'name' => 'Luna Beauty Studio',
                'industry' => 'beauty',
                'timezone' => 'America/Bogota',
                'currency' => 'COP',
                'capabilities' => [
                    'booking_mode' => 'appointment',
                    'requires_staff' => true,
                    'requires_resource' => false,
                    'supports_party_size' => false,
                    'supports_deposit' => true,
                    'custom_forms' => true,
                ],
            ],
        );

        $business->users()->syncWithoutDetaching([$user->id => ['role' => 'owner']]);
        Location::updateOrCreate(
            ['business_id' => $business->id, 'name' => 'Sede Chapinero'],
            ['address' => 'Bogotá, Colombia', 'timezone' => 'America/Bogota'],
        );

        foreach ([
            ['name' => 'Facial hidratante', 'duration_minutes' => 60, 'price_minor' => 85000],
            ['name' => 'Masaje relajante', 'duration_minutes' => 50, 'price_minor' => 110000],
            ['name' => 'Corte + tratamiento', 'duration_minutes' => 60, 'price_minor' => 65000],
        ] as $service) {
            Service::updateOrCreate(
                ['business_id' => $business->id, 'name' => $service['name']],
                [...$service, 'currency' => 'COP', 'active' => true],
            );
        }
    }
}
