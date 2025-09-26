<?php

namespace App\Services\Stok;

use App\Models\MsStok;
use Illuminate\Support\Facades\DB;

class CalculateStok
{
    public function __construct() {}

    public static function reduceFromHilangBarang($gudID, $trxID)
    {
        MsStok::leftJoin('dt_hilang_barang', 'dt_hilang_barang.dhil_prd_id', 'ms_stok.stk_prd_id')
            ->where('stk_gud_id', $gudID)
            ->where('dt_hilang_barang.dhil_hil_id', $trxID)
            ->update([
                'ms_stok.stk_qty' => DB::raw('ms_stok.stk_qty - dt_hilang_barang.dhil_qty')
            ]);
    }

    public static function reduceStock($productId, $gudangId, $qty)
    {
        $stok = MsStok::where('stok_produk', $productId)
            ->where('stok_gudang', $gudangId)
            ->first();

        if ($stok) {
            $stok->decrement('stok_qty', $qty);
        }
    }
}
