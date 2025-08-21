<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class IngresarFalta
 * 
 * @property int $id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $numero_rol
 * @property string $fecha_ingreso
 * @property string $fecha_comision_falta
 * @property string $causales
 * @property string $descripcion_hecho
 * @property string $documento_informa_falta
 * @property string $estado_proceso
 * @property string $fecha_cambio_estado_falta
 * @property string $documento_proceso_administrativo
 * @property string $proceso_administrativo
 * @property string $fecha_proceso_administrativo
 * @property string $fecha_suspension_procedimiento
 * @property string $resolucion_suspension_procedimiento
 * @property string $fecha_reapertura
 * @property string $documento_fundamento_reapertura
 * @property string $falta_id_alta_reparticion
 * @property string $falta_nombre_alta_reparticion
 * @property string $falta_id_reparticion
 * @property string $falta_nombre_reparticion
 * @property string $falta_id_unidad
 * @property string $falta_nombre_unidad
 * @property string $falta_id_destacamento
 * @property string $falta_nombre_destacamento
 * @property string $falta_nombre_direccion_resuelve
 * @property string $falta_id_direccion_resuelve
 * @property string $documento_informe_juridico
 * @property string $documento_dispone_asesor
 * @property string $fecha_asesor_juridico
 * @property string $fecha_informe_juridico
 * 
 * @property Collection|AsesorJuridico[] $asesor_juridicos
 * @property Collection|Involucrado[] $involucrados
 *
 * @package App\Models
 */
class IngresarFalta extends Model
{
	protected $table = 'ingresar_faltas';

	protected $fillable = [
		'numero_rol',
		'fecha_ingreso',
		'fecha_comision_falta',
		'causales',
		'descripcion_hecho',
		'documento_informa_falta',
		'estado_proceso',
		'fecha_cambio_estado_falta',
		'documento_proceso_administrativo',
		'proceso_administrativo',
		'fecha_proceso_administrativo',
		'fecha_suspension_procedimiento',
		'resolucion_suspension_procedimiento',
		'fecha_reapertura',
		'documento_fundamento_reapertura',
		'falta_id_alta_reparticion',
		'falta_nombre_alta_reparticion',
		'falta_id_reparticion',
		'falta_nombre_reparticion',
		'falta_id_unidad',
		'falta_nombre_unidad',
		'falta_id_destacamento',
		'falta_nombre_destacamento',
		'falta_nombre_direccion_resuelve',
		'falta_id_direccion_resuelve',
		'documento_informe_juridico',
		'documento_dispone_asesor',
		'fecha_asesor_juridico',
		'fecha_informe_juridico'
	];

	public function asesor_juridicos()
	{
		return $this->belongsToMany(AsesorJuridico::class, 'ingresar_falta_asesor_juridicos');
	}

	public function involucrados()
	{
		return $this->belongsToMany(Involucrado::class, 'ingresar_falta_involucrados');
	}
}
