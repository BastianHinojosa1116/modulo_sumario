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
        Schema::create('sancions', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->timestamps();
            $table->string('sancion', 191);
            $table->string('fecha_sancion', 191);
            $table->string('resolucion_sancion', 191);
            $table->string('dias_arresto', 191);
            $table->string('aplica_sancion', 191);
            $table->string('estado_sancion', 191);
            $table->string('resolucion_recurso', 191);
            $table->string('recurso', 191);
            $table->string('numero_rol_falta', 191);
            $table->string('conformidad_involucrado', 191);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sancions');
    }
};
