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
            'pjl_customer' => 'required|string|exists:ms_customer,cus_id',
            'pjl_gudang' => 'required|string|exists:ms_gudang,gud_id',
            'details' => 'required|array|min:1',
            'details.*.dtpjl_produk' => 'required|string|exists:ms_produk,prd_id',
            'details.*.dtpjl_qty' => 'required|numeric|min:1',
            'details.*.dtpjl_harga' => 'required|numeric|min:0',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $customer = \App\Models\MsCustomer::where('cus_id', $this->pjl_customer)
                ->where('cus_aktif', 'Y')
                ->first();

            if (!$customer) {
                $validator->errors()->add('pjl_customer', 'Customer must be active');
            }

            $gudang = \App\Models\MsGudang::where('gud_id', $this->pjl_gudang)
                ->where('gud_aktif', 'Y')
                ->first();

            if (!$gudang) {
                $validator->errors()->add('pjl_gudang', 'Gudang must be active');
            }

            if ($this->has('details')) {
                $productIds = collect($this->details)->pluck('dtpjl_produk')->toArray();

                if (count($productIds) !== count(array_unique($productIds))) {
                    $validator->errors()->add('details', 'Duplicate products are not allowed');
                }

                foreach ($this->details as $index => $detail) {
                    $produk = \App\Models\MsProduk::where('prd_id', $detail['dtpjl_produk'])
                        ->where('prd_aktif', 'Y')
                        ->first();

                    if (!$produk) {
                        $validator->errors()->add("details.{$index}.dtpjl_produk", 'Product must be active');
                        continue;
                    }

                    if ($detail['dtpjl_qty'] < $produk->prd_minpesanan) {
                        $validator->errors()->add("details.{$index}.dtpjl_qty", "Quantity cannot be less than minimum order: {$produk->prd_minpesanan}");
                    }

                    if ($detail['dtpjl_harga'] < $produk->prd_hargamin) {
                        $validator->errors()->add("details.{$index}.dtpjl_harga", "Price cannot be less than minimum price: {$produk->prd_hargamin}");
                    }

                    $stok = \App\Models\MsStok::where('stok_produk', $detail['dtpjl_produk'])
                        ->where('stok_gudang', $this->pjl_gudang)
                        ->first();

                    if (!$stok || $stok->stok_qty < $detail['dtpjl_qty']) {
                        $availableStock = $stok ? $stok->stok_qty : 0;
                        $validator->errors()->add("details.{$index}.dtpjl_qty", "Insufficient stock. Available: {$availableStock}");
                    }
                }
            }
        });
    }
}
