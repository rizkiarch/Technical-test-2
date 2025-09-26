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
        Schema::table('ms_produk', function (Blueprint $table) {
            $table->double('prd_min_pesanan')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ms_produk', function (Blueprint $table) {
            $table->dropColumn('prd_min_pesanan');
        });
    }
};
