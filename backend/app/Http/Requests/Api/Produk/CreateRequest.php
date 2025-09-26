<?php

namespace App\Http\Requests\Api\Produk;

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
            'prd_nama' => [
                'required',
                'unique:ms_produk,prd_nama',
                'max:100'
            ],
            'prd_hargadef' => [
                'required',
                'min:0'
            ],
            'prd_hargamin' => [
                'required',
                'min:0'
            ],
            'prd_min_pesanan' => [
                'required',
                'min:0'
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
            'prd_nama.required' => 'Silakan isi nama produk',
            'prd_nama.unique' => 'Nama produk sudah terdaftar',
            'prd_nama.max' => 'Nama produk maksimal 100 karakter',
            'prd_hargadef.required' => 'Silakan isi harga default',
            'prd_hargadef.min' => 'Harga default tidak boleh minus',
            'prd_hargamin.required' => 'Silakan isi harga minimum',
            'prd_hargamin.min' => 'Harga minimum tidak boleh minus',
            'prd_min_pesanan.required' => 'Silakan isi minimum pesanan',
            'prd_min_pesanan.min' => 'Minimum pesanan tidak boleh minus',
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
