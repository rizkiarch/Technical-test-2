export interface TrPenjualanModel {
    pjl_id: string;
    pjl_tanggal: string;
    pjl_gud_id: string;
    pjl_cust_id: string;
    pjl_cust_is_member: string;
    pjl_catatan?: string;
    pjl_total_harga: number;
    pjl_void: string;
    pjl_create_user?: string;
    pjl_create_at: string;
    pjl_update_at: string;
    customer?: {
        cus_id: string;
        cus_nama: string;
        cus_is_member: string;
    };
    gudang?: {
        gud_id: string;
        gud_nama: string;
    };
    details?: DtPenjualanModel[];
}

export interface DtPenjualanModel {
    dpjl_id: number;
    dpjl_pjl_id: string;
    dpjl_prd_id: string;
    dpjl_qty: number;
    dpjl_harga_sblm_disc: number;
    dpjl_disc: number;
    produk?: {
        prd_id: string;
        prd_nama: string;
        prd_hargamin: number;
        prd_min_pesanan: number;
    };
}

export interface CreatePenjualanRequest {
    pjl_tanggal: string;
    pjl_gud_id: string;
    pjl_cust_id: string;
    pjl_catatan?: string;
    details: {
        dpjl_prd_id: string;
        dpjl_qty: number;
        dpjl_harga_sblm_disc: number;
        dpjl_disc: number;
    }[];
}