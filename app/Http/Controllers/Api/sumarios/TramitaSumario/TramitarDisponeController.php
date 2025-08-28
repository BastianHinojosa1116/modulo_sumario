<?php

namespace App\Http\Controllers\Api\sumarios\TramitaSumario;

use App\Http\Controllers\Controller;
use App\Models\FormularioDisponeSumario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\EstadosSumario;
use App\Models\EstadosFormSumario;
use Carbon\Carbon;
use App\Models\UserFormSumario;

class TramitarDisponeController extends Controller
{
public function tramitarDispone(Request $request)
{
    Log::info('[ACCION_SUMARIO] Iniciando acción sobre sumario');

    $request->validate([
        'id' => 'required|integer|exists:formulario_dispone_sumario,id',
        'accion' => 'required|string',
        'documento' => 'required|file|mimes:pdf|max:10240',
        

    ]);

    $sumario = FormularioDisponeSumario::findOrFail($request->id);
    $numeroRol = $sumario->sumario_numero_rol ?? 'sin_rol';

    // Guardar archivo
    $rutaCarpeta = "documentos/{$numeroRol}";
    $path = $request->file('documento')->store($rutaCarpeta, 'private');

    Log::info('[ACCION_SUMARIO] Documento guardado', ['path' => $path]);
    if ($request->filled('plazo')) {
    $sumario->plazo = date('d-m-Y', strtotime($request->plazo));

  
    }

    $sumario->documento_sumario = $path;
    $sumario->estado_sumario = $request->accion;
    $sumario->save(); // ← guarda todo junto


    // Registrar estado
    $estado = EstadosSumario::create([
        'fecha_estado' => Carbon::now()->format('d-m-Y'),
        'documento_estado' => $path,
        'descripcion_estado' => $request->accion . ' cargada'
    ]);

    EstadosFormSumario::create([
        'estado_sumario_id' => $estado->id,
        'sumario_id' => $sumario->id
    ]);

    if ($request->accion === 'Dispone revisión asesor jurídico' && $request->filled('rut_asesor_juridico')) {
    $user = \App\Models\User::where('rut', $request->rut_asesor_juridico)->first();

    if ($user) {

        

        UserFormSumario::create([
            'user_id' => $user->id,
            'form_sumario_id' => $sumario->id,
            'rol' => 'Asesor jurídico'
        ]);

        Log::info('[ACCION_SUMARIO] Asesor jurídico vinculado', ['user_id' => $user->id]);
        Log::info('[ACCION_SUMARIO] Request recibido', $request->all());


        return response()->json([
            'message' => 'Asesor jurídico asignado correctamente',
            'estado' => $request->accion,
            'ruta_documento' => $path
        ]);
    } else {
        Log::warning('[ACCION_SUMARIO] RUT no encontrado', ['rut' => $request->rut_asesor_juridico]);

        return response()->json([
            'message' => 'No se encontró el RUT como asesor jurídico',
            'estado' => $request->accion,
            'ruta_documento' => $path
        ], 404);
    }
    }

    
    


    

    return response()->json([
        'message' => "Acción realizada correctamente",
        'estado' => $request->accion,
        'ruta_documento' => $path
    ]);

    
    
}


}