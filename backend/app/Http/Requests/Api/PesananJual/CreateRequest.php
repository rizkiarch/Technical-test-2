<?php

namespace App\Http\Requests\Api\PesananJual;

use Illuminate\Foundation\Http\FormRequest;

class CreateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pjl_tanggal' => 'required|date',
            'pjl_cust_id' => 'required|string|exists:ms_customer,cus_id',
            'pjl_gud_id' => 'required|string|exists:ms_gudang,gud_id',
            'pjl_cust_is_member' => 'nullable|boolean',
            'pjl_catatan' => 'nullable|string',
            'details' => 'required|array|min:1',
            'details.*.dpjl_prd_id' => 'required|string|exists:ms_produk,prd_id',
            'details.*.dpjl_qty' => 'required|numeric|min:1',
            'details.*.dpjl_harga_sblm_disc' => 'required|numeric|min:0',
            'details.*.dpjl_disc' => 'required|numeric|min:0|max:100',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $customer = \App\Models\MsCustomer::where('cus_id', $this->pjl_cust_id)
                ->where('cus_aktif', 'Y')
                ->first();

            if (!$customer) {
                $validator->errors()->add('pjl_cust_id', 'Customer must be active');
            }

            $gudang = \App\Models\MsGudang::where('gud_id', $this->pjl_gud_id)
                ->where('gud_aktif', 'Y')
                ->first();

            if (!$gudang) {
                $validator->errors()->add('pjl_gud_id', 'Gudang must be active');
            }

            if ($this->has('details')) {
                $productIds = collect($this->details)->pluck('dpjl_prd_id')->toArray();

                if (count($productIds) !== count(array_unique($productIds))) {
                    $validator->errors()->add('details', 'Duplicate products are not allowed');
                }

                foreach ($this->details as $index => $detail) {
                    $produk = \App\Models\MsProduk::where('prd_id', $detail['dpjl_prd_id'])
                        ->where('prd_aktif', 'Y')
                        ->first();

                    if (!$produk) {
                        $validator->errors()->add("details.{$index}.dpjl_prd_id", 'Product must be active');
                        continue;
                    }

                    if ($detail['dpjl_qty'] < $produk->prd_min_pesanan) {
                        $validator->errors()->add("details.{$index}.dpjl_qty", "Quantity cannot be less than minimum order: {$produk->prd_min_pesanan}");
                    }

                    if ($detail['dpjl_harga_sblm_disc'] < $produk->prd_hargamin) {
                        $validator->errors()->add("details.{$index}.dpjl_harga_sblm_disc", "Price cannot be less than minimum price: {$produk->prd_hargamin}");
                    }

                    $stok = \App\Models\MsStok::where('stk_prd_id', $detail['dpjl_prd_id'])
                        ->where('stk_gud_id', $this->pjl_gud_id)
                        ->first();

                    if (!$stok || $stok->stk_qty < $detail['dpjl_qty']) {
                        $availableStock = $stok ? $stok->stk_qty : 0;
                        $validator->errors()->add("details.{$index}.dpjl_qty", "Insufficient stock. Available: {$availableStock}");
                    }
                }
            }
        });
    }
}
