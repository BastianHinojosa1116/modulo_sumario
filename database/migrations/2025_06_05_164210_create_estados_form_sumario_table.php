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
        Schema::create('estados_form_sumario', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->timestamps();
            $table->bigInteger('estado_sumario_id')->index('estados_sumario_estado_pd_id_foreign');
            $table->bigInteger('sumario_id')->index('estados_sumarios_sumario_id_foreign');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estados_form_sumario');
    }
};
