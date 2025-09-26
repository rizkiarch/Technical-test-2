<?php

namespace App\Http\Requests\Api\Gudang;

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
            'gud_nama' => [
                'required',
                'unique:ms_gudang,gud_nama',
                'max:100'
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
            'gud_nama.required' => 'Silakan isi nama gudang',
            'gud_nama.unique' => 'Nama gudang sudah terdaftar',
            'gud_nama.max' => 'Nama gudang maksimal 100 karakter',
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
