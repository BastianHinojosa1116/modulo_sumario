<?php

namespace App\Http\Controllers\Api\sumarios\TramitaSumario;


use App\Http\Controllers\Controller;
use App\Models\FormularioDisponeSumario;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class IndexTramitaController extends Controller
{   
    public function index(Request $request)
{
  try {
            $rut = $request->get('rut');
            $search = $request->get('search');

            

            if (!$rut) {
              
                return response()->json(['error' => 'Parámetro rut requerido'], 400);
            }

            $query = FormularioDisponeSumario::with([
                'user_form_sumarios.user',
                'involucrados_sumarios.involucrado',
                'estados_form_sumarios.estados_sumario'
            ])
            ->whereIn('estado_sumario', ['Vista fiscal', 'Prórroga vista fiscal' , 'Inhabilita','Dispone revisión asesor jurídico'])
            ->whereHas('user_form_sumarios', function ($q) use ($rut) {
                $q->where('rol', 'Fiscal')
                  ->whereHas('user', function ($subQuery) use ($rut) {
                      $subQuery->where('rut', $rut);
                  });
            });

            if ($search) {
                $query->where('sumario_numero_rol', 'like', '%' . $search . '%');
            }

            $sumarios = $query->orderByDesc('id')->paginate(10);

             

            return response()->json($sumarios);
        } catch (\Exception $e) {
            Log::error('❌ Error en IndexTramitaController@index', [
                'mensaje' => $e->getMessage(),
                'archivo' => $e->getFile(),
                'línea' => $e->getLine()
            ]);

            return response()->json([
                'error' => 'Error interno del servidor',
                'detalle' => $e->getMessage()
            ], 500);
        }


}

public function show($id)
{
    $sumario = FormularioDisponeSumario::with([
        'user_form_sumarios.user',
        'involucrados_sumarios.involucrado',
        'estados_form_sumarios.estados_sumario'
    ])->findOrFail($id);

    return response()->json($sumario);
}
}