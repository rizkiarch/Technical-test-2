<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DtHilangBarang extends Model
{
    public $timestamps = false;
    
    protected $table = 'dt_hilang_barang';
    protected $primaryKey = 'dhil_id';

    protected $fillable = [
        'dhil_hil_id',
        'dhil_prd_id',
        'dhil_qty',
        'dhil_biaya',
    ];
}
