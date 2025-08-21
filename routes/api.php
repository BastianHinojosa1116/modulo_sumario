<?php

use App\Http\Controllers\Api\BitacoraController;
use App\Http\Controllers\Api\documentoController;
use App\Http\Controllers\Api\PrimerasDiligencias\AsesorJuridico\AsesorJuridicoController as AsesorJuridicoAsesorJuridicoController;
use App\Http\Controllers\Api\PrimerasDiligencias\DisponePrimerasDiligencias\DisponePrimerasDiligenciasController;
use App\Http\Controllers\Api\PrimerasDiligencias\FiscalAdHoc\FiscalAdHocController;
use App\Http\Controllers\Api\sumarios\CambioFiscal\CambioFiscalController;
use App\Http\Controllers\Api\PrimerasDiligencias\Tramita\TramitaController;
use App\Http\Controllers\Api\ProcesosDisciplinarios\AplicarSancion\AplicarSancionController;
use App\Http\Controllers\Api\ProcesosDisciplinarios\AsesorJuridico\AsesorJuridicoController;
use App\Http\Controllers\Api\ProcesosDisciplinarios\BandejaResoluciones\BandejaResolucionesController;
use App\Http\Controllers\Api\ProcesosDisciplinarios\Consulta\ConsultaController;
use App\Http\Controllers\Api\ProcesosDisciplinarios\IngresoFaltaDisciplinaria\IngresarFaltaController;
use App\Http\Controllers\Api\ProcesosDisciplinarios\ResolverFalta\ResolverFaltaController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReparticionesController;
use App\Http\Controllers\Api\sumarios\DisponerSumario\DisponerSumarioController;
use App\Http\Controllers\Api\sumarios\IndexOrdenSumario\IndexOrdenSumarioController;
use App\Http\Controllers\Api\sumarios\IndexOrdenSumario\GenerarWordOrdenSumario;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AutentificaticController;
use App\Http\Controllers\AuthController;
use App\Models\AsesorJuridico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\sumarios\IndexFiscal\IndexFiscalController;
use App\Http\Controllers\Api\DocumentosController;
use App\Http\Controllers\Api\sumarios\IndexAsesorJuridico\IndexAsesorJuridicoController;
use App\Http\Controllers\Api\sumarios\IndexFiscal\TramitarFiscalController;

use App\Http\Controllers\Api\sumarios\IndexDispone\IndexDisponeController;
use App\Http\Controllers\Api\sumarios\IndexDispone\TramitarDisponeController;

use App\Http\Controllers\Api\sumarios\TramitaSumario\IndexTramitaController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//midleware y seguridad
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

//inicio de sesion y registro de usuarios
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/user-data/{rut}', [AuthController::class, 'getUserData']);

//mantenedor de productos
Route::controller(ProductController::class)->group(function () {
    Route::get('/products', 'index');
    Route::post('/product', 'store');
    Route::get('/product/{id}', 'show');
    Route::put('/product/{id}', 'update');
    Route::delete('/product/{id}', 'destroy');
});

//mantenedor de usuarios
Route::controller(UserController::class)->group(function () {
    Route::get('/users', 'index');
    Route::post('/user', 'store');
    Route::get('/user/{id}', 'show');
    Route::put('/user/{id}', 'update');
    Route::delete('/user/{id}', 'destroy');
    Route::post('/user/asignarDotacion/{id}', 'asignarDotacion');
});




//mantenedor de ingresar faltas disciplinarias
Route::controller(ReparticionesController::class)->group(function () {
    Route::get('/altaReparticion', 'altaReparticion');
    Route::get('/reparticion', 'reparticion');
    Route::get('/unidad', 'unidad');
    Route::get('/destacamento', 'destacamento');

    //investigar
    Route::get('/buscarDotacion', 'searchDotacion');
    Route::get('/dotacion', 'selectDotacion');

});

//mantenedor de disponer sumario
Route::controller(DisponerSumarioController::class)->group(function () {
    // ruta para obtener el fiscal asignado
    Route::get('/sumario/obtenerFiscal', 'obtenerFiscal');
    // ruta para disponer el sumario
    Route::post('/disponerSumario', 'disponerSumario');   

});

Route::controller(IndexOrdenSumarioController::class)->group(function () {
    Route::get('/sumarios', 'index');
    
 
    // ruta para cambiar el estado del sumario
    Route::post('/sumario/cambiarEstado', 'selectCambiarEstadoSumario');
    Route::post('/sumario/ingresarOrdenSumario', 'store'); //
});

Route::controller(IndexAsesorJuridicoController::class)->group(function () {

   Route::get('/indexAsesorJuridico', 'index');
   Route::get('/asesorJuridicoTramitar/{id}', 'tramitar'); 
   

});

Route::prefix('sumarios/tramita')->controller(IndexTramitaController::class)->group(function () {
    Route::get('/', 'index'); // GET /api/sumarios/tramita
    Route::get('/{id}', 'show')->where('id', '[0-9]+'); // GET /api/sumarios/tramita/{id}
});




Route::prefix('sumarios')->controller(IndexFiscalController::class)->group(function () {
    Route::get('/fiscales', 'index'); // GET /sumarios/fiscales
    Route::get('/{id}', 'show')->where('id', '[0-9]+'); // GET /sumarios/{id}
    Route::post('/fiscalTramitar', 'tramitarAccion'); // POST /sumarios/fiscalTramitar
});

Route::prefix('sumarios')->controller(TramitarFiscalController::class)->group(function () {
    Route::post('/tramitar-fiscal', 'tramitarFiscal');
    Route::post('/cargarInhabilita-fiscal', 'cargarInhabilita');
});

Route::get('/sumario/descargarWord/{id}', [GenerarWordOrdenSumario::class, 'generarDocumentoWord']);


//MOSTRAR DOCUMENTO INICIAL
Route::get('/eventos/get-pdf/{id}', [DocumentosController::class, 'verDocumentoInicial']);

//ARBRI DOCUMENTACION EN MOSTRAR DILIGENCIAS
Route::get('/eventos/get-pdf-estado/{id}', [DocumentosController::class, 'verEstadoPDF']);

//mantenedor  Cambio Fiscal
Route::controller(CambioFiscalController::class)->group(function () {
    Route::get('/sumarios/cambioFiscal', 'index');
   

});

//Llama a la url en el env
Route::get('/api/config', function () {
    return response()->json(['app_url' => env('APP_URL')]);
});
