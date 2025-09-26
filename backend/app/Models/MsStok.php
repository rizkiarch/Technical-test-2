<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MsStok extends Model
{
    public $timestamps = false;
    public $incrementing = false;
    protected $table = 'ms_stok';

    protected $fillable = [
        'stk_gud_id',
        'stk_prd_id',
        'stk_qty',
    ];
}
