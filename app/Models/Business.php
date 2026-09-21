<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Business extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'industry', 'timezone', 'currency', 'capabilities', 'settings', 'demo_requested_at', 'demo_notes'];

    protected static function booted(): void
    {
        static::creating(function (self $business) {
            $business->slug ??= str($business->name)->slug();
        });
    }

    protected function casts(): array
    {
        return ['capabilities' => 'array', 'settings' => 'array', 'demo_requested_at' => 'datetime'];
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withPivot('role')->withTimestamps();
    }

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    public function staff(): HasMany
    {
        return $this->hasMany(Staff::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
