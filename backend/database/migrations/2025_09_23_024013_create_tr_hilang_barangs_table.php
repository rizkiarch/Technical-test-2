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
        Schema::create('tr_hilang_barang', function (Blueprint $table) {
            $table->char('hil_id', 10)->primary();
            $table->date('hil_tanggal');
            $table->char('hil_gud_id', 3)->index();
            $table->longText('hil_catatan')->nullable();
            $table->decimal('hil_total_biaya', 28, 2)->default(0);
            $table->char('hil_void', 1)->default('N')->index();
            $table->char('hil_create_user', 6)->nullable()->index();
            $table->timestamp('hil_create_at');
            $table->timestamp('hil_update_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tr_hilang_barang');
    }
};
