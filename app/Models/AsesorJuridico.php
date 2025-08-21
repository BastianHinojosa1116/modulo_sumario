<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class AsesorJuridico
 * 
 * @property int $id
 * @property string $name
 * @property string $rut
 * @property string $numero_rol_falta
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
 * @property string $documento_informe_juridico
 * @property string $documento_dispone_asesor
 * @property string $fecha_asesor_juridico
 * @property string $fecha_informe_juridico
 * @property string $fecha_sancion
 * @property string $tipo_sancion
 * @property string $resolucion_sancion
 * @property string $proceso_administrativo
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|IngresarFalta[] $ingresar_faltas
 *
 * @package App\Models
 */
class AsesorJuridico extends Model
{
	protected $table = 'asesor_juridicos';

	protected $fillable = [
		'name',
		'rut',
		'numero_rol_falta',
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
		'documento_informe_juridico',
		'documento_dispone_asesor',
		'fecha_asesor_juridico',
		'fecha_informe_juridico',
		'fecha_sancion',
		'tipo_sancion',
		'resolucion_sancion',
		'proceso_administrativo'
	];

	public function ingresar_faltas()
	{
		return $this->belongsToMany(IngresarFalta::class, 'ingresar_falta_asesor_juridicos');
	}
}
