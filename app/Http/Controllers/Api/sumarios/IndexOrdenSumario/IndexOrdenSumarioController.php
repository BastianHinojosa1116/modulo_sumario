<?php

namespace App\Http\Controllers\Api\sumarios\IndexOrdenSumario;

use App\Http\Controllers\Controller;
use App\Models\EstadosFormSumario;
use App\Models\EstadosSumario;
use App\Models\FormularioDisponeSumario;
use Carbon\Carbon;
use Illuminate\Http\Request;

class IndexOrdenSumarioController extends Controller
{

   public function index()
{
    $sumarios = FormularioDisponeSumario::with([
        'user_form_sumarios.user', // usuarios asociados
        'involucrados_sumarios.involucrado',   // involucrados en el sumario
        
    ])
    ->where('estado_sumario', 'Pendiente Orden Sumario')
    ->orderBy('id','desc')
    ->paginate(10);

    return response()->json($sumarios);
}



    public function selectCambiarEstadoSumario(Request $request)
    {
        $sumario = FormularioDisponeSumario::findOrFail($request->id);
        $sumario->estado_sumario = $request->estado_sumario; // 🛠 cambiamos el campo
        $sumario->save();

        // Crear nuevo estado asociado al sumario
        $nuevoEstado = EstadosSumario::create([
            'fecha_estado' => Carbon::parse($sumario->updated_at)->format('d-m-Y'),
            'documento_estado' => "Carga Orden Sumario",
            'descripcion_estado' => $request->estado_sumario,
        ]);

        // Registrar la relación entre el estado y el sumario
        EstadosFormSumario::create([
            'estado_pd_id' => $nuevoEstado->id,
            'sumario_id' => $sumario->id, // 🛠 esto debe coincidir con tu tabla intermedia
        ]);

        return response()->json([
            'message' => 'El sumario con número de rol ' . $sumario->sumario_numero_rol .
                ' fue actualizado al estado: ' . $sumario->estado_sumario
        ]);
    }

    public function store(Request $request)
   {
    // Validar inputs básicos
        $request->validate([
            'id' => 'required|integer|exists:formulario_dispone_sumario,id',
            'documento_sumario' => 'required|file|mimes:pdf|max:20480'
        ]);
  

    // Buscar el sumario
    $sumario = FormularioDisponeSumario::findOrFail($request->id);

    // Verificar archivo
   if ($request->hasFile('documento_sumario')) {
    $archivo = $request->file('documento_sumario');

    if ($archivo->isValid()) {
        //   RUTA DE ALMACENAMIENTO
        $ruta = 'documentos/' . $sumario->sumario_numero_rol;
        $path = $archivo->store($ruta, 'private');

        $sumario->documento_sumario = $path;
        $sumario->estado_sumario = 'Orden de Sumario Cargada';
        $sumario->save();

        // Registro de estado actualizado
        $estado = EstadosSumario::create([
            'fecha_estado' => now()->format('d-m-Y'),
            'documento_estado' => $path,
            'descripcion_estado' => 'Orden de Sumario Cargada'
        ]);



            // Crear relación estado ↔ sumario
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
