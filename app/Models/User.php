<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class User
 * 
 * @property int $id
 * @property string $name
 * @property string $rut
 * @property string $primer_nombre
 * @property string $segundo_nombre
 * @property string $apellido_paterno
 * @property string $apellido_materno
 * @property string $codigo_funcionario
 * @property string $correo_institucional
 * @property string $grado
 * @property string $codigo_alta_reparticion
 * @property string $descripcion_alta_reparticion
 * @property string|null $codigo_reparticion
 * @property string|null $descripcion_reparticion
 * @property string|null $codigo_destacamento
 * @property string|null $descripcion_destacamento
 * @property string|null $codigo_unidad
 * @property string|null $descripcion_unidad
 * @property string $codigo_dotacion
 * @property string $dotacion
 * @property string $escalafon
 * @property string $cargo
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Collection|UserFormSumario[] $user_form_sumarios
 *
 * @package App\Models
 */
class User extends Model
{
	use SoftDeletes;
	protected $table = 'users';

	protected $casts = [
		'email_verified_at' => 'datetime'
	];

	protected $hidden = [
		'password',
		'remember_token'
	];

	protected $fillable = [
		'name',
		'rut',
		'primer_nombre',
		'segundo_nombre',
		'apellido_paterno',
		'apellido_materno',
		'codigo_funcionario',
		'correo_institucional',
		'grado',
		'codigo_alta_reparticion',
		'descripcion_alta_reparticion',
		'codigo_reparticion',
		'descripcion_reparticion',
		'codigo_destacamento',
		'descripcion_destacamento',
		'codigo_unidad',
		'descripcion_unidad',
		'codigo_dotacion',
		'dotacion',
		'escalafon',
		'cargo',
		'email_verified_at',
		'password',
		'remember_token'
	];

	public function user_form_sumarios()
	{
		return $this->hasMany(UserFormSumario::class);
	}
}
