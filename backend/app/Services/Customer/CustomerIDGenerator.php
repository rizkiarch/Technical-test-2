<?php

namespace App\Services\Customer;

use App\Exceptions\MaximumResourceIDNumberExceeded;
use App\Models\MsCustomer;
use Illuminate\Support\Str;

class CustomerIDGenerator
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
        $customerID = 'C0001';

        // get last customer id from DB
        $lastCustomer = MsCustomer::select(['cus_id'])->orderByDesc('cus_id')->first();
        if (!empty($lastCustomer)) {
            $lastCustomerIDDigit = (int) Str::substr($lastCustomer->cus_id, 1, 4);

            // throw exception if number reaches maximum
            if ($lastCustomerIDDigit >= 9999) {
                throw new MaximumResourceIDNumberExceeded('cus_id has reach maximum number');
            }
            
            $customerID = 'C' . Str::padLeft($lastCustomerIDDigit + 1, 4, '0');
        }

        return $customerID;
    }
}
