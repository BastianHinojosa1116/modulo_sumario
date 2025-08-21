<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class IngresarFaltaInvolucrado
 * 
 * @property int $ingresar_falta_id
 * @property int $involucrado_id
 * 
 * @property IngresarFalta $ingresar_falta
 * @property Involucrado $involucrado
 *
 * @package App\Models
 */
class IngresarFaltaInvolucrado extends Model
{
	protected $table = 'ingresar_falta_involucrados';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'ingresar_falta_id' => 'int',
		'involucrado_id' => 'int'
	];

	protected $fillable = [
		'ingresar_falta_id',
		'involucrado_id'
	];

	public function ingresar_falta()
	{
		return $this->belongsTo(IngresarFalta::class);
	}

	public function involucrado()
	{
		return $this->belongsTo(Involucrado::class);
	}
}
