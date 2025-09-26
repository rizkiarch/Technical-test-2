<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\CreateRequest;
use App\Models\MsCustomer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $customers = MsCustomer::orderByDesc('cus_id');

        if (!empty($request->cus_id)) {
            $customers = $customers->where('cus_id', 'LIKE', '%' . $request->cus_id . '%');
        }

        if (!empty($request->cus_nama)) {
            $customers = $customers->where('cus_nama', 'LIKE', '%' . $request->cus_nama . '%');
        }

        if (!empty($request->cus_kota)) {
            $customers = $customers->where('cus_kota', 'LIKE', '%' . $request->cus_kota . '%');
        }

        if (!empty($request->cus_aktif)) {
            $customers = $customers->where('cus_aktif', $request->cus_aktif);
        }

        $customers = $customers->paginate(25);

        return Http::jsonSuccess('List customer retrieved', [ 'customers' => $customers ]);
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
            $customer = MsCustomer::create($data);
            return Http::jsonSuccess('Customer created', [ 'customer' => $customer ], JsonResponse::HTTP_CREATED);
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
