<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Sancion
 * 
 * @property int $id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $sancion
 * @property string $fecha_sancion
 * @property string $resolucion_sancion
 * @property string $dias_arresto
 * @property string $aplica_sancion
 * @property string $estado_sancion
 * @property string $resolucion_recurso
 * @property string $recurso
 * @property string $numero_rol_falta
 * @property string $conformidad_involucrado
 * 
 * @property Collection|Involucrado[] $involucrados
 *
 * @package App\Models
 */
class Sancion extends Model
{
	protected $table = 'sancions';

	protected $fillable = [
		'sancion',
		'fecha_sancion',
		'resolucion_sancion',
		'dias_arresto',
		'aplica_sancion',
		'estado_sancion',
		'resolucion_recurso',
		'recurso',
		'numero_rol_falta',
		'conformidad_involucrado'
	];

	public function involucrados()
	{
		return $this->belongsToMany(Involucrado::class, 'involucrado_sancions');
	}
}
