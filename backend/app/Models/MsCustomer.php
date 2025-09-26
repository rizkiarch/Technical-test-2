<?php

namespace App\Models;

use App\Observers\MsCustomerObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([MsCustomerObserver::class])]
class MsCustomer extends Model
{
    const CREATED_AT = 'cus_create_at';
    const UPDATED_AT = 'cus_update_at';

    public $incrementing = false;
    protected $table = 'ms_customer';
    protected $primaryKey = 'cus_id';

    protected $fillable = [
        'cus_nama',
        'cus_kota',
        'cus_aktif',
        'cus_is_member'
    ];
}
