<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reparticion extends Model
{
    use HasFactory;

    protected $connection = 'mysql2';
    protected $table = 'REPARTICION';

    protected $fillable = ['id', 'nombre'];

    public function scopeCampos($query) {
        return $query->select(
            'CORRELATIVO as id', 'DESCRIPCION as nombre', 
            'TIPO_REPARTICION as tipo', 'ID_TIPO as id_tipo', 
            'ID_CODIGO_VIGENTE as cod_vigente', 
            'CODIGO_DEPENDENCIA as cod_dependencia', 'CODIGO_ALTA_REPARTICION as cod_alta_reparticion',
            'CODIGO_REPARTICION as cod_reparticion', 'CODIGO_UNIDAD as cod_unidad', 
            'CODIGO_DESTACAMENTO as cod_destacamento'
        )
        ->selectRaw('if(ESTADO_VIGENCIA = 0, 1, 0) as cod_estado, if(ESTADO_VIGENCIA = 0, "Activo", "Inactivo") as estado');
    }

    // //Relación
    // public function constancia() {
    //     return $this->hasMany(Constancia::class);
    // }

    // Repartición Funcionario
    public function scopeReparticionFuncionario($query, $codReparticion) {
        return $query->where('ID_CODIGO_VIGENTE', $codReparticion);
    }

    // Alta Repartición Funcionario
    public function scopeAltaReparticionFuncionario($query, $codAltaReparticion) {
        //return Reparticion::where('CORRELATIVO', $this->CODIGO_ALTA_REPARTICION)->first();
        return $query->where('ESTADO_VIGENCIA', 0)
            ->where([
                /*['ID_TIPO', 20],
                ['TIPO_REPARTICION', 'D'],*/
                ['CODIGO_DEPENDENCIA', $codAltaReparticion]
            ])
            /*->orWhere([
                ['ID_TIPO', 63],
                ['TIPO_REPARTICION', 'Z'],
            ])*/;
    }

    public function scopeDotacion($query, $codUnidad) {
        return $query->where('ESTADO_VIGENCIA', 0)
            ->where('CODIGO_DEPENDENCIA', $codUnidad)
            ->orWhere('CODIGO_REPARTICION', $codUnidad)
            ->orWhere('CODIGO_UNIDAD', $codUnidad);
    }

    public function scopeUnidad($query, $codReparticion) {
        return $query->where('ESTADO_VIGENCIA', 0)
            //->whereNotIn('TIPO_REPARTICION', ['D', 'DO', 'SO', 'DE', 'Z', 'PE', 'CO', 'P', 'S', 'T', 'R'])
            ->where([
                //Descartar oficinas
                ['ID_TIPO', '!=', 38],
                ['CODIGO_REPARTICION', $codReparticion]
            ])
            ->orWhere('CODIGO_UNIDAD', $codReparticion);
            
    }
    
    // Prefectura o Departamento
    public function scopeReparticion($query, $codAltaReparticion) {
        return $query->where('ESTADO_VIGENCIA', 0)
            //->whereIn('TIPO_REPARTICION', ['PE', 'CO', 'DO', 'SO', 'O', 'P', 'DE'])
            ->where([
                ['ID_TIPO', 43],
                ['CODIGO_ALTA_REPARTICION', $codAltaReparticion]
            ])
            ->orWhere([
                ['ID_TIPO', 18],
                ['CODIGO_ALTA_REPARTICION', $codAltaReparticion]
            ])
            ->orWhere([
                ['TIPO_REPARTICION', 'P'],
                ['CODIGO_ALTA_REPARTICION', $codAltaReparticion]
            ])
            ->orWhere([
                ['TIPO_REPARTICION', 'DE'],
                ['CODIGO_ALTA_REPARTICION', $codAltaReparticion]
            ])
            /*->where([
                ['ID_TIPO', 43],
                //['TIPO_REPARTICION', 'P'],
                ['CODIGO_DEPENDENCIA', $codAltaReparticion]
            ])
            ->orWhere([
                ['ID_TIPO', 18],
                ['TIPO_REPARTICION', 'DE'],
                ['CODIGO_DEPENDENCIA', $codAltaReparticion]
            ])*/;
    }

    // Zona o Dirección
    public function scopeAltaReparticion($query, $correlativo) {
        return $query->where('ESTADO_VIGENCIA', 0)
            ->where([
                ['ID_TIPO', 20],
                ['TIPO_REPARTICION', 'D'],
                ['CORRELATIVO', $correlativo]
            ])
            ->Orwhere([
                ['ID_TIPO', 63],
                ['TIPO_REPARTICION', 'Z'],
                ['CORRELATIVO', $correlativo]
            ]);
    }

    // Zonas y Direcciones
    public function scopeAltasReparticiones($query) {
        return $query->where('ESTADO_VIGENCIA', 0)
            ->where([
                ['ID_TIPO', 20],
                ['TIPO_REPARTICION', 'D'],
            ])
            ->orWhere([
                ['ID_TIPO', 63],
                ['TIPO_REPARTICION', 'Z'],
            ]);
    }

    //ESTADO VIGENTE (ACTIVO)
    public function scopeVigente($query, $estado = 0) {
        if ($estado != 0) {
            return $query->where('ESTADO_VIGENCIA', $estado);
        }

        return $query->where('ESTADO_VIGENCIA', 0);
    }
}