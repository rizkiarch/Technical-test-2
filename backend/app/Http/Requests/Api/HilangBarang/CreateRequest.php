<?php

namespace App\Http\Requests\Api\HilangBarang;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Query\Builder;
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
            'hil_tanggal' => [
                'required',
                'date_format:Y-m-d'
            ],
            'hil_gud_id' => [
                'required',
                Rule::exists('ms_gudang', 'gud_id')->where(function (Builder $query) {
                    $query->where('gud_aktif', 'Y');
                })
            ],
            'hil_catatan' => [
                'nullable',
                'max:1000'
            ],
            'details' => [
                'required',
                'array'
            ],
            'details.*.dhil_prd_id' => [
                'required',
                'distinct',
                Rule::exists('ms_produk', 'prd_id')->where(function (Builder $query) {
                    $query->where('prd_aktif', 'Y');
                })
            ],
            'details.*.dhil_qty' => [
                'required',
                'min:1'
            ],
            'details.*.dhil_biaya' => [
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
            'hil_tanggal.required' => 'Silakan pilih tanggal',
            'hil_tanggal.date_format' => 'Format tanggal harus YYYY-MM-DD',
            'hil_gud_id.hil_gud_id' => 'Silakan pilih gudang',
            'hil_gud_id.exists' => 'Gudang tidak valid atau sudah tidak aktif',
            'hil_catatan.max' => 'Catatan tidak boleh lebih dari 1000 karakter',
            'details.required' => 'Silakan isi detail produk',
            'details.*.dhil_prd_id.required' => 'Silakan pilih produk pada detail',
            'details.*.dhil_prd_id.distinct' => 'Detail tidak boleh memiliki lebih dari 1 produk yang sama',
            'details.*.dhil_prd_id.exists' => 'Produk tidak valid atau sudah tidak aktif',
            'details.*.dhil_qty.required' => 'Silakan isi qty pada detail produk',
            'details.*.dhil_qty.min' => 'Qty pada detail produk minimal 1',
            'details.*.dhil_biaya.required' => 'Silakan isi biaya pada detail produk',
            'details.*.dhil_biaya.min' => 'Biaya pada detail produk tidak boleh minus',
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
