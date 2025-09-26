<?php

namespace App\Observers;

use App\Models\TrPesananJual;
use App\Services\HilangBarang\HilangBarangIDGenerator;
use Illuminate\Support\Facades\Auth;

class TrPesananJualObserver
{
    /**
     * Handle the TrPesananJual"creating" event.
     */
    public function creating(TrPesananJual $trPesananJual): void
    {
        $trPesananJual->hil_id = HilangBarangIDGenerator::generate($trPesananJual->hil_gud_id);
        if (empty($trPesananJual->hil_create_user)) {
            $trPesananJual->hil_create_user = Auth::id();
        }
    }
}
