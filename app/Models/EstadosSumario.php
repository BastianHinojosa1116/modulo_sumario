<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class EstadosSumario
 * 
 * @property int $id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $descripcion_estado
 * @property string $documento_estado
 * @property string $fecha_estado
 * 
 * @property Collection|EstadosFormSumario[] $estados_form_sumarios
 *
 * @package App\Models
 */
class EstadosSumario extends Model
{
	protected $table = 'estados_sumario';

	protected $fillable = [
		'descripcion_estado',
		'documento_estado',
		'fecha_estado'
	];

	public function estados_form_sumarios()
	{
		return $this->hasMany(EstadosFormSumario::class, 'estado_sumario_id');
	}
}
