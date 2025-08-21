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
        Schema::create('users', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('name', 191);
            $table->string('rut', 191)->unique('rut');
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
            $table->string('cargo', 191);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password', 191);
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
