<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DemoRequest extends Model
{
    protected $fillable = ['user_id', 'business_id', 'contact_data', 'objective', 'demo_mode', 'status', 'scheduled_at', 'attendee_message', 'whatsapp_status', 'whatsapp_message_id'];

    protected function casts(): array
    {
        return ['contact_data' => 'array', 'scheduled_at' => 'datetime'];
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function business(): BelongsTo { return $this->belongsTo(Business::class); }
}
