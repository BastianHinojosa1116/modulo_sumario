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
        Schema::table('estados_form_sumario', function (Blueprint $table) {
            $table->foreign(['estado_sumario_id'], 'fk_estados_form_sumario_estado_sumario')->references(['id'])->on('estados_sumario')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['sumario_id'], 'fk_estados_form_sumario_sumario')->references(['id'])->on('formulario_dispone_sumario')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('estados_form_sumario', function (Blueprint $table) {
            $table->dropForeign('fk_estados_form_sumario_estado_sumario');
            $table->dropForeign('fk_estados_form_sumario_sumario');
        });
    }
};
