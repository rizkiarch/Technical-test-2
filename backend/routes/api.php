<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\GudangController;
use App\Http\Controllers\Api\HilangBarangController;
use App\Http\Controllers\Api\PesananJualController;
use App\Http\Controllers\Api\ProdukController;
use App\Http\Controllers\Api\StokController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->controller(AuthController::class)->group(function () {
        Route::post('login', 'login');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::resource('user', UserController::class);
        Route::resource('gudang', GudangController::class);
        Route::resource('produk', ProdukController::class);
        Route::resource('stok', StokController::class);
        Route::resource('customer', CustomerController::class);
        Route::resource('hilang-barang', HilangBarangController::class);
        Route::resource('pesanan-jual', PesananJualController::class);
        Route::get('pesanan-jual-customers', [PesananJualController::class, 'getActiveCustomers']);
        Route::get('pesanan-jual-gudangs', [PesananJualController::class, 'getActiveGudangs']);
        Route::get('pesanan-jual-products', [PesananJualController::class, 'getActiveProducts']);
        Route::get('pesanan-jual-stock/{productId}/{gudangId}', [PesananJualController::class, 'getProductStock']);
    });
});
