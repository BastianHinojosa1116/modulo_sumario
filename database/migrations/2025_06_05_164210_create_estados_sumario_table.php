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
        Schema::create('estados_sumario', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->timestamps();
            $table->string('descripcion_estado', 191);
            $table->string('documento_estado', 191);
            $table->string('fecha_estado', 191);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estados_sumario');
    }
};
