<?php

namespace App\Models;

use App\Observers\TrPesananJualObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy([TrPesananJualObserver::class])]
class TrPesananJual extends Model
{
    const CREATED_AT = 'pjl_create_at';
    const UPDATED_AT = 'pjl_update_at';

    protected $table = 'tr_pesanan_juals';
    protected $primaryKey = 'pjl_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'pjl_id',
        'pjl_tanggal',
        'pjl_gud_id',
        'pjl_cust_id',
        'pjl_cust_is_member',
        'pjl_catatan',
        'pjl_total_harga',
        'pjl_void',
        'pjl_create_user',
    ];

    protected $casts = [
        'pjl_tanggal' => 'date',
        'pjl_total_harga' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(MsCustomer::class, 'pjl_cust_id', 'cus_id');
    }

    public function gudang(): BelongsTo
    {
        return $this->belongsTo(MsGudang::class, 'pjl_gud_id', 'gud_id');
    }

    public function details(): HasMany
    {
        return $this->hasMany(DtPesananJual::class, 'dpjl_pjl_id', 'pjl_id');
    }
}
