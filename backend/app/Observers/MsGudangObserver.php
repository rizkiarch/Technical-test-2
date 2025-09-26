<?php

namespace App\Observers;

use App\Models\MsGudang;
use App\Models\MsProduk;
use App\Models\MsStok;
use App\Services\Gudang\GudangIDGenerator;

class MsGudangObserver
{
    /**
     * Handle the MsGudang "creating" event.
     */
    public function creating(MsGudang $gudang): void
    {
        $gudang->gud_id = GudangIDGenerator::generate();
    }

    /**
     * Handle the MsGudang "created" event.
     */
    public function created(MsGudang $gudang): void
    {
        $stoks = [];
        foreach (MsProduk::select(['prd_id'])->orderBy('prd_id')->cursor() as $product) {
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
