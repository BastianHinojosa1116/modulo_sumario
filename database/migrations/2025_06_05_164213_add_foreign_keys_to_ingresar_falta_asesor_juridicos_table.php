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
        Schema::table('ingresar_falta_asesor_juridicos', function (Blueprint $table) {
            $table->foreign(['asesor_juridico_id'], 'fk_if_asesor_asesor')->references(['id'])->on('asesor_juridicos')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['ingresar_falta_id'], 'fk_if_asesor_falta')->references(['id'])->on('ingresar_faltas')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ingresar_falta_asesor_juridicos', function (Blueprint $table) {
            $table->dropForeign('fk_if_asesor_asesor');
            $table->dropForeign('fk_if_asesor_falta');
        });
    }
};
