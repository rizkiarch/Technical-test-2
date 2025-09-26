<?php

namespace App\Models;

use App\Observers\MsProdukObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([MsProdukObserver::class])]
class MsProduk extends Model
{
    const CREATED_AT = 'prd_create_at';
    const UPDATED_AT = 'prd_update_at';

    public $incrementing = false;
    protected $table = 'ms_produk';
    protected $primaryKey = 'prd_id';

    protected $fillable = [
        'prd_nama',
        'prd_aktif',
        'prd_hargadef',
        'prd_hargamin',
        'prd_minpesanan'
    ];

    public function stok()
    {
        return $this->hasMany(MsStok::class, 'stok_produk', 'prd_id');
    }
}
