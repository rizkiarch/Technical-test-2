<?php

namespace App\Models;

use App\Observers\TrHilangBarangObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[ObservedBy([TrHilangBarangObserver::class])]
class TrHilangBarang extends Model
{
    const CREATED_AT = 'hil_create_at';
    const UPDATED_AT = 'hil_update_at';

    public $incrementing = false;
    protected $table = 'tr_hilang_barang';
    protected $primaryKey = 'hil_id';

    protected $fillable = [
        'hil_id',
        'hil_tanggal',
        'hil_gud_id',
        'hil_catatan',
        'hil_total_biaya',
        'hil_void'
    ];

    public function details(): HasMany
    {
        return $this->hasMany(DtHilangBarang::class, 'dhil_hil_id', 'hil_id');
    }
}
