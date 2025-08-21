<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class EstadosFormSumario
 * 
 * @property int $id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int $estado_sumario_id
 * @property int $sumario_id
 * 
 * @property EstadosSumario $estados_sumario
 * @property FormularioDisponeSumario $formulario_dispone_sumario
 *
 * @package App\Models
 */
class EstadosFormSumario extends Model
{
	protected $table = 'estados_form_sumario';

	protected $casts = [
		'estado_sumario_id' => 'int',
		'sumario_id' => 'int'
	];

	protected $fillable = [
		'estado_sumario_id',
		'sumario_id'
	];

	public function estados_sumario()
	{
		return $this->belongsTo(EstadosSumario::class, 'estado_sumario_id');
	}

	public function formulario_dispone_sumario()
	{
		return $this->belongsTo(FormularioDisponeSumario::class, 'sumario_id');
	}
}
