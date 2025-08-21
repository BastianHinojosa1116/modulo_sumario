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
 * Class FormularioDisponeSumario
 * 
 * @property int $id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $fecha_ingreso_formulario
 * @property string $plazo
 * @property string $sumario_numero_rol
 * @property string $fecha_dispone_sumario
 * @property string $documento_sumario
 * @property string $motivo
 * @property string $subMotivo
 * @property string $descripcion_hecho
 * @property string $estado_sumario
 * @property string|null $deleted_at
 * 
 * @property Collection|EstadosFormSumario[] $estados_form_sumarios
 * @property Collection|InvolucradosSumario[] $involucrados_sumarios
 * @property Collection|UserFormSumario[] $user_form_sumarios
 *
 * @package App\Models
 */
class FormularioDisponeSumario extends Model
{
	use SoftDeletes;
	protected $table = 'formulario_dispone_sumario';

	protected $fillable = [
		'fecha_ingreso_formulario',
		'plazo',
		'sumario_numero_rol',
		'fecha_dispone_sumario',
		'documento_sumario',
		'motivo',
		'subMotivo',
		'descripcion_hecho',
		'estado_sumario',
		'nro_documento_dispone_sumario',         
		'fecha_documento_dispone_sumario'
	];

	public function estados_form_sumarios()
	{
		return $this->hasMany(EstadosFormSumario::class, 'sumario_id');
	}

	public function involucrados_sumarios()
	{
		return $this->hasMany(InvolucradosSumario::class, 'sumario_id');
	}

	public function user_form_sumarios()
	{
		return $this->hasMany(UserFormSumario::class, 'form_sumario_id');
	}
}
