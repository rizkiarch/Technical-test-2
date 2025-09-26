<?php

namespace App\Observers;

use App\Models\MsUser;
use App\Services\User\UserIDGenerator;

class MsUserObserver
{
    /**
     * Handle the MsUser "creating" event.
     */
    public function creating(MsUser $user): void
    {
        $user->usr_id = UserIDGenerator::generate();
    }
}
