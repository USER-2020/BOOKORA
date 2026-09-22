<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('demo_requests', function (Blueprint $table) {
            $table->dateTime('scheduled_at')->nullable()->after('demo_mode');
            $table->text('attendee_message')->nullable()->after('scheduled_at');
            $table->string('whatsapp_status')->default('pending')->after('attendee_message');
            $table->string('whatsapp_message_id')->nullable()->after('whatsapp_status');
        });
    }

    public function down(): void
    {
        Schema::table('demo_requests', function (Blueprint $table) {
            $table->dropColumn(['scheduled_at', 'attendee_message', 'whatsapp_status', 'whatsapp_message_id']);
        });
    }
};
