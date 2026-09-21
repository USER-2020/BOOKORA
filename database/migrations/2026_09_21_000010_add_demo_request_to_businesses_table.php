<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->timestamp('demo_requested_at')->nullable()->after('settings');
            $table->text('demo_notes')->nullable()->after('demo_requested_at');
        });
    }

    public function down(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn(['demo_requested_at', 'demo_notes']);
        });
    }
};
