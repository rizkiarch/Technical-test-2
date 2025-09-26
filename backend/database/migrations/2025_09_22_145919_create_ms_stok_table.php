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
        Schema::create('ms_stok', function (Blueprint $table) {
            $table->char('stk_gud_id', 3);
            $table->char('stk_prd_id', 9);
            $table->double('stk_qty')->default(0);
            $table->primary(['stk_gud_id', 'stk_prd_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ms_stok');
    }
};
