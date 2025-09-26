<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Gudang\CreateRequest;
use App\Models\MsGudang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GudangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $gudangs = MsGudang::orderByDesc('gud_id');

        if (!empty($request->gud_nama)) {
            $gudangs = $gudangs->where('gud_nama', 'LIKE', '%' . $request->gud_nama . '%');
        }

        if (!empty($request->gud_aktif)) {
            $gudangs = $gudangs->where('gud_aktif', $request->gud_aktif);
        }

        $gudangs = $gudangs->paginate(25);

        return Http::jsonSuccess('List gudang retrieved', [ 'gudangs' => $gudangs ]);
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
            $gudang = MsGudang::create($data);
            return Http::jsonSuccess('Gudang created', [ 'gudang' => $gudang ], JsonResponse::HTTP_CREATED);
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
