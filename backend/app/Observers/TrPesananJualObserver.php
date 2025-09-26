<?php

namespace App\Observers;

use App\Models\TrPesananJual;
use App\Services\PesananJual\TrPesananJualIDGenerator;
use Illuminate\Support\Facades\Auth;

class TrPesananJualObserver
{
    /**
     * Handle the TrPesananJual"creating" event.
     */
    public function creating(TrPesananJual $trPesananJual): void
    {
        $trPesananJual->pjl_id = TrPesananJualIDGenerator::generate($trPesananJual->pjl_gud_id);
        if (empty($trPesananJual->pjl_create_user)) {
            $trPesananJual->pjl_create_user = Auth::id();
        }
    }
}
