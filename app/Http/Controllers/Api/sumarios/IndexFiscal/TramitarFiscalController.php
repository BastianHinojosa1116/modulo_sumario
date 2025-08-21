<?php

namespace App\Http\Controllers\Api\sumarios\IndexFiscal;

use App\Http\Controllers\Controller;
use App\Models\FormularioDisponeSumario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\EstadosSumario;
use App\Models\EstadosFormSumario;
use Carbon\Carbon;

class TramitarFiscalController extends Controller
{

public function tramitarFiscal(Request $request)
{
    $request->validate([
        'id' => 'required|integer|exists:formulario_dispone_sumario,id',
        'accion' => 'required|string',
        'documento' => 'required|file|mimes:pdf|max:10240'
    ]);

    $sumario = FormularioDisponeSumario::findOrFail($request->id);

    if ($request->hasFile('documento')) {
        $archivo = $request->file('documento');

        if ($archivo->isValid()) {
            $ruta = 'documentos/' . $sumario->sumario_numero_rol;
            $path = $archivo->store($ruta, 'private');

            $sumario->documento_sumario = $path;
            $sumario->estado_sumario = $request->accion;
            $sumario->save();

            $estado = EstadosSumario::create([
                'fecha_estado' => now()->format('d-m-Y'),
                'documento_estado' => $path,
                'descripcion_estado' => $request->accion . ' cargada'
            ]);

            EstadosFormSumario::create([
                'estado_sumario_id' => $estado->id,
                'sumario_id' => $sumario->id
            ]);

            return response()->json([
                'message' => 'Archivo cargado correctamente y estado actualizado',
                'path' => $path
            ]);
        } else {
            return response()->json([
                'message' => 'El archivo no es válido'
            ], 400);
        }
    } else {
        return response()->json([
            'message' => 'No se recibió ningún archivo'
        ], 400);
    }
}




}