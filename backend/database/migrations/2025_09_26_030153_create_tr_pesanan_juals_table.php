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
        Schema::create('tr_pesanan_juals', function (Blueprint $table) {
            $table->char('pjl_id', 12)->primary();
            $table->date('pjl_tanggal');
            $table->char('pjl_gud_id', 3)->index();
            $table->char('pjl_cust_id', 5)->index();
            $table->char('pjl_cust_is_member', 1)->default('N')->index();
            $table->longText('pjl_catatan')->nullable();
            $table->decimal('pjl_total_harga', 28, 2)->default(0);
            $table->char('pjl_void', 1)->default('N')->index();
            $table->char('pjl_create_user', 6)->nullable()->index();
            $table->timestamp('pjl_create_at');
            $table->timestamp('pjl_update_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tr_pesanan_juals');
    }
};
