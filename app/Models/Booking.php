<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $fillable = ['business_id', 'location_id', 'customer_id', 'service_id', 'staff_id', 'starts_at', 'ends_at', 'party_size', 'status', 'payment_status', 'custom_responses', 'internal_notes', 'metadata'];

    protected function casts(): array
    {
        return ['starts_at' => 'datetime', 'ends_at' => 'datetime', 'custom_responses' => 'array', 'metadata' => 'array'];
    }

    public function business(): BelongsTo { return $this->belongsTo(Business::class); }
    public function location(): BelongsTo { return $this->belongsTo(Location::class); }
    public function customer(): BelongsTo { return $this->belongsTo(Customer::class); }
    public function service(): BelongsTo { return $this->belongsTo(Service::class); }
    public function staff(): BelongsTo { return $this->belongsTo(Staff::class); }
}
