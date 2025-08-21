<?php

namespace App\Http\Controllers\Api\sumarios\IndexAsesorJuridico;

use App\Http\Controllers\Controller;
use App\Models\FormularioDisponeSumario;
use Illuminate\Http\Request;

class IndexAsesorJuridicoController extends Controller
{
 public function index(Request $request)
{
    $search = $request->get('search');

    $query = FormularioDisponeSumario::with([
        'user_form_sumarios.user',
        'involucrados_sumarios.involucrado',
        'estados_form_sumarios.estados_sumario'
    ])
    ->whereHas('estados_form_sumarios.estados_sumario', function ($q) {
        $q->whereIn('estado_sumario', [
            'Revisión asesor jurídico',
            'Acepta prórroga revisión asesor jurídico',
            'Rechaza prórroga revisión asesor jurídico'
        ]);
    })
    ->whereHas('user_form_sumarios', function ($q) {
        $q->where('rol', 'Fiscal');
    });

    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('sumario_numero_rol', 'like', '%' . $search . '%')
              ->orWhere('subMotivo', 'like', '%' . $search . '%');
        });
    }

    $sumarios = $query->orderByDesc('id')->paginate(10);

    return response()->json($sumarios);
}



}