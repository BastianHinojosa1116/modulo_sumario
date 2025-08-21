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
        Schema::table('ingresar_falta_involucrados', function (Blueprint $table) {
            $table->foreign(['ingresar_falta_id'], 'fk_if_involucrados_falta')->references(['id'])->on('ingresar_faltas')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['involucrado_id'], 'fk_if_involucrados_involucrado')->references(['id'])->on('involucrados')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ingresar_falta_involucrados', function (Blueprint $table) {
            $table->dropForeign('fk_if_involucrados_falta');
            $table->dropForeign('fk_if_involucrados_involucrado');
        });
    }
};
