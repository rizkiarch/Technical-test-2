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
        Schema::create('ms_produk', function (Blueprint $table) {
            $table->char('prd_id', 9)->primary();
            $table->string('prd_nama')->index();
            $table->char('prd_aktif', 1)->default('Y')->index();
            $table->decimal('prd_hargadef', 28, 2)->default(0);
            $table->decimal('prd_hargamin', 28, 2)->default(0);
            $table->timestamp('prd_create_at');
            $table->timestamp('prd_update_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ms_produk');
    }
};
