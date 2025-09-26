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
        Schema::create('dt_hilang_barang', function (Blueprint $table) {
            $table->increments('dhil_id')->primary();
            $table->char('dhil_hil_id', 10)->index();
            $table->char('dhil_prd_id', 9)->index();
            $table->double('dhil_qty')->default(0);
            $table->decimal('dhil_biaya', 28, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dt_hilang_barang');
    }
};
