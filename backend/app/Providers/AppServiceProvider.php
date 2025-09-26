<?php

namespace App\Providers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // define http json success response macro
        Http::macro('jsonSuccess', function(string $message, mixed $data, int $code = 200) {
            return response()->json([
                'status' => true,
                'message' => $message,
                'data' => $data,
            ], $code);
        });

        // define http json error response macro
        Http::macro('jsonError', function(string $message, mixed $data, int $code = 500) {
            return response()->json([
                'status' => false,
                'message' => $message,
                'data' => $data,
            ], $code);
        });
    }
}
