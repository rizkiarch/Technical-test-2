<?php

namespace App\Http\Requests\Api\Customer;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;

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
            'cus_nama' => [
                'required',
                'unique:ms_customer,cus_nama',
                'max:100'
            ],
            'cus_kota' => [
                'nullable',
                'max:100'
            ],
            'cus_is_member' => [
                'required',
                Rule::in(['Y', 'N'])
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
            'cus_nama.required' => 'Silakan isi nama customer',
            'cus_nama.unique' => 'Nama customer sudah terdaftar',
            'cus_nama.max' => 'Nama customer tidak boleh lebih dari 100 karakter',
            'cus_kota.max' => 'Nama kota tidak boleh lebih dari 100 karakter',
            'cus_is_member.required' => 'Silakan pilih tipe member',
            'cus_is_member.in' => 'Tipe member tidak valid',
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
