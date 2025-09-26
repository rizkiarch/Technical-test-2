<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DtPesananJual extends Model
{
    const CREATED_AT = 'dpjl_create_at';
    const UPDATED_AT = 'dpjl_update_at';

    protected $table = 'dt_pesanan_juals';
    protected $primaryKey = 'dpjl_id';

    protected $fillable = [
        'dpjl_pjl_id',
        'dpjl_prd_id',
        'dpjl_qty',
        'dpjl_harga_sblm_disc',
        'dpjl_disc',
    ];

    protected $casts = [
        'dpjl_qty' => 'decimal:2',
        'dpjl_harga_sblm_disc' => 'decimal:2',
        'dpjl_disc' => 'decimal:2',
    ];

    public function pesananJual(): BelongsTo
    {
        return $this->belongsTo(TrPesananJual::class, 'dpjl_pjl_id', 'pjl_id');
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(MsProduk::class, 'dpjl_prd_id', 'prd_id');
    }

    public function getSubtotalAttribute()
    {
        $harga = $this->dpjl_harga_sblm_disc;
        $disc = $this->dpjl_disc / 100;
        return ($harga - ($harga * $disc)) * $this->dpjl_qty;
    }
}
