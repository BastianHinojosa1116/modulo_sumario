<?php

// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use App\Models\Bitacora;
// use Illuminate\Http\Request;
// use App\Models\User;
// use Exception;
// use GuzzleHttp\Client;
// use GuzzleHttp\Exception\ClientException;
// use GuzzleHttp\Exception\ServerException;
// use Symfony\Component\HttpKernel\Exception\HttpException;

// class UserController extends Controller
// {
//     /**
//      * Display a listing of the resource.
//      *
//      * @return \Illuminate\Http\Response
//      */
//     public function index(Request $request)
//     {


//         $searchTerm = $request->input('search');
//         $users = User::where('rut', 'like', "%$searchTerm%")
//             ->orWhere('codigo_funcionario', 'like', "%$searchTerm%")
//             ->orWhere('name', 'like', "%$searchTerm%")
//             ->paginate(10);
//         return response()->json($users, 200);
//         // return response()->json($ingresarFaltas, 200);
//     }

//      public function existeAsesorJuridico(Request $request)
// {
//     try {
//         // Validación compatible con RUT chileno (permite K/k como dígito verificador)
//         $request->validate([
//             'rut' => 'required|regex:/^[0-9]{7,8}[0-9Kk]{1}$/'
//         ]);

//         // Normaliza el RUT a mayúsculas
//         $rut = strtoupper($request->rut);

//         // Busca el usuario por RUT
//         $user = User::where('rut', $rut)->first();

//         if ($user) {
//             return response()->json([
//                 'exists' => true,
//                 'nombre' => $user->name
//             ]);
//         }

//         return response()->json(['exists' => false]);
//     } catch (\Exception $e) {
//         \Log::error('[VALIDAR_RUT] Error interno: ' . $e->getMessage());

//         return response()->json([
//             'error' => 'Error interno al validar el RUT',
//             'detalle' => $e->getMessage()
//         ], 500);
//     }
// }



//     // public function store(Request $request)
//     // {
//     //     $user = new User();
//     //     $user->name = $request->name;
//     //     $user->rut = $request->rut;
//     //     $user->password = bcrypt("#Zucarita1");
//     //     $user->save();

//     //     return $user;
//     // }

//     public function show($id)
//     {
//         $user = User::find($id);
//         return $user;
//     }

//     public function update(Request $request, $id)
//     {
//         $user = User::findOrFail($id);

//         if (
//             $request->cargo === "Administrador" || $request->cargo === "Usuario" || $request->cargo === "" ||
//             $request->cargo === "Asesor Jurídico" || $request->cargo === "Potestad Disciplinaria" ||
//             $request->cargo === "Colaborador" || $request->cargo === "Consulta" || $request->cargo === null
//         ) {

//             $user->cargo = $request->cargo ?? '';

//             if ($request->cargo === "" || $request->cargo === null) {
//                 $bitacora = new Bitacora();
//                 $bitacora->description = $this->rm_accents(ucwords(strtolower($request->user_name))) . " dejo el perfil sin asignar" .
//                     " al funcionario " . $this->rm_accents(ucwords(strtolower($request->name))) . ", código de funcionario: " . $user->codigo_funcionario;

//                 $bitacora->user_rut = $request->user_rut;
//                 $bitacora->ip = $request->ip();
//                 $bitacora->save();
//             } else {
//                 $bitacora = new Bitacora();
//                 $bitacora->description = $this->rm_accents(ucwords(strtolower($request->user_name))) . " le asigno el perfil de " . $request->cargo .
//                     " al funcionario " . $this->rm_accents(ucwords(strtolower($request->name))) . ", código de funcionario: " . $user->codigo_funcionario;

//                 $bitacora->user_rut = $request->user_rut;
//                 $bitacora->ip = $request->ip();
//                 $bitacora->save();
//             }
//         } else {

//             $bitacora = new Bitacora();
//             $bitacora->description = $this->rm_accents(ucwords(strtolower($request->user_name))) . " intervino el código para asignar perfiles de usuarios de manera maliciosa";

//             $bitacora->user_rut = $request->user_rut;
//             $bitacora->ip = $request->ip();
//             $bitacora->save();
//             return response()->json(['error' => 'No se permite guardar usuarios modificados por consola']);
//         }
//         $user->save();

//         return response()->json(['message' => 'Perfil de usuario modificado exitosamente']);
//     }

//     public function destroy($id, Request $request)
//     {
//         //return response($request->user_id, 422);
//         if ($id == $request->user_id) {
//             return response()->json(['error' => 'No puedes eliminarte a ti mismo.']);
//         }

//         $user = User::findOrFail($id);

//         $bitacora = new Bitacora();
//         $bitacora->description = $this->rm_accents(ucwords(strtolower($request->user_name))) . " eliminó al usuario " . $this->rm_accents(ucwords(strtolower($user->name))) . ", código de funcionario: " . $user->codigo_funcionario;
//         $bitacora->user_rut = $request->user_rut;
//         $bitacora->ip = $request->ip();
//         $bitacora->save();

//         // Elimina al usuario
//         $user->delete();

//         return response()->json(['message' => 'Usuario eliminado exitosamente']);
//     }

//     //agrega un usuario al sistema
//     protected function store(Request $request)
//     {
//         try {

//             $token = $request->header('Authorization');

//             //trae la funcion create user que valida los datos en autentificatic
//             $response = $this->createUser($request->rut, $token);

//             //agrega el usuario con los campos asignados a continuación
//             $user = new User;

//             $user->rut = $request->rut;
//             $user->name = $request->name;
//             $user->password = bcrypt("#Zucarita1");

//             //Autentificatic
//             $user->primer_nombre = $request->primer_nombre;
//             $user->segundo_nombre = $request->segundo_nombre ?? '';

//             $user->apellido_paterno = $request->apellido_paterno;
//             $user->apellido_materno = $request->apellido_materno;
//             $user->codigo_funcionario = $request->codigo_funcionario;
//             $user->grado = $request->grado;
//             $user->escalafon = $request->escalafon;



//             //datos por defecto
//             $user->codigo_alta_reparticion = $request->codigo_alta_reparticion;
//             $user->descripcion_alta_reparticion = $request->descripcion_alta_reparticion;

//             $user->codigo_reparticion = $request->codigo_reparticion;
//             if ($request->codigo_reparticion == null) {
//                 $user->codigo_reparticion = "No registra";
//             }

//             $user->descripcion_reparticion = $request->descripcion_reparticion;
//             if ($request->descripcion_reparticion == null) {
//                 $user->descripcion_reparticion = "No registra";
//             }

//             $user->descripcion_unidad = $request->descripcion_unidad;
//             if ($request->descripcion_unidad == null) {
//                 $user->descripcion_unidad = "No registra";
//             }

//             $user->codigo_unidad = $request->codigo_unidad;
//             if ($request->codigo_unidad == null) {
//                 $user->codigo_unidad = "No registra";
//             }

//             $user->codigo_destacamento = $request->codigo_destacamento;
//             if ($request->codigo_destacamento == null) {
//                 $user->codigo_destacamento = "No registra";
//             }

//             $user->descripcion_destacamento = $request->descripcion_destacamento;
//             if ($request->descripcion_destacamento == null) {
//                 $user->descripcion_destacamento = "No registra";
//             }

//             $user->codigo_dotacion = $request->codigo_dotacion;
//             $user->dotacion = $request->dotacion;

//             $user->correo_institucional = $request->correo_institucional;
//             if ($request->correo_institucional == null) {
//                 $user->correo_institucional = "No registra";
//             }

//             //Fin Autentificatic

//             //perfil de usuario
//             $user->cargo = "";
//             $user->save();

//             $bitacora = new Bitacora();
//             $bitacora->description = $this->rm_accents(ucwords(strtolower($request->user_name))) . " agregó al usuario " . $this->rm_accents(ucwords(strtolower($request->name))) . ", codigo de funcionario: " . $request->codigo_funcionario;
//             $bitacora->user_rut = $request->user_rut;
//             // Obtener la dirección IP del cliente y asignarla al producto

//             $bitacora->ip = $request->ip();
//             $bitacora->save();

//             return $user;
//         } catch (Exception $e) {
//             return "me cai en:" . $e;
//         }
//     }

//     //se llama en la función de arriba para validar los campos de los usuarios de autentificatic
//     public function createUser($rut, $token)
//     {
//         try {

//             $http = new Client();
//             $user = new User();
//             $response = $http->post('http://autentificaticapi.carabineros.cl/api/institutional-app-user-from-external-app', [
//                 'verify' => false,
//                 'headers' => [
//                     'Origin' => config('app.url'),
//                     'Accept' => 'application/json',
//                     'Content-type' => 'application/x-www-form-urlencoded',
//                     'Authorization' => $token

//                 ],
//                 'form_params' => [
//                     'rut' => $rut
//                 ]
//             ]);

//             return $response = json_decode((string) $response->getBody(), true);
//         } catch (HttpException $e) {

//             return response()->json($e->getMessage(), 400);
//         } catch (ClientException $e) {

//             $response = $e->getResponse();
//             $response = $response->getBody()->getContents();
//             return response()->json($response, $e->getCode());
//         } catch (ServerException $e) {
//             $response = $e->getResponse();
//             $response = $response->getBody()->getContents();
//             return response()->json($response, $e->getCode());
//         }
//     }

//     public function asignarDotacion($id, Request $request)
//     {

//         $user = User::findOrFail($id);
//         //insertar codigo de asignacion dotacion
//         //datos por defecto
//         $user->codigo_alta_reparticion = $request->codigo_alta_reparticion;
//         $user->descripcion_alta_reparticion = $request->descripcion_alta_reparticion;

//         $user->codigo_reparticion = $request->codigo_reparticion ?? '';
//         $user->descripcion_reparticion = $request->descripcion_reparticion ?? '';

//         $user->descripcion_unidad = $request->descripcion_unidad ?? '';
//         $user->codigo_unidad = $request->codigo_unidad ?? '';

//         $user->codigo_destacamento = $request->codigo_destacamento ?? '';
//         $user->descripcion_destacamento = $request->descripcion_destacamento ?? '';

//         $user->codigo_dotacion = $request->codigo_dotacion ?? '';
//         $user->dotacion = $request->dotacion ?? '';
//         $user->save();

//         return response()->json(['message' => 'Dotacion Asignada al usuario: ' . $user->name]);
//     }

//     function rm_accents($cadena)
//     {

//         //Reemplazamos la A y a
//         $cadena = str_replace(
//             array('Á', 'À', 'Â', 'Ä', 'á', 'à', 'ä', 'â', 'ª'),
//             array('á', 'a', 'a', 'a', 'á', 'a', 'a', 'a', 'a'),
//             $cadena
//         );

//         //Reemplazamos la E y e
//         $cadena = str_replace(
//             array('É', 'È', 'Ê', 'Ë', 'é', 'è', 'ë', 'ê'),
//             array('é', 'e', 'e', 'e', 'é', 'e', 'e', 'e'),
//             $cadena
//         );

//         //Reemplazamos la I y i
//         $cadena = str_replace(
//             array('Í', 'Ì', 'Ï', 'Î', 'í', 'ì', 'ï', 'î'),
//             array('í', 'i', 'i', 'i', 'í', 'i', 'i', 'i'),
//             $cadena
//         );

//         //Reemplazamos la O y o
//         $cadena = str_replace(
//             array('Ó', 'Ò', 'Ö', 'Ô', 'ó', 'ò', 'ö', 'ô'),
//             array('ó', 'o', 'o', 'o', 'ó', 'o', 'o', 'o'),
//             $cadena
//         );

//         //Reemplazamos la U y u
//         $cadena = str_replace(
//             array('Ú', 'Ù', 'Û', 'Ü', 'ú', 'ù', 'ü', 'û'),
//             array('ú', 'u', 'u', 'u', 'ú', 'u', 'u', 'u'),
//             $cadena
//         );

//         //Reemplazamos la N, n, C y c
//         $cadena = str_replace(
//             array('Ñ', 'ñ', 'Ç', 'ç'),
//             array('ñ', 'ñ', 'c', 'c'),
//             $cadena
//         );

//         return $cadena;
//     }
// }
