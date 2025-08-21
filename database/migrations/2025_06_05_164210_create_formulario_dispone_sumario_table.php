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
        Schema::create('formulario_dispone_sumario', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->timestamps();
            $table->string('fecha_ingreso_formulario', 191);
            $table->string('plazo', 191);
            $table->string('sumario_numero_rol', 191);
            $table->string('fecha_dispone_sumario', 191);
            $table->string('documento_sumario', 191);
            $table->string('motivo', 191);
            $table->string('subMotivo', 191);
            $table->text('descripcion_hecho');
            $table->string('estado_sumario', 191);
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formulario_dispone_sumario');
    }
};
