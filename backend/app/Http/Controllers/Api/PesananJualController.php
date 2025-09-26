<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\PesananJual\CreateRequest;
use App\Models\TrPesananJual;
use App\Models\DtPesananJual;
use App\Models\MsCustomer;
use App\Models\MsGudang;
use App\Models\MsProduk;
use App\Models\MsStok;
use App\Services\PesananJual\TrPesananJualIDGenerator;
use App\Services\Stok\CalculateStok;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PesananJualController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = TrPesananJual::with(['customer', 'gudang', 'details.produk']);

        if ($request->filled('pjl_id')) {
            $query->where('pjl_id', 'like', '%' . $request->pjl_id . '%');
        }

        if ($request->filled('pjl_customer')) {
            $query->where('pjl_customer', $request->pjl_customer);
        }

        if ($request->filled('pjl_gudang')) {
            $query->where('pjl_gudang', $request->pjl_gudang);
        }

        if ($request->filled('pjl_tanggal_start')) {
            $query->where('pjl_tanggal', '>=', $request->pjl_tanggal_start);
        }

        if ($request->filled('pjl_tanggal_end')) {
            $query->where('pjl_tanggal', '<=', $request->pjl_tanggal_end);
        }

        $perPage = $request->get('per_page', 15);
        $data = $query->orderBy('pjl_id', 'desc')->paginate($perPage);

        return response()->json($data);
    }

    public function show(string $id): JsonResponse
    {
        $data = TrPesananJual::with(['customer', 'gudang', 'details.produk'])->find($id);

        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        return response()->json($data);
    }

    public function store(CreateRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $pjlId = TrPesananJualIDGenerator::generate($request->pjl_tanggal);

            $totalAmount = 0;
            foreach ($request->details as $detail) {
                $totalAmount += $detail['dtpjl_qty'] * $detail['dtpjl_harga'];
            }

            $pesananJual = TrPesananJual::create([
                'pjl_id' => $pjlId,
                'pjl_tanggal' => $request->pjl_tanggal,
                'pjl_customer' => $request->pjl_customer,
                'pjl_gudang' => $request->pjl_gudang,
                'pjl_total' => $totalAmount,
            ]);

            foreach ($request->details as $detail) {
                DtPesananJual::create([
                    'dtpjl_pjlid' => $pjlId,
                    'dtpjl_produk' => $detail['dtpjl_produk'],
                    'dtpjl_qty' => $detail['dtpjl_qty'],
                    'dtpjl_harga' => $detail['dtpjl_harga'],
                    'dtpjl_subtotal' => $detail['dtpjl_qty'] * $detail['dtpjl_harga'],
                ]);

                CalculateStok::reduceStock(
                    $detail['dtpjl_produk'],
                    $request->pjl_gudang,
                    $detail['dtpjl_qty']
                );
            }

            DB::commit();

            return response()->json($pesananJual->load(['customer', 'gudang', 'details.produk']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create transaction: ' . $e->getMessage()], 500);
        }
    }

    public function getActiveCustomers(): JsonResponse
    {
        $customers = MsCustomer::where('cus_aktif', 'Y')
            ->select('cus_id', 'cus_nama', 'cus_ismember')
            ->orderBy('cus_nama')
            ->get();

        return response()->json($customers);
    }

    public function getActiveGudangs(): JsonResponse
    {
        $gudangs = MsGudang::where('gud_aktif', 'Y')
            ->select('gud_id', 'gud_nama')
            ->orderBy('gud_nama')
            ->get();

        return response()->json($gudangs);
    }

    public function getActiveProducts(Request $request): JsonResponse
    {
        $query = MsProduk::where('prd_aktif', 'Y')
            ->select('prd_id', 'prd_nama', 'prd_minpesanan', 'prd_hargamin');

        if ($request->filled('gudang_id')) {
            $query->with(['stok' => function ($q) use ($request) {
                $q->where('stok_gudang', $request->gudang_id);
            }]);
        }

        $products = $query->orderBy('prd_nama')->get();

        return response()->json($products);
    }

    public function getProductStock(string $productId, string $gudangId): JsonResponse
    {
        $stok = MsStok::where('stok_produk', $productId)
            ->where('stok_gudang', $gudangId)
            ->first();

        $availableStock = $stok ? $stok->stok_qty : 0;

        return response()->json(['available_stock' => $availableStock]);
    }
}
