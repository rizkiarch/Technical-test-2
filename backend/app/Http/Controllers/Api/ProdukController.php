<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Produk\CreateRequest;
use App\Models\MsProduk;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProdukController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = MsProduk::orderByDesc('prd_id');

        if (!empty($request->prd_id)) {
            $products = $products->where('prd_id', 'LIKE', '%' . $request->prd_id . '%');
        }

        if (!empty($request->prd_nama)) {
            $products = $products->where('prd_nama', 'LIKE', '%' . $request->prd_nama . '%');
        }

        if (!empty($request->prd_aktif)) {
            $products = $products->where('prd_aktif', $request->prd_aktif);
        }

        $products = $products->paginate(25);

        return Http::jsonSuccess('List product retrieved', [ 'products' => $products ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort(JsonResponse::HTTP_NOT_FOUND);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateRequest $request)
    {
        $data = $request->validated();

        try {
            $product = MsProduk::create($data);
            return Http::jsonSuccess('Product created', [ 'product' => $product ], JsonResponse::HTTP_CREATED);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return Http::jsonError('Internal server error', NULL);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        abort(JsonResponse::HTTP_NOT_FOUND);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        abort(JsonResponse::HTTP_NOT_FOUND);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        abort(JsonResponse::HTTP_NOT_FOUND);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        abort(JsonResponse::HTTP_NOT_FOUND);
    }
}
