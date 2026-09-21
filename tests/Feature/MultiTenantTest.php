<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MultiTenantTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_cannot_open_another_business_dashboard(): void
    {
        $user = User::factory()->create();
        $ownedBusiness = Business::factory()->create(['slug' => 'owned-business']);
        $otherBusiness = Business::factory()->create(['slug' => 'other-business']);

        $ownedBusiness->users()->attach($user, ['role' => 'owner']);

        $this->actingAs($user)
            ->withSession(['active_business_id' => $ownedBusiness->id])
            ->get('/dashboard')
            ->assertOk();

        $this->actingAs($user)
            ->withSession(['active_business_id' => $otherBusiness->id])
            ->get('/dashboard')
            ->assertForbidden();
    }

    public function test_a_booking_cannot_use_a_service_from_another_business(): void
    {
        $firstBusiness = Business::factory()->create(['slug' => 'first-business']);
        $secondBusiness = Business::factory()->create(['slug' => 'second-business']);
        $foreignService = Service::factory()->create(['business_id' => $secondBusiness->id]);

        $this->post('/book/'.$firstBusiness->slug.'/reservations', [
            'service_id' => $foreignService->id,
            'name' => 'Cliente de prueba',
            'email' => 'cliente@example.com',
            'starts_at' => now()->addDay()->toDateTimeString(),
        ])->assertNotFound();
    }
}
