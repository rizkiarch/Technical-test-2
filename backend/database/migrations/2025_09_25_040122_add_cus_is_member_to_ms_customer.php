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
        Schema::table('ms_customer', function (Blueprint $table) {
            $table->char('cus_is_member', 1)->default('N')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ms_customer', function (Blueprint $table) {
            // $table->dropIndex();
            $table->dropColumn('cus_is_member');
        });
    }
};
