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
        Schema::table('user_form_sumario', function (Blueprint $table) {
            $table->foreign(['form_sumario_id'], 'fk_uf_formulario')->references(['id'])->on('formulario_dispone_sumario')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['user_id'], 'fk_uf_user')->references(['id'])->on('users')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_form_sumario', function (Blueprint $table) {
            $table->dropForeign('fk_uf_formulario');
            $table->dropForeign('fk_uf_user');
        });
    }
};
