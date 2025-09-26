export interface TrHilangBarangModel {
  hil_id: string;
  hil_tanggal: string;
  hil_gud_id: string;
  hil_catatan: string;
  hil_total_biaya: number;
  hil_void: string;
  details: DtHilangBarangModel[];
};

export interface DtHilangBarangModel {
  dhil_id: string;
  dhil_hil_id: string;
  dhil_prd_id: string;
  dhil_prd_nama: string;
  dhil_qty: number;
  dhil_biaya: number;
};