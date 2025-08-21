<?php

namespace App\Http\Controllers\Api\sumarios\DisponerSumario;

use App\Http\Controllers\Controller;
use App\Models\EstadosFormSumario;
use App\Models\EstadosSumario;
use App\Models\FormularioDisponeSumario;
use App\Models\Involucrado;
use App\Models\InvolucradosSumario;
use App\Models\User;
use App\Models\UserFormSumario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;



class DisponerSumarioController extends Controller
{

    public function index()
    {
        //
    }

    public function disponerSumario(Request $request)
{
    Log::info('[DISPONER_SUMARIO] Iniciando procesamiento de solicitud');

    // Validación básica para evitar problemas tempranos
    $request->validate([
        'fecha_ingreso_formulario' => 'required',
        'plazo' => 'required',
        'fecha_dispone_sumario' => 'required',
        'motivo' => 'required|string',
        'fecha_documento_dispone_sumario' => 'required',
        'subMotivo' => 'required|string',
        'descripcion_hecho' => 'required|string',
        'funcionario_ingresa' => 'required|integer',
        'fiscal_asignado' => 'required|integer',
        'involucrados' => 'required|string',
    ]);

    Log::info('[DISPONER_SUMARIO] Datos validados correctamente');

    // Crear formulario
    $formulario = FormularioDisponeSumario::create([
        'fecha_ingreso_formulario' => $request->fecha_ingreso_formulario,
        'plazo' => $request->plazo,
        'fecha_dispone_sumario' => $request->fecha_dispone_sumario,
        'documento_sumario' => '',
        'motivo' => $request->motivo,
        'nro_documento_dispone_sumario' => $request->nro_documento_dispone_sumario,
        'fecha_documento_dispone_sumario' => $request->fecha_documento_dispone_sumario,
        'subMotivo' => $request->subMotivo,
        'descripcion_hecho' => $request->descripcion_hecho,
        'estado_sumario' => 'Pendiente Orden Sumario',
        'sumario_numero_rol' => ''
    ]);

    Log::info('[DISPONER_SUMARIO] Formulario creado', ['id' => $formulario->id]);

    // Asignar número de rol
    $actualizaNumeroDeRol = FormularioDisponeSumario::findOrFail($formulario->id);
    $actualizaNumeroDeRol->sumario_numero_rol = 'PD0' . $formulario->id;

    // Manejo del archivo
    if ($request->hasFile('documento_sumario')) {
        $archivo = $request->file('documento_sumario');
        if ($archivo->isValid()) {
            $ruta = 'documentos/' . $actualizaNumeroDeRol->sumario_numero_rol;
            $path = $archivo->store($ruta, 'private');

            Log::info('[DISPONER_SUMARIO] Documento recibido y guardado', [
                'nombre' => $archivo->getClientOriginalName(),
                'path' => $path
            ]);

            $actualizaNumeroDeRol->documento_sumario = $path;
        } else {
            Log::warning('[DISPONER_SUMARIO] Archivo inválido', [
                'nombre' => $archivo->getClientOriginalName()
            ]);
        }
    } else {
        Log::notice('[DISPONER_SUMARIO] No se recibió archivo documento_sumario');
    }

    $actualizaNumeroDeRol->save();
    Log::info('[DISPONER_SUMARIO] Actualización de formulario finalizada');

    // Crear estado asociado
    $estado = EstadosSumario::create([
        'fecha_estado' => $request->fecha_ingreso_formulario,
        'documento_estado' => $actualizaNumeroDeRol->documento_sumario,
        'descripcion_estado' => 'Documento Inicial',
    ]);

    EstadosFormSumario::create([
        'estado_sumario_id' => $estado->id,
        'sumario_id' => $formulario->id,
    ]);
    Log::info('[DISPONER_SUMARIO] Estado creado y vinculado');

    // Crear relaciones usuario
    UserFormSumario::create([
        'user_id' => $request->funcionario_ingresa,
        'form_sumario_id' => $formulario->id,
        'rol' => 'Ingresa Formulario',
    ]);

    UserFormSumario::create([
        'user_id' => $request->fiscal_asignado,
        'form_sumario_id' => $formulario->id,
        'rol' => 'Fiscal',
    ]);
    Log::info('[DISPONER_SUMARIO] Usuarios vinculados');

    // Procesar involucrados
    $involucradosImput = json_decode($request->input('involucrados'), true);
    Log::info('[DISPONER_SUMARIO] Datos de involucrados decodificados', ['involucrados' => $involucradosImput]);

    if (is_array($involucradosImput)) {
        foreach ($involucradosImput as $i) {
            $involucrado = Involucrado::create([
                'name' => $i['nombre'],
                'rut_involucrado' => $i['rut'],
                'primer_nombre' => $i['primer_nombre'],
                'segundo_nombre' => $i['segundo_nombre'] ?? '',
                'apellido_paterno' => $i['apellido_paterno'],
                'apellido_materno' => $i['apellido_materno'],
                'correo_institucional' => $i['correo_institucional'],
                'codigo_alta_reparticion' => $i['codigo_alta_reparticion'],
                'descripcion_alta_reparticion' => $i['descripcion_alta_reparticion'],
                'descripcion_reparticion' => $i['descripcion_reparticion'],
                'codigo_reparticion' => $i['codigo_reparticion'],
                'descripcion_unidad' => $i['descripcion_unidad'] ?? '',
                'codigo_unidad' => $i['codigo_unidad'] ?? '',
                'descripcion_destacamento' => $i['descripcion_destacamento'] ?? '',
                'codigo_destacamento' => $i['codigo_destacamento'] ?? '',
                'codigo_dotacion' => $i['codigo_dotacion'],
                'dotacion' => $i['dotacion'],
                'codigo_funcionario' => $i['codigo_funcionario'],
                'grado' => $i['grado'],
                'escalafon' => $i['escalafon'],
                'sancion' => '',
                'estado_sancion' => '',
                'fecha_sancion' => '',
                'conformidad_involucrado' => '',
                'numero_rol_falta' => '',
            ]);

            InvolucradosSumario::create([
                'sumario_id' => $formulario->id,
                'involucrado_id' => $involucrado->id,
            ]);
        }

        Log::info('[DISPONER_SUMARIO] Involucrados procesados exitosamente');

        return response()->json([
            'message' => 'Sumario ingresado con éxito con número de rol: ' . $actualizaNumeroDeRol->sumario_numero_rol
        ]);
    } else {
        Log::error('[DISPONER_SUMARIO] JSON de involucrados no es válido', [
            'input' => $request->input('involucrados')
        ]);

        return response()->json(['message' => 'Los datos recibidos no son un arreglo válido'], 400);
    }
}



    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }

    public function obtenerFiscal(Request $request)
    {
        $rut = $request->input('rut');
        $persona = User::where('rut', $rut)
            // ->where('cargo', 'Asesor Jurídico')
            ->first();

        if ($persona) {
            return response()->json($persona);
        } else {
            return response()->json(['message' => 'Persona no encontrada'], 404);
        }
    }
}
