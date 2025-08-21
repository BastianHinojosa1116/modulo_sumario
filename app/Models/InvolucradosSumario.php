<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class involucradosSumario extends Model
{
    use HasFactory;

    protected $table = 'involucrados_sumario';
    protected $fillable = ['sumario_id', 'involucrado_id'];

    public function involucrado()
{
    return $this->belongsTo(Involucrado::class, 'involucrado_id');
}

}

