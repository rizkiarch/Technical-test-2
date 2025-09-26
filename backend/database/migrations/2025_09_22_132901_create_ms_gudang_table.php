<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ms_gudang', function (Blueprint $table) {
            $table->char('gud_id', 3)->primary();
            $table->string('gud_nama')->index();
            $table->char('gud_aktif', 1)->default('Y')->index();
            $table->timestamp('gud_create_at');
            $table->timestamp('gud_update_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ms_gudang');
    }
};
