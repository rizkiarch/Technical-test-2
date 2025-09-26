<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Models\MsUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        // find user
        $authUser = MsUser::where('usr_nama', $data['usr_nama'])->first();
        if (empty($authUser)) {
            return Http::jsonError('Username or password incorrect', NULL, JsonResponse::HTTP_BAD_REQUEST);
        }

        // validate password
        if (!Hash::check($data['usr_pswd'], $authUser->usr_pswd)) {
            return Http::jsonError('Username or password incorrect', NULL, JsonResponse::HTTP_BAD_REQUEST);
        }

        // create api token
        $token = $authUser->createToken('api_token_' . $authUser->id);

        return Http::jsonSuccess('Login successfully', ['token' => $token->plainTextToken]);
    }
}
