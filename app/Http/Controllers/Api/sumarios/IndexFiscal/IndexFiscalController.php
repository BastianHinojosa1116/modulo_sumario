<?php

namespace App\Http\Controllers\Api\sumarios\IndexFiscal;

use App\Http\Controllers\Controller;
use App\Models\FormularioDisponeSumario;
use Illuminate\Http\Request;

class IndexFiscalController extends Controller
{
     

  public function index(Request $request)
{
    $rut = $request->get('rut');
    $search = $request->get('search');

    $query = FormularioDisponeSumario::with([
         'user_form_sumarios.user',
         'involucrados_sumarios.involucrado',
         'estados_form_sumarios.estados_sumario' 

          ])

    ->whereIn('estado_sumario', ['Orden de Sumario Cargada', 'Aceptación de cargo'])
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