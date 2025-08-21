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
        Schema::create('involucrados', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->timestamps();
            $table->string('name', 191);
            $table->string('rut_involucrado', 191);
            $table->string('numero_rol_falta', 191);
            $table->string('conformidad_involucrado', 191);
            $table->string('primer_nombre', 191);
            $table->string('segundo_nombre', 191);
            $table->string('apellido_paterno', 191);
            $table->string('apellido_materno', 191);
            $table->string('codigo_funcionario', 191);
            $table->string('correo_institucional', 191);
            $table->string('grado', 191);
            $table->string('codigo_alta_reparticion', 191);
            $table->string('descripcion_alta_reparticion', 191);
            $table->string('codigo_reparticion', 191)->nullable();
            $table->string('descripcion_reparticion', 191)->nullable();
            $table->string('codigo_destacamento', 191)->nullable();
            $table->string('descripcion_destacamento', 191)->nullable();
            $table->string('codigo_unidad', 191)->nullable();
            $table->string('descripcion_unidad', 191)->nullable();
            $table->string('codigo_dotacion', 191);
            $table->string('dotacion', 191);
            $table->string('escalafon', 191);
            $table->string('sancion', 191);
            $table->string('estado_sancion', 191);
            $table->string('fecha_sancion', 191);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('involucrados');
    }
};
