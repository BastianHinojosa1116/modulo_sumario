<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class InvolucradoSancion
 * 
 * @property int $involucrado_id
 * @property int $sancion_id
 * 
 * @property Involucrado $involucrado
 * @property Sancion $sancion
 *
 * @package App\Models
 */
class InvolucradoSancion extends Model
{
	protected $table = 'involucrado_sancions';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'involucrado_id' => 'int',
		'sancion_id' => 'int'
	];

	protected $fillable = [
		'involucrado_id',
		'sancion_id'
	];

	public function involucrado()
	{
		return $this->belongsTo(Involucrado::class);
	}

	public function sancion()
	{
		return $this->belongsTo(Sancion::class);
	}
}
