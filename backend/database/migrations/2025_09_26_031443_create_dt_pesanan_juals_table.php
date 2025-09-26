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
        Schema::create('dt_pesanan_juals', function (Blueprint $table) {
            $table->id("dpjl_id");
            $table->char('dpjl_pjl_id', 12)->index();
            $table->char('dpjl_prd_id', 9)->index();
            $table->double('dpjl_qty')->default(0);
            $table->decimal('dpjl_harga_sblm_disc', 28, 2)->default(0);
            $table->decimal('dpjl_disc', 5, 2)->default(0);
            $table->timestamp('dpjl_create_at');
            $table->timestamp('dpjl_update_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dt_pesanan_juals');
    }
};
