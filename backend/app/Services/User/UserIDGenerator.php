<?php

namespace App\Services\User;

use App\Exceptions\MaximumResourceIDNumberExceeded;
use App\Models\MsUser;
use Illuminate\Support\Str;

class UserIDGenerator
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
        $userID = 'U00001';

        // get last user id from DB
        $lastUser = MsUser::select(['usr_id'])->orderByDesc('usr_id')->first();
        if (!empty($lastUser)) {
            $lastUserIDDigit = (int) Str::substr($lastUser->usr_id, 1, 5);

            // throw exception if number reaches maximum
            if ($lastUserIDDigit >= 99999) {
                throw new MaximumResourceIDNumberExceeded('usr_id has reach maximum number');
            }
            
            $userID = 'U' . Str::padLeft($lastUserIDDigit + 1, 5, '0');
        }

        return $userID;
    }
}
