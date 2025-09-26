<?php

namespace App\Services\PesananJual;

use App\Exceptions\MaximumResourceIDNumberExceeded;
use App\Models\TrPesananJual;
use Illuminate\Support\Str;

class TrPesananJualIDGenerator
{
    public function __construct()
    {
        //
    }

    public static function generate(string $dateStr = null): string
    {
        // $dateStr ? date('ymd', strtotime($dateStr)) :
        $dateFormat = date('ymd');
        $prefix = 'JL' . $dateFormat . '-';
        $defaultID = $prefix . '001';

        $lastTransaction = TrPesananJual::where('pjl_id', 'LIKE', $prefix . '%')
            ->orderByDesc('pjl_id')
            ->first();

        if (!empty($lastTransaction)) {
            $lastCounter = (int) Str::substr($lastTransaction->pjl_id, -3);

            if ($lastCounter >= 999) {
                throw new MaximumResourceIDNumberExceeded('pjl_id has reach maximum number');
            }

            $defaultID = $prefix . Str::padLeft($lastCounter + 1, 3, '0');
        }

        return $defaultID;
    }
}
