<?php

namespace App\Models;

use App\Observers\MsGudangObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([MsGudangObserver::class])]
class MsGudang extends Model
{
    const CREATED_AT = 'gud_create_at';
    const UPDATED_AT = 'gud_update_at';

    public $incrementing = false;
    protected $table = 'ms_gudang';
    protected $primaryKey = 'gud_id';

    protected $fillable = [
        'gud_nama',
        'gud_aktif',
    ];
}
