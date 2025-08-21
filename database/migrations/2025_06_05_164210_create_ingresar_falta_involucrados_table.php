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
        Schema::create('ingresar_falta_involucrados', function (Blueprint $table) {
            $table->bigInteger('ingresar_falta_id')->index('ingresar_falta_involucrados_ingresar_falta_id_foreign');
            $table->bigInteger('involucrado_id')->index('ingresar_falta_involucrados_involucrado_id_foreign');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingresar_falta_involucrados');
    }
};
