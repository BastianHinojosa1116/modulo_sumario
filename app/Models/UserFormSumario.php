<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class UserFormSumario
 * 
 * @property int $id
 * @property int $user_id
 * @property int $form_sumario_id
 * @property string $rol
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property FormularioDisponeSumario $formulario_dispone_sumario
 * @property User $user
 *
 * @package App\Models
 */
class UserFormSumario extends Model
{
	use SoftDeletes;
	protected $table = 'user_form_sumario';

	protected $casts = [
		'user_id' => 'int',
		'form_sumario_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'form_sumario_id',
		'rol'
	];

	public function formulario_dispone_sumario()
	{
		return $this->belongsTo(FormularioDisponeSumario::class, 'form_sumario_id');
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
