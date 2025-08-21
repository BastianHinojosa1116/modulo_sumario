<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bitacora;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;



class ProductController extends Controller
{

    public function index(Request $request)
    {
        $searchTerm = $request->input('search');
        $products = Product::where('description', 'like', "%$searchTerm%")
                               ->orWhere('price', 'like', "%$searchTerm%")
                               ->orWhere('stock', 'like', "%$searchTerm%")
                               ->paginate(10);
    
        return response()->json($products, 200);
    }

    public function store(Request $request)
    {
        $product = new Product();
        $product->description = $request->description;
        $product->price = $request->price;
        $product->stock = $request->stock;
        $product->save();

        $bitacora = new Bitacora();
        $bitacora->description = ucwords(strtolower($request->user_name)) . " agregó " . $request->stock . " " . $request->description;
        $bitacora->user_rut = $request->user_rut;
        // Obtener la dirección IP del cliente y asignarla al producto

        $bitacora->ip = $request->ip();
        $bitacora->save();

        return $product;
    }

    public function show($id)
    {
        $product = Product::find($id);
        return $product;
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($request->id);
        $product->description = $request->description;
        $product->price = $request->price;
        $product->stock = $request->stock;
        $product->save();

        $bitacora = new Bitacora();
        $bitacora->description = ucwords(strtolower($request->user_name)) . " modificó el registro " . $request->description . " id: " . $request->id;
        $bitacora->user_rut = $request->user_rut;
        // Obtener la dirección IP del cliente y asignarla al producto

        $bitacora->ip = $request->ip();
        $bitacora->save();

        return $product;
    }

    public function destroy($id)
    {
        $product = Product::destroy($id);
        return $product;
    }
}
