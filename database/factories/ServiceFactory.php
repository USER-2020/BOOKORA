<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Service> */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        return [
            'business_id' => BusinessFactory::new(),
            'name' => fake()->words(2, true),
            'duration_minutes' => 60,
            'price_minor' => 50000,
            'currency' => 'COP',
            'active' => true,
        ];
    }
}
