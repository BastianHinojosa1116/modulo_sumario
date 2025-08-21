<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;

use App\Models\FormularioDisponeSumario;
use App\Models\EstadosSumario;

class DocumentosController extends Controller
{
  
  public function verDocumentoInicial($id)
{
    $formulario = FormularioDisponeSumario::findOrFail($id);
    $rutaRelativa = $formulario->documento_sumario; // Asegúrate que este campo esté bien

    if (!$rutaRelativa || !Storage::disk('private')->exists($rutaRelativa)) {
        return response()->json(['message' => 'Documento no encontrado'], 404);
    }

    $contenido = Storage::disk('private')->get($rutaRelativa);
    $mime = Storage::disk('private')->mimeType($rutaRelativa);

    return response($contenido, 200)->header('Content-Type', $mime);
}

  
    public function verEstadoPDF($id)
    {

         $buscarDocumento = EstadosSumario::find($id);
        $path = storage_path('app/private/'.$buscarDocumento->documento_estado);
        // return response($path, 422);
        return response()->file($path);  


    }

   
}