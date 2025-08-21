<?php

use App\Http\Controllers\BitacoraController;
use App\Models\Bitacora;
use App\Models\Reparticion;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

if (!function_exists('mb_ucfirst')) {
    function mb_ucfirst($str) {
        $fc = mb_strtoupper(mb_substr($str, 0, 1));
        return $fc.mb_substr($str, 1);
    }
}

if (!function_exists('mb_ucwords')) {
    function mb_ucwords($string) {
        return mb_convert_case($string, MB_CASE_TITLE, "UTF-8");
    }
}

if (!function_exists('rm_accents')) {
    function rm_accents($cadena){

		//Reemplazamos la A y a
		$cadena = str_replace(
            array('Á', 'À', 'Â', 'Ä', 'á', 'à', 'ä', 'â', 'ª'),
            array('A', 'A', 'A', 'A', 'a', 'a', 'a', 'a', 'a'),
            $cadena
		);

		//Reemplazamos la E y e
		$cadena = str_replace(
            array('É', 'È', 'Ê', 'Ë', 'é', 'è', 'ë', 'ê'),
            array('E', 'E', 'E', 'E', 'e', 'e', 'e', 'e'),
            $cadena
        );

		//Reemplazamos la I y i
		$cadena = str_replace(
            array('Í', 'Ì', 'Ï', 'Î', 'í', 'ì', 'ï', 'î'),
            array('I', 'I', 'I', 'I', 'i', 'i', 'i', 'i'),
            $cadena
        );

		//Reemplazamos la O y o
		$cadena = str_replace(
            array('Ó', 'Ò', 'Ö', 'Ô', 'ó', 'ò', 'ö', 'ô'),
            array('O', 'O', 'O', 'O', 'o', 'o', 'o', 'o'),
            $cadena
        );

		//Reemplazamos la U y u
		$cadena = str_replace(
            array('Ú', 'Ù', 'Û', 'Ü', 'ú', 'ù', 'ü', 'û'),
            array('U', 'U', 'U', 'U', 'u', 'u', 'u', 'u'),
            $cadena
        );

		//Reemplazamos la N, n, C y c
		$cadena = str_replace(
            array('Ñ', 'ñ', 'Ç', 'ç'),
            array('N', 'n', 'C', 'c'),
            $cadena
		);

		return $cadena;
	}
}

if (!function_exists('emptyString')) {
    function emptyString($cadena)
    {
        return ($cadena) ?: 'Sin información' ;
    }
}

if (!function_exists('cleanText')) {
    function cleanText($cadena)
    {
        //$cadena = str_replace(' ', '-', $cadena); // Reemplaza los espacios por guiones
        return preg_replace('/[^a-zA-ZñÑ\-0-9\h]/', '', $cadena); // Remover caracteres especiales
    }
}

if (!function_exists('formatDate')) {
    function formatDate($fecha)
    {
        return (!empty($fecha)) ? $fecha->format('d-m-Y') : '' ;
    }
}


if (!function_exists('formatDateTime')) {
    function formatDateTime($fecha)
    {
        return (!empty($fecha)) ? Carbon::createFromFormat('Y-m-d H:i:s', $fecha)->format('d-m-Y') : '' ;
    }
}

if (!function_exists('meses')) {
    function meses()
    {
        return array(
            1 => 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO',
            'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE',
            'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
        );
    }
}

if (!function_exists('showError')) {
    function showError() {
        if (request()->ajax()) {
            return response()->json(['error' => '¡Ops!... Ha ocurrido un error. Reintente más tarde.']);
        }

        return back()->withErrors('¡Ops!... Ha ocurrido un error. Reintente más tarde.');
    }
}

if (!function_exists('errorFuncionario')) {
    function errorFuncionario()
    {
        return back()->withErrors('Error: Funcionario no encontrado.');
    }
}

if (!function_exists('errorFicha')) {
    function errorFicha()
    {
        return back()->withErrors('Error: Ficha del funcionario no encontrada.');
    }
}

if (!function_exists('altasReparticiones')) {
    function altasReparticiones()
    {
        return Reparticion::campos()->altasReparticiones()->get();
    }
}

if (!function_exists('reparticiones')) {
    function reparticiones($codigoAltaReparticion, $codigoReparticion = null)
    {
        //dd($codigoReparticion->toArray(), Reparticion::campos()->reparticion($codigoAltaReparticion)->get()->toArray());
        return (empty($codigoAltaReparticion)) ? collect() : Reparticion::campos()->reparticion($codigoAltaReparticion)->get() ;
    }
}

if (!function_exists('unidades')) {
    function unidades($codigoReparticion)
    {
        return (empty($codigoReparticion)) ? collect() : Reparticion::campos()->unidad($codigoReparticion)->get() ;
    }
}

if (!function_exists('dotaciones')) {
    function dotaciones($codigoUnidad)
    {
        return (empty($codigoUnidad)) ? collect() : Reparticion::campos()->dotacion($codigoUnidad)->get() ;
    }
}

if (!function_exists('ubicacion')) {
    function ubicacion($correlativo)
    {
        $ubicacion = (!empty($correlativo)) ? Reparticion::campos()->where('CORRELATIVO', $correlativo)->first() : null ;

        return (empty($ubicacion)) ? new Reparticion() : $ubicacion ;
    }
}

if (!function_exists(('nombreReparticion'))) {
    function nombreReparticion($correlativo)
    {
        return (empty($correlativo)) ? '' : optional(Reparticion::select('DESCRIPCION as nombre')->where('CORRELATIVO', $correlativo)->first())->nombre ;
    }
}



// if (!function_exists('validateTokenFicha')) {
//     function validateTokenFicha($response)
//     {
//         //Validar si hay error
//         if (is_array($response)) {
//             //Cerrar sesión por token expirado
//             if (Str::upper($response['errors']['rut']) === 'NO AUTORIZADO') {
//                 Auth::logout();
//                 return redirect('/')->withoutCookie('token_constancias_excusatorias')
//                     ->withFlash('El token expiró, vuelve a iniciar sesión.');
//             }

//             return redirect()->route('ficha.index')->withErrors($response);
//         }

//         return true;
//     }
// }

// if (!function_exists('bitacoraActual')) {
//     function bitacoraActual()
//     {
//         $ano_actual = Carbon::now()->year;
//         return (new Bitacora)->setTable("bitacora_{$ano_actual}");
//     }
// }

// if (!function_exists('recordNavigation')) {
//     function recordNavigation(string $containsURL, string $action) : bool
//     {
//         if (empty($containsURL)) {
//             (new BitacoraController)->registrarAccion($action);

//             return true;
//         }

//         if (!str_contains(url()->previous(), $containsURL)) {

//             if ($currentURL != url()->previous() ) {
//                 session()->setPreviousUrl($currentURL);

//                 (new BitacoraController)->registrarAccion($action);
//             }
//         }

//         return true;
//     }
// }
