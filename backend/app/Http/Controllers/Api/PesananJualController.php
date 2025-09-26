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

        return response()->json([
            'status' => true,
            'message' => 'List penjualan retrieved successfully',
            'data' => ['penjualans' => $data]
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $data = TrPesananJual::with(['customer', 'gudang', 'details.produk'])->find($id);

        if (!$data) {
            return response()->json([
                'status' => false,
                'message' => 'Data not found'
            ], 404);
        }



        return response()->json([
            'status' => true,
            'message' => 'Penjualan data retrieved successfully',
            'data' => ['penjualan' => $data]
        ]);
    }

    public function store(CreateRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $pjlId = TrPesananJualIDGenerator::generate($request->pjl_tanggal);

            $totalAmount = 0;
            foreach ($request->details as $detail) {
                $subtotalSblm = $detail['dpjl_qty'] * $detail['dpjl_harga_sblm_disc'];
                $discAmount = $subtotalSblm * ($detail['dpjl_disc'] / 100);
                $subtotalSetelah = $subtotalSblm - $discAmount;
                $totalAmount += $subtotalSetelah;
            }

            $pesananJual = TrPesananJual::create([
                'pjl_id' => $pjlId,
                'pjl_tanggal' => $request->pjl_tanggal,
                'pjl_cust_id' => $request->pjl_cust_id,
                'pjl_gud_id' => $request->pjl_gud_id,
                'pjl_cust_is_member' => $request->pjl_cust_is_member ?? false,
                'pjl_catatan' => $request->pjl_catatan,
                'pjl_total_harga' => $totalAmount,
                'pjl_void' => false,
            ]);

            foreach ($request->details as $detail) {
                $createdDetail = DtPesananJual::create([
                    'dpjl_pjl_id' => $pjlId,
                    'dpjl_prd_id' => $detail['dpjl_prd_id'],
                    'dpjl_qty' => $detail['dpjl_qty'],
                    'dpjl_harga_sblm_disc' => $detail['dpjl_harga_sblm_disc'],
                    'dpjl_disc' => $detail['dpjl_disc'],
                ]);



                CalculateStok::reduceStock(
                    $detail['dpjl_prd_id'],
                    $request->pjl_gud_id,
                    $detail['dpjl_qty']
                );
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Penjualan created successfully',
                'data' => ['penjualan' => $pesananJual->load(['customer', 'gudang', 'details.produk'])]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to create transaction: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getActiveCustomers(): JsonResponse
    {
        $customers = MsCustomer::where('cus_aktif', 'Y')
            ->select('cus_id', 'cus_nama', 'cus_kota', 'cus_is_member')
            ->orderBy('cus_nama')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Active customers retrieved successfully',
            'data' => $customers
        ]);
    }

    public function getActiveGudangs(): JsonResponse
    {
        $gudangs = MsGudang::where('gud_aktif', 'Y')
            ->select('gud_id', 'gud_nama')
            ->orderBy('gud_nama')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Active warehouses retrieved successfully',
            'data' => $gudangs
        ]);
    }

    public function getActiveProducts(Request $request): JsonResponse
    {
        $query = MsProduk::where('prd_aktif', 'Y')
            ->select('prd_id', 'prd_nama', 'prd_min_pesanan', 'prd_hargamin', 'prd_hargadef');

        if ($request->filled('gudang_id')) {
            $query->with(['stok' => function ($q) use ($request) {
                $q->where('stk_gud_id', $request->gudang_id);
            }]);
        }

        $products = $query->orderBy('prd_nama')->get();

        return response()->json([
            'status' => true,
            'message' => 'Active products retrieved successfully',
            'data' => $products
        ]);
    }

    public function getProductStock(string $productId, string $gudangId): JsonResponse
    {
        $stok = MsStok::where('stk_prd_id', $productId)
            ->where('stk_gud_id', $gudangId)
            ->first();

        $availableStock = $stok ? $stok->stk_qty : 0;

        return response()->json([
            'status' => true,
            'message' => 'Stock data retrieved successfully',
            'data' => ['stok' => $availableStock]
        ]);
    }

    // Temporary debug method
    public function debugDetails(string $id): JsonResponse
    {
        $details = DtPesananJual::where('dpjl_pjl_id', $id)->get();
        $detailsCount = DtPesananJual::where('dpjl_pjl_id', $id)->count();
        
        return response()->json([
            'status' => true,
            'message' => 'Debug details',
            'data' => [
                'pjl_id' => $id,
                'details_count' => $detailsCount,
                'details' => $details,
                'all_details_count' => DtPesananJual::count()
            ]
        ]);
    }
}
