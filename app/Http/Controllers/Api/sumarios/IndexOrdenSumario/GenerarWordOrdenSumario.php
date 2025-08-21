<?php

namespace App\Http\Controllers\Api\sumarios\IndexOrdenSumario;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\FormularioDisponeSumario;
use PhpOffice\PhpWord\TemplateProcessor;

class GenerarWordOrdenSumario extends Controller
{
    public function generarDocumentoWord($rolNumeroSumario)

    {
        $sumario = FormularioDisponeSumario::with('user_form_sumarios.user')
            ->where('sumario_numero_rol', $rolNumeroSumario)
            ->firstOrFail();
        $fiscal = $sumario->user_form_sumarios->firstWhere('rol', 'Fiscal')?->user;
        $dispone = $sumario->user_form_sumarios->firstWhere('rol', 'Dispone')?->user;

        $templatePath = storage_path('templates/OrdenSumario.docx');
        $templateProcessor = new TemplateProcessor($templatePath);

        // dd($templateProcessor->getVariables());

        $templateProcessor->setValue('NUMERO_ROL_SUMARIO', $sumario->sumario_numero_rol);
        $templateProcessor->setValue('NUMERO_DOCUMENTO_DISPONE', $sumario->nro_documento_dispone_sumario);
        $templateProcessor->setValue('FECHA_DOCUMENTO_DISPONE_SUMARIO', $sumario->fecha_documento_dispone_sumario);

        $templateProcessor->setValue('DESCRIPCION_HECHO', $sumario->descripcion_hecho);
        $templateProcessor->setValue('SUBMOTIVO', $sumario->subMotivo);
        $templateProcessor->setValue('PLAZO', $sumario->plazo);
        $templateProcessor->setValue('FECHA_INGRESO_FORM', $sumario->fecha_ingreso_formulario);

        //DATOS DISPONE 
        $templateProcessor->setValue('NOMBRE_DISPONE', $dispone?->name ?? '---');
        $templateProcessor->setValue('RUT_DISPONE', $dispone?->rut ?? '---');
        $templateProcessor->setValue('GRADO_DISPONE', $dispone?->grado ?? '---');
        
        //DATOSFISCAL
        $templateProcessor->setValue('NAME', $fiscal?->name ?? '---');
        $templateProcessor->setValue('GRADO', $fiscal?->grado ?? '---');
        $templateProcessor->setValue('DOTACION_FISCAL', $fiscal?->dotacion ?? '---');
        $templateProcessor->setValue('DESCRIPCION_REPARTICION', $fiscal?->descripcion_reparticion ?? '---');
        $genero = $fiscal?->genero === 'M' ? 'la' : 'el';
        $templateProcessor->setValue('PRONOMBRE_FUNCIONARIO', $genero ?? 'el/la');
      

       


        $filePath = storage_path("documentos/Sumario_{$rolNumeroSumario}.docx");
        $templateProcessor->saveAs($filePath);

        $fileName = "OrdenSumario_{$rolNumeroSumario}.docx";
        return response()->download($filePath, $fileName)->deleteFileAfterSend(true);
    }
}
