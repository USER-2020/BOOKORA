<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OnboardingSession extends Model
{
    protected $fillable = ['token', 'user_id', 'business_id', 'current_step', 'payload', 'status', 'completed_at'];

    protected function casts(): array
    {
        return ['payload' => 'array', 'completed_at' => 'datetime'];
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function business(): BelongsTo { return $this->belongsTo(Business::class); }
}
