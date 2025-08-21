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
        Schema::create('ingresar_faltas', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->timestamps();
            $table->string('numero_rol', 191);
            $table->string('fecha_ingreso', 191);
            $table->string('fecha_comision_falta', 191);
            $table->string('causales', 191);
            $table->text('descripcion_hecho');
            $table->string('documento_informa_falta', 191);
            $table->string('estado_proceso', 191);
            $table->string('fecha_cambio_estado_falta', 191);
            $table->string('documento_proceso_administrativo', 191);
            $table->string('proceso_administrativo', 191);
            $table->string('fecha_proceso_administrativo', 191);
            $table->string('fecha_suspension_procedimiento', 191);
            $table->string('resolucion_suspension_procedimiento', 191);
            $table->string('fecha_reapertura', 191);
            $table->string('documento_fundamento_reapertura', 191);
            $table->string('falta_id_alta_reparticion', 191);
            $table->string('falta_nombre_alta_reparticion', 191);
            $table->string('falta_id_reparticion', 191);
            $table->string('falta_nombre_reparticion', 191);
            $table->string('falta_id_unidad', 191);
            $table->string('falta_nombre_unidad', 191);
            $table->string('falta_id_destacamento', 191);
            $table->string('falta_nombre_destacamento', 191);
            $table->string('falta_nombre_direccion_resuelve', 191);
            $table->string('falta_id_direccion_resuelve', 191);
            $table->string('documento_informe_juridico', 191);
            $table->string('documento_dispone_asesor', 191);
            $table->string('fecha_asesor_juridico', 191);
            $table->string('fecha_informe_juridico', 191);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingresar_faltas');
    }
};
