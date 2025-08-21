<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Bitacora
 * 
 * @property int $id
 * @property string $description
 * @property string $user_rut
 * @property string $ip
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class Bitacora extends Model
{
	protected $table = 'bitacoras';

	protected $fillable = [
		'description',
		'user_rut',
		'ip'
	];
}
