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
        Schema::create('involucrados_sumario', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->timestamps();
            $table->bigInteger('involucrado_id')->index('involucrados_sumario_involucrado_id_foreign');
            $table->bigInteger('sumario_id')->index('involucrados_sumarios_sumario_id_foreign');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('involucrados_sumario');
    }
};
