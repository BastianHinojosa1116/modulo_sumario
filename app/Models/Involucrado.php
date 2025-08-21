<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Involucrado
 * 
 * @property int $id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $name
 * @property string $rut_involucrado
 * @property string $numero_rol_falta
 * @property string $conformidad_involucrado
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
 * @property string $sancion
 * @property string $estado_sancion
 * @property string $fecha_sancion
 * 
 * @property Collection|IngresarFalta[] $ingresar_faltas
 * @property Collection|Sancion[] $sancions
 * @property Collection|InvolucradosSumario[] $involucrados_sumarios
 *
 * @package App\Models
 */
class Involucrado extends Model
{
	protected $table = 'involucrados';

	protected $fillable = [
		'name',
		'rut_involucrado',
		'numero_rol_falta',
		'conformidad_involucrado',
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
		'sancion',
		'estado_sancion',
		'fecha_sancion'
	];

	public function ingresar_faltas()
	{
		return $this->belongsToMany(IngresarFalta::class, 'ingresar_falta_involucrados');
	}

	public function sancions()
	{
		return $this->belongsToMany(Sancion::class, 'involucrado_sancions');
	}

	public function involucrados_sumarios()
	{
		return $this->hasMany(InvolucradosSumario::class);
	}
}
