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
public function tramitarDispone(Request $request)
{
    Log::info('[ACCION_SUMARIO] Iniciando acción sobre sumario');

    $request->validate([
        'id' => 'required|integer|exists:formulario_dispone_sumario,id',
         'accion' => 'required|in:Aceptación de cargo,Inhabilita',
        'documento' => 'required|file|mimes:pdf|max:10240'
    ]);

    $sumario = FormularioDisponeSumario::findOrFail($request->id);
    $numeroRol = $sumario->sumario_numero_rol ?? 'sin_rol';

    // Determinar nombre y estado según acción
    $nombreArchivo = $request->accion === 'Aceptación de cargo'

        ? 'aceptacion_cargo_' . time() . '.pdf'
        : 'inhabilita_cargo_' . time() . '.pdf';

    $nuevoEstado = $request->accion === 'Aceptación de cargo'

        ? 'Aceptación de cargo'
        : 'Cargo Inhabilitado';

    
    $descripcionEstado = $request->accion === 'Aceptación de cargo'

        ? 'Aceptación de cargo cargada'
        : 'Inhabilitación cargada';

    // Guardar archivo
    $rutaCarpeta = "documentos/{$numeroRol}";
    $path = $request->file('documento')->store($rutaCarpeta, 'private');

    Log::info('[ACCION_SUMARIO] Documento guardado', ['path' => $path]);

    // Actualizar sumario
    $sumario->documento_sumario = $path;
    $sumario->estado_sumario = $nuevoEstado;
    $sumario->save();

    // Registrar estado
    $estado = EstadosSumario::create([
        'fecha_estado' => Carbon::now()->format('d-m-Y'),
        'documento_estado' => $path,
        'descripcion_estado' => $descripcionEstado,
    ]);

    EstadosFormSumario::create([
        'estado_sumario_id' => $estado->id,
        'sumario_id' => $sumario->id,
    ]);

    Log::info('[ACCION_SUMARIO] Estado registrado correctamente');

    return response()->json([
        'message' => "Acción '{$nuevoEstado}' realizada correctamente.",
        'estado' => $nuevoEstado,
        'ruta_documento' => $path
    ]);
    
}


}