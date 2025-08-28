<?php

namespace App\Http\Controllers\Api\sumarios\CambioFiscal;

use App\Http\Controllers\Controller;
use App\Models\FormularioDisponeSumario;
use Illuminate\Http\Request;

class CambioFiscalController extends Controller
{
 
    public function index(Request $request)
    {
       $search = $request->get('search');

    $query = FormularioDisponeSumario::with([
        'user_form_sumarios.user',
        'involucrados_sumarios.involucrado',
        'estados_form_sumarios.estados_sumario'
    ])
    ->whereIn('estado_sumario', [
        'Inhabilita', 'Orden de Sumario Cargada', 'Pendiente Orden Sumario','Prórroga cargo', 'Informe asesor jurídico', 'Notificación',
        'Oficio informe', 'Prórroga asesor jurídico', 'Prórroga dispone notificación',
        'Prórroga corregir', 'Acepta prórroga corregir', 'Rechaza prórroga corregir', 'Acepta Inhabilidad',
        'Prórroga notificación resolución', 'Conforme', 'No conforme', 'Superior resolutor',
        'Oficio informe corregir', 'Pendiente aceptación de cargo', 'Aceptación de cargo',
        'Rechaza inhabilidad', 'Acepta prórroga cargo', 'Rechaza prórroga cargo',
        'Dispone notificación', 'Acepta prórroga notificación', 'Rechaza prórroga notificación',
        'Corregir', 'Dispone notificación resolución', 'Acepta prórroga notificación resolución',
        'Rechaza prórroga notificación resolución', 'Resolución', 'Notificación de resolución',
        'Revisión asesor jurídico', 'Acepta prórroga revisión asesor jurídico',
        'Rechaza prórroga revisión asesor jurídico'
    ]);

    if (!empty($search)) {
        $query->where(function ($q) use ($search) {
            $q->where('sumario_numero_rol', 'like', "%{$search}%")
              ->orWhere('subMotivo', 'like', "%{$search}%");
        });
    }

    return response()->json($query->orderByDesc('id')->paginate(10));

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
