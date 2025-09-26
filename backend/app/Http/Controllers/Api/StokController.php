<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MsStok;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class StokController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $stoks = MsStok::orderBy('stk_gud_id')->orderBy('stk_prd_id');

        if (!empty($request->stk_gud_id)) {
            $stoks = $stoks->where('stk_gud_id', 'LIKE', '%' . $request->stk_gud_id . '%');
        }
        
        if (!empty($request->stk_prd_id)) {
            $stoks = $stoks->where('stk_prd_id', 'LIKE', '%' . $request->stk_prd_id . '%');
        }

        $stoks = $stoks->paginate(25);

        return Http::jsonSuccess('Berhasil mendapatkan daftar stok', [ 'stoks' => $stoks ]);
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
    public function store(Request $request)
    {
        abort(JsonResponse::HTTP_NOT_FOUND);
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
