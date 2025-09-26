<?php

namespace App\Observers;

use App\Models\MsGudang;
use App\Models\MsProduk;
use App\Models\MsStok;
use App\Services\Produk\ProdukIDGenerator;

class MsProdukObserver
{
    /**
     * Handle the MsProduk "creating" event.
     */
    public function creating(MsProduk $product): void
    {
        $product->prd_id = ProdukIDGenerator::generate();
    }

    /**
     * Handle the MsProduk "created" event.
     */
    public function created(MsProduk $product): void
    {
        $stoks = [];
        foreach (MsGudang::select(['gud_id'])->orderBy('gud_id')->cursor() as $gudang) {
            $stoks[] = [
                'stk_gud_id' => $gudang->gud_id,
                'stk_prd_id' => $product->prd_id
            ];
        }
        foreach (array_chunk($stoks, 1000) as $chunkedStoks) {
            MsStok::insert($chunkedStoks);
        }
    }
}
