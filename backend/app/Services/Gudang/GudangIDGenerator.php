<?php

namespace App\Services\Gudang;

use App\Exceptions\MaximumResourceIDNumberExceeded;
use App\Models\MsGudang;
use Illuminate\Support\Str;

class GudangIDGenerator
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
        $gudangID = 'G01';

        // get last gudang id from DB
        $lastGudang = MsGudang::select(['gud_id'])->orderByDesc('gud_id')->first();
        if (!empty($lastGudang)) {
            $lastGudangIDDigit = (int) Str::substr($lastGudang->gud_id, 1, 2);

            // throw exception if number reaches maximum
            if ($lastGudangIDDigit >= 99) {
                throw new MaximumResourceIDNumberExceeded('gud_id has reach maximum number');
            }
            
            $gudangID = 'G' . Str::padLeft($lastGudangIDDigit + 1, 2, '0');
        }

        return $gudangID;
    }
}
