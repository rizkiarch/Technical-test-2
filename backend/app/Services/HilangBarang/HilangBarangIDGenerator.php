<?php

namespace App\Services\HilangBarang;

use App\Exceptions\MaximumResourceIDNumberExceeded;
use App\Models\TrHilangBarang;
use Illuminate\Support\Str;

class HilangBarangIDGenerator
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public static function generate(string $gudID): string
    {
        $hilangBarangID = 'HL-' . $gudID . '-001';

        // get last transaction id from DB
        $lastTransaction = TrHilangBarang::where('hil_id', 'LIKE', 'HL-' . $gudID . '-%')->orderByDesc('hil_id')->first();
        if (!empty($lastTransaction)) {
            $lastTransactionIDDigit = (int) Str::substr($lastTransaction->hil_id, 7, 3);
            
            // throw exception if number reaches maximum
            if ($lastTransactionIDDigit >= 999) {
                throw new MaximumResourceIDNumberExceeded('cus_id has reach maximum number');
            }

            $hilangBarangID = 'HL-' . $gudID . '-' . Str::padLeft($lastTransactionIDDigit + 1, 3, '0');
        }

        return $hilangBarangID;
    }
}
