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
        Schema::table('involucrado_sancions', function (Blueprint $table) {
            $table->foreign(['involucrado_id'], 'fk_is_involucrado')->references(['id'])->on('involucrados')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['sancion_id'], 'fk_is_sancion')->references(['id'])->on('sancions')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('involucrado_sancions', function (Blueprint $table) {
            $table->dropForeign('fk_is_involucrado');
            $table->dropForeign('fk_is_sancion');
        });
    }
};
