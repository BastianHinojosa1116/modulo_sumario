<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class IngresarFaltaAsesorJuridico
 * 
 * @property int $ingresar_falta_id
 * @property int $asesor_juridico_id
 * 
 * @property AsesorJuridico $asesor_juridico
 * @property IngresarFalta $ingresar_falta
 *
 * @package App\Models
 */
class IngresarFaltaAsesorJuridico extends Model
{
	protected $table = 'ingresar_falta_asesor_juridicos';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'ingresar_falta_id' => 'int',
		'asesor_juridico_id' => 'int'
	];

	protected $fillable = [
		'ingresar_falta_id',
		'asesor_juridico_id'
	];

	public function asesor_juridico()
	{
		return $this->belongsTo(AsesorJuridico::class);
	}

	public function ingresar_falta()
	{
		return $this->belongsTo(IngresarFalta::class);
	}
}
