<?php

namespace App\Http\Controllers\Api\sumarios\IndexTramita;

use App\Http\Controllers\Controller;
use App\Models\FormularioDisponeSumario;
use App\Models\User;
use Illuminate\Http\Request;

class IndexTramitaController extends Controller
{
    public function indexPorRut(Request $request)
    {
        $rut = $request->input('rut');

        $user = User::where('rut', $rut)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $formularios = FormularioDisponeSumario::whereHas('user_form_sumarios', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                  ->where('rol', 'Tramita');
        })
        ->with(['user_form_sumarios.user', 'involucrados_sumarios.involucrado'])
        ->orderBy('id', 'desc')
        ->paginate(10);

        return response()->json($formularios);
    }

    public function index(Request $request)
{
    $rut = $request->get('rut');
    $search = $request->get('search');

    $query = FormularioDisponeSumario::with([
         'user_form_sumarios.user',
         'involucrados_sumarios.involucrado',
         'estados_form_sumarios.estados_sumario' 
          ])
    ->whereIn('estado_sumario', ['Vista fiscal cargada'])
    ->whereHas('user_form_sumarios', function ($q) use ($rut) {
        $q->where('rol', 'Dispone')
          ->whereHas('user', function ($subQuery) use ($rut) {
              $subQuery->where('rut', $rut);
          });
    });

    if ($search) {
        $query->where('sumario_numero_rol', 'like', '%' . $search . '%');
    }

    $sumarios = $query->orderByDesc('id')->paginate(10);

    return response()->json($sumarios);
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