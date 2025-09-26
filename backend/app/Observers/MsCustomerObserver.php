<?php

namespace App\Observers;

use App\Models\MsCustomer;
use App\Services\Customer\CustomerIDGenerator;

class MsCustomerObserver
{
    /**
     * Handle the MsCustomer "creating" event.
     */
    public function creating(MsCustomer $customer): void
    {
        $customer->cus_id = CustomerIDGenerator::generate();
    }
}
