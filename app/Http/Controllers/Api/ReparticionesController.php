<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reparticion;
use Illuminate\Http\Request;

class ReparticionesController extends Controller
{
    public function altaReparticion()
    {
        //
        $altasReparticiones = altasReparticiones();
        return response()->json($altasReparticiones, 200);
    }

    public function reparticion(Request $request)
    {
        //return response()->json("maikol".$request->altaReparticionId, 200);
        $reparticiones = reparticiones($request->altaReparticionId);
        return response()->json($reparticiones, 200);
    }

    public function unidad(Request $request)
    {
        //return response()->json("maikol".$request->reparticionId, 200);
        $unidades = unidades($request->reparticionId);
        return response()->json($unidades, 200);
    }

    public function destacamento(Request $request)
    {
        //return response()->json("maikol".$request->reparticionId, 200);
        $destacamentos = dotaciones($request->unidadId);
        return response()->json($destacamentos, 200);
    }

    public function searchDotacion(Request $request) {

        // Obtener el valor del input text
        return response()->json("hola", 200);

    }

    public function selectDotacion(Request $request) {
        // Obtener el valor del input text;
        $valor = $request->input('dotacion');

        // Realizar la búsqueda en la fuente de datos
        $dotacion = Reparticion::campos()->where('ESTADO_VIGENCIA', 0)->where('CORRELATIVO', $valor)->first();

        // Devolver los resultados coincidentes en formato JSON
        return response()->json($dotacion);
    }


    public function index()
    {
        //
    }


    public function store(Request $request)
    {
        //
    }

    public function show($id)
    {
        //
    }


    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}
