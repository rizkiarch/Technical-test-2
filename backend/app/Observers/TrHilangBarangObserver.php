<?php

namespace App\Observers;

use App\Models\TrHilangBarang;
use App\Services\HilangBarang\HilangBarangIDGenerator;
use Illuminate\Support\Facades\Auth;

class TrHilangBarangObserver
{
    /**
     * Handle the TrHilangBarang "creating" event.
     */
    public function creating(TrHilangBarang $trHilangBarang): void
    {
        $trHilangBarang->hil_id = HilangBarangIDGenerator::generate($trHilangBarang->hil_gud_id);
        if (empty($trHilangBarang->hil_create_user)) {
            $trHilangBarang->hil_create_user = Auth::id();
        }
    }
}
