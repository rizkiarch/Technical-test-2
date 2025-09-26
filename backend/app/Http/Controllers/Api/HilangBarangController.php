<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\HilangBarang\CreateRequest;
use App\Models\DtHilangBarang;
use App\Models\MsStok;
use App\Models\TrHilangBarang;
use App\Services\Stok\CalculateStok;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HilangBarangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $hilangBarangs = TrHilangBarang::orderByDesc('hil_id');

        if (!empty($request->hil_id)) {
            $hilangBarangs = $hilangBarangs->where('hil_id', 'LIKE', '%' . $request->hil_id . '%');
        }

        if (!empty($request->hil_tanggal)) {
            $hilangBarangs = $hilangBarangs->where('hil_tanggal', 'LIKE', '%' . $request->hil_tanggal . '%');
        }

        if (!empty($request->hil_gud_id)) {
            $hilangBarangs = $hilangBarangs->where('hil_gud_id', 'LIKE', '%' . $request->hil_gud_id . '%');
        }

        if (!empty($request->hil_catatan)) {
            $hilangBarangs = $hilangBarangs->where('hil_catatan', 'LIKE', '%' . $request->hil_catatan . '%');
        }

        if (!empty($request->hil_void)) {
            $hilangBarangs = $hilangBarangs->where('hil_void', 'LIKE', '%' . $request->hil_void . '%');
        }

        $perPage = $request->get('per_page', 25);
        $hilangBarangs = $hilangBarangs->paginate($perPage);

        return Http::jsonSuccess('List hilang barang retrieved', ['hilang_barangs' => $hilangBarangs]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateRequest $request)
    {
        $data = $request->validated();

        try {
            // map detail to qty for stock checking purpose
            $detailToQtyMap = [];
            foreach ($data['details'] as $detail) {
                $detailToQtyMap[$detail['dhil_prd_id']] = $detail['dhil_qty'];
            }

            // check stock
            foreach (
                MsStok::where('stk_gud_id', $data['hil_gud_id'])
                    ->whereIn('stk_prd_id', Arr::map($data['details'], function ($detail) {
                        return $detail['dhil_prd_id'];
                    }))
                    ->cursor() as $stok
            ) {
                if ($stok->stk_qty - $detailToQtyMap[$stok->stk_prd_id] < 0) {
                    return Http::jsonError('Stok produk: ' . $stok->stk_prd_id . ' tidak mencukupi', NULL);
                }
            }

            $trData = Arr::except($data, 'details');
            $totalBiaya = collect($data['details'])->sum(function ($detail) {
                return $detail['dhil_biaya'] * $detail['dhil_qty'];
            });
            Arr::set($trData, 'hil_total_biaya', $totalBiaya);

            $tr = TrHilangBarang::create($trData);
            $tr->details()->saveMany(
                Arr::map($data['details'], function ($detail) {
                    return new DtHilangBarang($detail);
                })
            );

            // reduce current stock
            CalculateStok::reduceFromHilangBarang($data['hil_gud_id'], $tr->hil_id);

            return Http::jsonSuccess('Transaksi berhasil disimpan', ['hilang_barang' => $tr]);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return Http::jsonError('Internal server error', NULL);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $tr = TrHilangBarang::with([
                'details' => function ($query) {
                    $query->select(['dt_hilang_barang.*', 'ms_produk.prd_nama AS dhil_prd_nama'])->leftJoin('ms_produk', 'ms_produk.prd_id', 'dt_hilang_barang.dhil_prd_id');
                }
            ])->find($id);
            if (empty($tr)) {
                return Http::jsonError('Transaksi tidak ditemukan', NULL, JsonResponse::HTTP_NOT_FOUND);
            }
            return Http::jsonSuccess('Transaksi berhasil diambil', ['hilang_barang' => $tr]);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return Http::jsonError('Internal server error', NULL);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
