<?php

namespace Database\Seeders;

use App\Models\DtHilangBarang;
use App\Models\MsCustomer;
use App\Models\MsGudang;
use App\Models\MsProduk;
use App\Models\MsStok;
use App\Models\MsUser;
use App\Models\TrHilangBarang;
use App\Services\Stok\CalculateStok;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Arr;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        MsUser::truncate();
        MsGudang::truncate();
        MsProduk::truncate();
        MsCustomer::truncate();
        MsStok::truncate();
        TrHilangBarang::truncate();
        DtHilangBarang::truncate();

        MsUser::create([
            'usr_id' => 'U00001',
            'usr_nama' => 'usertest',
            'usr_pswd' => Hash::make('password')
        ]);

        MsGudang::create([
            'gud_id' => 'G01',
            'gud_nama' => 'Gudang Utama'
        ]);

        foreach (
            [
                [
                    'prd_id' => 'P00000001',
                    'prd_nama' => 'Tas Sekolah Anak',
                    'prd_hargadef' => 100000,
                    'prd_hargamin' => 80000,
                    'prd_min_pesanan' => random_int(0, 10),
                ],
                [
                    'prd_id' => 'P00000002',
                    'prd_nama' => 'Sepatu Nika',
                    'prd_hargadef' => 800000,
                    'prd_hargamin' => 600000,
                    'prd_min_pesanan' => random_int(0, 10),
                ],
                [
                    'prd_id' => 'P00000003',
                    'prd_nama' => 'Topi Bilincaga',
                    'prd_hargadef' => 1200000,
                    'prd_hargamin' => 900000,
                    'prd_min_pesanan' => random_int(0, 10),
                ],
                [
                    'prd_id' => 'P00000004',
                    'prd_nama' => 'Kursi Akei',
                    'prd_hargadef' => 800000,
                    'prd_hargamin' => 700000,
                    'prd_min_pesanan' => random_int(0, 10),
                    'prd_aktif' => 'N'
                ],
                [
                    'prd_id' => 'P00000005',
                    'prd_nama' => 'Meja Akei',
                    'prd_hargadef' => 900000,
                    'prd_hargamin' => 800000,
                    'prd_min_pesanan' => random_int(0, 10),
                    'prd_aktif' => 'N'
                ]
            ] as $produk
        ) {
            MsProduk::create($produk);
            MsStok::where('stk_gud_id', 'G01')
                ->where('stk_prd_id', $produk['prd_id'])
                ->update([
                    'stk_qty' => random_int(50, 200)
                ]);
        }

        foreach (
        [
            [
                'cus_id' => 'C0001',
                'cus_nama' => 'Walk-In Customer',
                'cus_kota' => 'Jakarta',
                'cus_is_member' => 'N'
            ], 
            [
                'cus_id' => 'C0001',
                'cus_nama' => 'Customer Member #1',
                'cus_kota' => 'Jakarta',
                'cus_is_member' => 'Y'
            ]
        ] as $customer) {
            MsCustomer::create($customer);
        }

        foreach (
            [
                [
                    'hil_id' => 'HL-G01-001',
                    'hil_tanggal' => now(),
                    'hil_gud_id' => 'G01',
                    'hil_catatan' => 'Trx Notes #1',
                    'details' => [
                        [
                            'dhil_prd_id' => 'P00000003',
                            'dhil_qty' => 5,
                            'dhil_biaya' => 1200000,
                        ],
                        [
                            'dhil_prd_id' => 'P00000001',
                            'dhil_qty' => 7,
                            'dhil_biaya' => 100000,
                        ]
                    ]
                ],
                [
                    'hil_id' => 'HL-G01-002',
                    'hil_tanggal' => now(),
                    'hil_gud_id' => 'G01',
                    'hil_catatan' => 'Trx Notes #2',
                    'details' => [
                        [
                            'dhil_prd_id' => 'P00000002',
                            'dhil_qty' => 2,
                            'dhil_biaya' => 800000,
                        ],
                        [
                            'dhil_prd_id' => 'P00000003',
                            'dhil_qty' => 8,
                            'dhil_biaya' => 1200000,
                        ]
                    ]
                ]
            ] as $trx
        ) {
            $trx['hil_total_biaya'] = collect($trx['details'])->sum(function($detail) {
                return $detail['dhil_biaya'] * $detail['dhil_qty'];
            });
            $trx['hil_create_user'] = 'U00001';

            $trData = Arr::except($trx, 'details');
            $tr = TrHilangBarang::create($trData);
            $tr->details()->saveMany(
                Arr::map($trx['details'], function($detail) {
                    return new DtHilangBarang($detail);
                })
            );

            CalculateStok::reduceFromHilangBarang($trx['hil_gud_id'], $tr->hil_id);
        }
    }
}
