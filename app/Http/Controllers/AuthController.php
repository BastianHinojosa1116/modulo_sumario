<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


use App\Http\Controllers\Controller;
use App\Models\User as ModelsUser;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\MessageBag;
use App\Http\Resources\UserResource;
use App\Models\Bitacora;

class AuthController extends Controller
{

    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'rut' => $data['rut'],
            'password' => bcrypt($data['password'])
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response(['user' => $user, 'token' => $token]);
    }

    // public function login(LoginRequest $request)
    // {
    //     $credentials = $request->validated();

    //     $remember = $credentials['remember'] ?? false;
    //     unset($credentials['remember']);

    //     if (!Auth::attempt($credentials, $remember)) {
    //         return response([
    //             'error' => 'The Provided credentials are not correct'
    //         ], 422);
    //     }

    //     /** @var \App\Models\User $user */
    //     $user = Auth::user();
    //     $token = $user->createToken('main')->plainTextToken;

    //     return response([
    //         'user' => $user,
    //         'token' => $token
    //     ]);
    // }

    public function logout(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        // Revoke the token that was used to authenticate the current request...
        $user->currentAccessToken()->delete();

        return response([
            'success' => true
        ]);
    }

    //validar usuario tomado de la documentacion del autentificatic
    private function autentificatic($rut, $password)
    {
        $response = null;
        $http = new Client;
        try {
            $response = $http->request('POST', 'http://autentificaticapi.carabineros.cl/api/auth/login', [
                'verify' => false,
                'headers' => [
                    'Origin' => config('app.url'),
                    'Accept' => 'application/json',
                    'Content-type' => 'application/x-www-form-urlencoded',
                ],
                'form_params' => [
                    'rut' => $rut,
                    'password' => $password,
                ],
            ]);
        } catch (ClientException $exception) {
            $response = $exception->getResponse();
            return json_decode($response->getBody()->getContents(), true);
        } catch (RequestException $exception) {
            $response = $exception->getResponse();
            return json_decode($response->getBody()->getContents(), true);
        }

        return json_decode($response->getBody(), true);
    }

    //login autentificatic
    public function login(Request $request, ModelsUser $users)
    {
        //toma los datos de la funcion de arriba si es correcta
        $response = $this->autentificatic($request->rut, $request->password);

        if (isset($response['errors'])) {
            $errors = new MessageBag();
            if (Arr::has($response, 'errors.rut')) {
                if (Arr::accessible($response['errors']['rut'])) {
                    $errors->add('rut', $response['errors']['rut'][0]);
                } else {
                    $errors->add('rut', $response['errors']['rut']);
                }
            }
            if (Arr::has($response, 'errors.password')) {
                if (Arr::accessible($response['errors']['rut'])) {

                    $errors->add('password', $response['errors']['password'][0]);
                } else {

                    $errors->add('rut', $response['errors']['password']);
                }
            }
            return response()->json(['error' => $errors], 422);
        } elseif ((isset($response['success']))) {

            //si la respuesta es correcta se toma y se guarda en la variable $token recibido y se manda a la autorizacion.
            $token = $response['success']['access_token'];

            $response = null;
            try {
                $http = new Client;

                $response = $http->request('GET', 'http://autentificaticapi.carabineros.cl/api/auth/user-full', [
                    'verify' => false,
                    'headers' => [
                        'Origin' => config('app.url'),
                        'Accept' => 'application/json',
                        'Authorization' => 'Bearer ' . $token,
                    ],
                ]);
            } catch (GuzzleException $exception) {
                $response = $exception->getResponse();
                $content_response =  json_decode($response->getBody()->getContents(), true);
                $errors = new MessageBag(['clientException' => 'Ha ocurrido un error interno.']);

                return redirect()->back()->withInput()->withErrors($errors);;
            } catch (ClientException $exception) {
                $response = $exception->getResponse();
                $content_response =  json_decode($response->getBody()->getContents(), true);
                $errors = new MessageBag(['clientException' => 'Ha ocurrido un error interno.']);

                return redirect()->back()->withInput()->withErrors($errors);
            }

            //se toman los datos del json con la respuesta que trae, la cual contiene los datos de los usuarios
            $datos_usuario = json_decode((string) $response->getBody(), true);

            //se valida que el tur no traiga 0 antepuesto con ltrim.
            $rut              =  ltrim($datos_usuario['success']['user']['rut'], '0');


            $primer_nombre    = $datos_usuario['success']['user']['primer_nombre'];
            $segundo_nombre   = $datos_usuario['success']['user']['segundo_nombre'];
            $apellido_paterno = $datos_usuario['success']['user']['apellido_paterno'];
            $apellido_materno = $datos_usuario['success']['user']['apellido_materno'];

            $codigo_funcionario = $datos_usuario['success']['user']['codigo_funcionario'];

            // busca los datos, si estan null los reemplaza por vacios
            $grado = $datos_usuario['success']['user']['grado'];
            if ($grado == null) {
                $grado = "No registra";
            }

            $escalafon    = $datos_usuario['success']['user']['escalafon'];

            $correo_institucional = $datos_usuario['success']['user']['correo_institucional'];
            if ($correo_institucional == null) {
                $correo_institucional = "No registra";
            }

            $codigo_alta_reparticion = $datos_usuario['success']['user']['codigo_alta_reparticion'];
            if ($codigo_alta_reparticion == null) {
                $codigo_alta_reparticion = "No registra";
            }

            $descripcion_alta_reparticion = $datos_usuario['success']['user']['descripcion_alta_reparticion'];
            if ($descripcion_alta_reparticion == null) {
                $descripcion_alta_reparticion = "No registra";
            }

            $codigo_reparticion = $datos_usuario['success']['user']['codigo_reparticion'];
            if ($codigo_reparticion == null) {
                $codigo_reparticion = "No registra";
            }

            $descripcion_reparticion = $datos_usuario['success']['user']['descripcion_reparticion'];
            if ($descripcion_reparticion == null) {
                $descripcion_reparticion = "No registra";
            }

            $codigo_unidad = $datos_usuario['success']['user']['codigo_unidad'];
            if ($codigo_unidad == null) {
                $codigo_unidad = "No registra";
            }

            $descripcion_unidad = $datos_usuario['success']['user']['descripcion_unidad'];
            if ($descripcion_unidad == null) {
                $descripcion_unidad = "No registra";
            }

            $codigo_destacamento = $datos_usuario['success']['user']['codigo_destacamento'];
            if ($codigo_destacamento == null) {
                $codigo_destacamento = "No registra";
            }

            $descripcion_destacamento = $datos_usuario['success']['user']['descripcion_destacamento'];
            if ($descripcion_destacamento == null) {
                $descripcion_destacamento = "No registra";
            }

            $codigo_dotacion  = $datos_usuario['success']['user']['codigo_dotacion'];
            if ($codigo_dotacion == null) {
                $codigo_dotacion = "No registra";
            }

            $dotacion         = $datos_usuario['success']['user']['dotacion'];
            if ($dotacion == null) {
                $dotacion = "No registra";
            }

            $nombre = $primer_nombre . " " . $apellido_paterno . " " . $apellido_materno;

            //se llama al usuario, consultandolo por el rut del autentificatic para tomar la informacion que necesite y se actualiza por la del autentificatic.
            $user = ModelsUser::where('rut', $rut)->first(); // can also use find method

            $user->update([
                'name' => $nombre, 'primer_nombre' => $primer_nombre, 'segundo_nombre' => $segundo_nombre, 'apellido_paterno' => $apellido_paterno, 'apellido_materno' => $apellido_materno,
                'codigo_funcionario' => $codigo_funcionario, 'codigo_alta_reparticion' => $codigo_alta_reparticion, 'descripcion_alta_reparticion' => $descripcion_alta_reparticion,
                'codigo_reparticion' => $codigo_reparticion, 'descripcion_reparticion' => $descripcion_reparticion, 'codigo_unidad' => $codigo_unidad, 'descripcion_unidad' => $descripcion_unidad,
                'codigo_destacamento' => $codigo_destacamento, 'descripcion_destacamento' => $descripcion_destacamento, 'correo_institucional' => $correo_institucional, 'grado' => $grado,  'escalafon' => $escalafon,
            ]);

            //agregar despues de las pruebas
            // 'codigo_dotacion' => $codigo_dotacion,
            //     'dotacion' => $dotacion,

            $bitacora = new Bitacora();
            $bitacora->description = $this->rm_accents(ucwords(strtolower($nombre))) . " inicio sesión";
            $bitacora->user_rut = $rut;
            // Obtener la dirección IP del cliente y asignarla al producto

            $bitacora->ip = $request->ip();
            $bitacora->save();

            if ($user) {
                FacadesAuth::login($user);
                setcookie("Token_Cuarteles", $token, time() + 9999);
                // return response( "hola mundo", 422);
                return response(compact('user', 'token'));
            } else {
                return redirect()->back()->with('bloqueo', 'Su perfil se encuentra autorizado en Autentificatic pero no en la Aplicación, por favor contactar a los administradores del sistema');
            }
        } else {


            return redirect()->back();
        }
    }


    public function getUserData(Request $request)
    {
        $rut = $request->input('rut');
        $token = $request->cookie('Token_Cuarteles');

        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . $token,
            ])->get(env('API_URL_FROM_ENV') . '/api/user-data/' . $rut);

            $userData = $response->json();

            return response()->json($userData);
        } catch (\Exception $exception) {
            // Manejar errores aquí, por ejemplo, redireccionar o mostrar un mensaje de error
        }
    }

    function rm_accents($cadena)
    {

        //Reemplazamos la A y a
        $cadena = str_replace(
            array('Á', 'À', 'Â', 'Ä', 'á', 'à', 'ä', 'â', 'ª'),
            array('á', 'a', 'a', 'a', 'á', 'a', 'a', 'a', 'a'),
            $cadena
        );

        //Reemplazamos la E y e
        $cadena = str_replace(
            array('É', 'È', 'Ê', 'Ë', 'é', 'è', 'ë', 'ê'),
            array('é', 'e', 'e', 'e', 'é', 'e', 'e', 'e'),
            $cadena
        );

        //Reemplazamos la I y i
        $cadena = str_replace(
            array('Í', 'Ì', 'Ï', 'Î', 'í', 'ì', 'ï', 'î'),
            array('í', 'i', 'i', 'i', 'í', 'i', 'i', 'i'),
            $cadena
        );

        //Reemplazamos la O y o
        $cadena = str_replace(
            array('Ó', 'Ò', 'Ö', 'Ô', 'ó', 'ò', 'ö', 'ô'),
            array('ó', 'o', 'o', 'o', 'ó', 'o', 'o', 'o'),
            $cadena
        );

        //Reemplazamos la U y u
        $cadena = str_replace(
            array('Ú', 'Ù', 'Û', 'Ü', 'ú', 'ù', 'ü', 'û'),
            array('ú', 'u', 'u', 'u', 'ú', 'u', 'u', 'u'),
            $cadena
        );

        //Reemplazamos la N, n, C y c
        $cadena = str_replace(
            array('Ñ', 'ñ', 'Ç', 'ç'),
            array('ñ', 'ñ', 'c', 'c'),
            $cadena
        );

        return $cadena;
    }
}
