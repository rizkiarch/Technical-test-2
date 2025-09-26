<?php

namespace App\Http\Requests\Api\User;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class CreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'usr_nama' => [
                'required',
                'unique:ms_user,usr_nama',
                'max:100',
                'regex:/^\S*$/'
            ],
            'usr_pswd' => [
                'required',
                'min:8',
                'confirmed'
            ]
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'usr_nama.required' => 'Silakan isi username',
            'usr_nama.unique' => 'Username sudah terdaftar',
            'usr_nama.max' => 'Username maksimal 100 karakter',
            'usr_nama.regex' => 'Username tidak boleh mengandung spasi',
            'usr_pswd.required' => 'Silakan isi password',
            'usr_pswd.min' => 'Password minimal 8 karakter',
            'usr_pswd.confirmed' => 'Password tidak sama',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(Http::jsonError(
            $validator->errors()->first(),
            NULL,
            JsonResponse::HTTP_BAD_REQUEST
        ));
    }
}
