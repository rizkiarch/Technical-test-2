<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\CreateRequest;
use App\Models\MsUser;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = MsUser::orderByDesc('usr_id');

        if (!empty($request->usr_id)) {
            $users = $users->where('usr_id', 'LIKE', '%' . $request->usr_id . '%');
        }

        if (!empty($request->usr_nama)) {
            $users = $users->where('usr_nama', 'LIKE', '%' . $request->usr_nama . '%');
        }

        $users = $users->paginate(25);

        return Http::jsonSuccess('Berhasil mendapatkan daftar user', [ 'users' => $users ]);
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
            $user = MsUser::create($data);
            return Http::jsonSuccess('User berhasil dibuat', [ 'user' => $user ], JsonResponse::HTTP_CREATED);
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
        $user = User::find($id);
        if (empty($user)) {
            return Http::jsonError('User tidak ditemukan', NULL, JsonResponse::HTTP_NOT_FOUND);
        }
        return Http::jsonSuccess('Berhasil mendapatkan detail user', [ 'user' => $user ]);
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
