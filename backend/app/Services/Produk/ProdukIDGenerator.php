<?php

namespace App\Services\Produk;

use App\Exceptions\MaximumResourceIDNumberExceeded;
use App\Models\MsProduk;
use Illuminate\Support\Str;

class ProdukIDGenerator
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public static function generate(): string
    {
        $productID = 'P00000001';

        // get last product id from DB
        $lastProduct = MsProduk::select(['prd_id'])->orderByDesc('prd_id')->first();
        if (!empty($lastProduct)) {
            $lastProductIDDigit = (int) Str::substr($lastProduct->prd_id, 1, 8);

            // throw exception if number reaches maximum
            if ($lastProductIDDigit >= 99999999) {
                throw new MaximumResourceIDNumberExceeded('prd_id has reach maximum number');
            }
            
            $productID = 'P' . Str::padLeft($lastProductIDDigit + 1, 8, '0');
        }

        return $productID;
    }
}
