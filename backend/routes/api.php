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
    // Auth routes
    Route::prefix('auth')->controller(AuthController::class)->group(function () {
        Route::post('login', 'login');
    });

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // User routes
        Route::resource('user', UserController::class);
        // Gudang routes
        Route::resource('gudang', GudangController::class);
        // Produk routes
        Route::resource('produk', ProdukController::class);
        // Stok routes
        Route::resource('stok', StokController::class);
        // Customer routes
        Route::resource('customer', CustomerController::class);
        // Hilang Barang routes
        Route::resource('hilang-barang', HilangBarangController::class);
        // Pesanan Jual routes
        Route::resource('pesanan-jual', PesananJualController::class);
        Route::get('pesanan-jual-customers', [PesananJualController::class, 'getActiveCustomers']);
        Route::get('pesanan-jual-gudangs', [PesananJualController::class, 'getActiveGudangs']);
        Route::get('pesanan-jual-products', [PesananJualController::class, 'getActiveProducts']);
        Route::get('pesanan-jual-stock/{productId}/{gudangId}', [PesananJualController::class, 'getProductStock']);
    });
});
