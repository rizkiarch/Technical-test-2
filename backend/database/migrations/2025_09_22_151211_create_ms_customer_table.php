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
        Schema::create('ms_customer', function (Blueprint $table) {
            $table->char('cus_id', 5)->primary();
            $table->string('cus_nama')->index();
            $table->string('cus_kota')->nullable();
            $table->char('cus_aktif', 1)->default('Y')->index();
            $table->timestamp('cus_create_at');
            $table->timestamp('cus_update_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ms_customer');
    }
};
