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
        Schema::create('involucrado_sancions', function (Blueprint $table) {
            $table->bigInteger('involucrado_id')->index('involucrado_sancions_involucrado_id_foreign');
            $table->bigInteger('sancion_id')->index('involucrado_sancions_sancion_id_foreign');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('involucrado_sancions');
    }
};
