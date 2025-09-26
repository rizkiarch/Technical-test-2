import { Badge, Box, Button, CloseButton, Dialog, Field, Flex, FormatNumber, Heading, HStack, Input, LocaleProvider, Portal, Spinner, Stat, Text, VStack } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import { type RowSelectionOptions } from "ag-grid-community";
import type { ColDef } from "node_modules/ag-grid-community/dist/types/src/main-umd-noStyles";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiEdit2, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import { defaultTheme } from "~/ag-grid/theme";
import apiClient from "~/api/axios";
import { toaster } from "~/components/ui/toaster";
import { type DtPenjualanModel, type TrPenjualanModel } from "~/model/penjualan";
import type ProdukModel from "~/model/produk";
import PopupFormHeader, { type PopupFormHeaderRef } from "./popup-form-header";
import ProdukPopupList, { type ProdukPopupListRef } from "./popup-produk-list";

type PenjualanFormProps = {
  data?: TrPenjualanModel
}

export default function PenjualanForm({ data }: PenjualanFormProps) {
  const { trxID } = useParams();
  const navigate = useNavigate();
  const popupFormHeaderRef = useRef<PopupFormHeaderRef>(null);
  const produkPopupListRef = useRef<ProdukPopupListRef>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(true);
  const [mode, setMode] = useState<string>("create");
  const [selectedRows, setSelectedRows] = useState<DtPenjualanModel[]>();
  const [rowData, setRowData] = useState<DtPenjualanModel[]>([]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: false
    }
  }, []);
  const [colDefs, setColDefs] = useState<ColDef<DtPenjualanModel>[]>();
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple" | undefined
  >(() => {
    if (mode == "edit") return undefined;
    return { mode: "multiRow" };
  }, [mode]);
  const [tanggal, setTanggal] = useState<string>();
  const [customer, setCustomer] = useState<string>();
  const [customerName, setCustomerName] = useState<string>();
  const [customerIsMember, setCustomerIsMember] = useState<boolean>(false);
  const [gudang, setGudang] = useState<string>();
  const [gudangName, setGudangName] = useState<string>();
  const [catatan, setCatatan] = useState<string>();
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [totalSebelumDiskon, setTotalSebelumDiskon] = useState<number>(0);
  const [totalDiskon, setTotalDiskon] = useState<number>(0);
  const [totalAkhir, setTotalAkhir] = useState<number>(0);

  const updateHeader = (data: any) => {
    setTanggal(data.tanggal);
    setCustomer(data.customer);
    setCustomerName(data.customerName);
    setCustomerIsMember(data.customerIsMember);
    setGudang(data.gudang);
    setGudangName(data.gudangName);
    setCatatan(data.catatan);

    setDiscountRate(data.customerIsMember ? 2 : 0);
  };

  const openProdukDialog = () => {
    produkPopupListRef?.current?.open();
  };

  const onSelectionChanged = (event: any) => {
    if (event.selectedNodes && event.selectedNodes.length > 0)
      setSelectedRows(event.selectedNodes.map((node: any) => node.data))
  };

  const checkStok = async (produktId: string, gudangId: string, qty: number) => {
    try {
      const response = await apiClient(true).get(`/v1/pesanan-jual-stock/${produktId}/${gudangId}`);
      if (response.data.status) {
        const availableStok = response.data.data.stok;
        return qty <= availableStok;
      }
      return false;
    } catch (error) {
      console.error("Error checking stock:", error);
      return false;
    }
  };

  const addDetail = async (prd: ProdukModel) => {
    const duplicateIdx = rowData.findIndex((row: DtPenjualanModel) => row.dpjl_prd_id == prd.prd_id);
    if (duplicateIdx > -1) {
      toaster.warning({
        description: prd.prd_nama + " sudah ditambahkan"
      });
      return;
    }

    if (!gudang) {
      toaster.warning({
        description: "Silakan pilih gudang terlebih dahulu"
      });
      return;
    }

    const isStokAvailable = await checkStok(prd.prd_id, gudang, prd.prd_min_pesanan);
    if (!isStokAvailable) {
      toaster.error({
        description: "Stok tidak mencukupi untuk produk " + prd.prd_nama
      });
      return;
    }

    const defaultPrice = prd.prd_hargadef ? parseFloat(prd.prd_hargadef.toString()) : parseFloat(prd.prd_hargamin.toString());

    setRowData([...rowData, {
      dpjl_id: 0,
      dpjl_pjl_id: "",
      dpjl_prd_id: prd.prd_id,
      dpjl_qty: prd.prd_min_pesanan,
      dpjl_harga_sblm_disc: defaultPrice || 0,
      dpjl_disc: customerIsMember ? 2 : 0,
      produk: {
        prd_id: prd.prd_id,
        prd_nama: prd.prd_nama,
        prd_hargamin: parseFloat(prd.prd_hargamin.toString()) || 0,
        prd_min_pesanan: prd.prd_min_pesanan
      }
    }]);
  };

  const removeDetail = () => {
    if (!selectedRows || selectedRows.length == 0) {
      toaster.warning({
        description: "Tidak ada baris yang dipilih"
      });
      return;
    }

    const toRemoveIds = selectedRows.map((row: DtPenjualanModel) => row.dpjl_prd_id);
    setRowData(rowData.filter((row: DtPenjualanModel) => !toRemoveIds.includes(row.dpjl_prd_id)));
  };

  const calcTotals = () => {
    const totalSblmDiskon = rowData.reduce((total: number, x: DtPenjualanModel) => {
      return total + (x.dpjl_qty * x.dpjl_harga_sblm_disc);
    }, 0);

    const totalDisc = rowData.reduce((total: number, x: DtPenjualanModel) => {
      const discAmount = (x.dpjl_qty * x.dpjl_harga_sblm_disc) * (x.dpjl_disc / 100);
      return total + discAmount;
    }, 0);

    const totalFinal = totalSblmDiskon - totalDisc;

    setTotalSebelumDiskon(totalSblmDiskon);
    setTotalDiskon(totalDisc);
    setTotalAkhir(totalFinal);
  };

  const validateForm = () => {
    if (!tanggal) {
      toaster.error({ description: "Silakan pilih tanggal" });
      return false;
    }
    if (!customer) {
      toaster.error({ description: "Silakan pilih customer" });
      return false;
    }
    if (!gudang) {
      toaster.error({ description: "Silakan pilih gudang" });
      return false;
    }
    if (rowData.length === 0) {
      toaster.error({ description: "Silakan tambahkan minimal satu produk" });
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        pjl_tanggal: tanggal,
        pjl_gud_id: gudang,
        pjl_cust_id: customer,
        pjl_cust_is_member: customerIsMember,
        pjl_catatan: catatan,
        details: rowData.map(item => ({
          dpjl_prd_id: item.dpjl_prd_id,
          dpjl_qty: item.dpjl_qty,
          dpjl_harga_sblm_disc: item.dpjl_harga_sblm_disc,
          dpjl_disc: item.dpjl_disc
        }))
      };

      const response = await apiClient(true).post("/v1/pesanan-jual", payload);
      const responseData = response.data;
      if (!responseData.status) {
        toaster.error({
          description: responseData.message
        });
      } else {
        toaster.success({ description: "Penjualan berhasil disimpan" });
        navigate("/menu/penjualan/" + responseData.data.penjualan.pjl_id);
      }
    } catch (error: any) {
      console.error(error);
      if (error?.status >= 400 || error?.status < 500) {
        toaster.error({
          description: error?.response?.data?.message || "Internal server error"
        });
      } else if (error?.status >= 500) {
        toaster.error({
          description: 'Internal server error'
        });
      } else {
        toaster.error({
          description: 'Unknown error'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getData = async () => {
    setIsReady(false);
    try {
      const response = await apiClient(true).get("/v1/pesanan-jual/" + trxID);
      const responseData = response.data;
      if (!responseData.status) {
        toaster.error({
          description: responseData.message
        });
      } else {
        const penjualan = responseData.data.penjualan;
        setTanggal(penjualan.pjl_tanggal);
        setCustomer(penjualan.pjl_cust_id);
        setCustomerName(penjualan.customer?.cus_nama || '');
        setCustomerIsMember(penjualan.pjl_cust_is_member === 'Y');
        setGudang(penjualan.pjl_gud_id);
        setGudangName(penjualan.gudang?.gud_nama || '');
        setCatatan(penjualan.pjl_catatan);

        if (penjualan.details) {
          setRowData(penjualan.details.map((row: any) => ({
            dpjl_id: row.dpjl_id,
            dpjl_pjl_id: row.dpjl_pjl_id,
            dpjl_prd_id: row.dpjl_prd_id,
            dpjl_qty: parseFloat(row.dpjl_qty),
            dpjl_harga_sblm_disc: parseFloat(row.dpjl_harga_sblm_disc),
            dpjl_disc: parseFloat(row.dpjl_disc),
            produk: row.produk
          })));
        }
      }
    } catch (error: any) {
      console.error(error);
      if (error?.status >= 400 || error?.status < 500) {
        toaster.error({
          description: error?.response?.data?.message || "Internal server error"
        });
      } else if (error?.status >= 500) {
        toaster.error({
          description: 'Internal server error'
        });
      } else {
        toaster.error({
          description: 'Unknown error'
        });
      }
    } finally {
      setIsReady(true);
    }
  };

  const onCellValueChanged = async (event: any) => {
    const { data, colDef, newValue } = event;

    if (colDef.field === 'dpjl_qty') {
      const minQty = data.produk?.prd_min_pesanan || 1;
      if (newValue < minQty) {
        toaster.error({
          description: `Quantity minimal untuk ${data.produk?.prd_nama} adalah ${minQty}`
        });
        event.node.setDataValue('dpjl_qty', minQty);
        return;
      }

      const isStokAvailable = await checkStok(data.dpjl_prd_id, gudang!, newValue);
      if (!isStokAvailable) {
        toaster.error({
          description: `Stok tidak mencukupi untuk ${data.produk?.prd_nama}`
        });
        event.node.setDataValue('dpjl_qty', data.dpjl_qty);
        return;
      }
    }

    if (colDef.field === 'dpjl_harga_sblm_disc') {
      const minHarga = data.produk?.prd_hargamin || 0;
      if (newValue < minHarga) {
        toaster.error({
          description: `Harga minimal untuk ${data.produk?.prd_nama} adalah ${minHarga}`
        });
        event.node.setDataValue('dpjl_harga_sblm_disc', minHarga);
        return;
      }
    }

    if (colDef.field === 'dpjl_disc') {
      const maxDisc = customerIsMember ? 50 : 0;
      if (newValue < 0 || newValue > maxDisc) {
        toaster.error({
          description: `Diskon harus antara 0% - ${maxDisc}%`
        });
        event.node.setDataValue('dpjl_disc', customerIsMember ? 2 : 0);
        return;
      }
    }

    calcTotals();
  };

  useEffect(() => {
    calcTotals();
  }, [rowData]);

  useEffect(() => {
    if (trxID) {
      getData();
    }
  }, []);

  useEffect(() => {
    setMode(trxID ? "edit" : "create");
  }, [trxID]);

  useEffect(() => {
    setColDefs([
      { headerName: "No. Produk", field: "dpjl_prd_id", width: 150 },
      { headerName: "Nama Produk", field: "produk.prd_nama", width: 200 },
      {
        headerName: "Qty",
        field: "dpjl_qty",
        width: 100,
        editable: mode == "create",
        cellStyle: { textAlign: "right", background: mode == "create" ? "#fef08a" : "" },
        type: "numericColumn"
      },
      {
        headerName: "Harga",
        field: "dpjl_harga_sblm_disc",
        width: 120,
        editable: mode == "create",
        cellStyle: { textAlign: "right", background: mode == "create" ? "#fef08a" : "" },
        type: "numericColumn",
        cellRenderer: (params: any) => {
          return (
            <LocaleProvider locale="de-DE">
              <FormatNumber value={params.node.data.dpjl_harga_sblm_disc} />
            </LocaleProvider>
          )
        }
      },
      {
        headerName: "Disc (%)",
        field: "dpjl_disc",
        width: 100,
        editable: mode == "create" && customerIsMember,
        cellStyle: { textAlign: "right", background: mode == "create" && customerIsMember ? "#fef08a" : "" },
        type: "numericColumn"
      },
      {
        headerName: "Subtotal Sblm Disc",
        colId: "subtotalSblm",
        width: 150,
        cellStyle: { textAlign: "right" },
        cellRenderer: (params: any) => {
          const subtotal = params.node.data.dpjl_qty * params.node.data.dpjl_harga_sblm_disc;
          return (
            <LocaleProvider locale="de-DE">
              <FormatNumber value={subtotal} />
            </LocaleProvider>
          )
        }
      },
      {
        headerName: "Subtotal Setelah Disc",
        colId: "subtotalSetelah",
        width: 150,
        cellStyle: { textAlign: "right" },
        cellRenderer: (params: any) => {
          const subtotalSblm = params.node.data.dpjl_qty * params.node.data.dpjl_harga_sblm_disc;
          const discAmount = subtotalSblm * (params.node.data.dpjl_disc / 100);
          const subtotalSetelah = subtotalSblm - discAmount;
          return (
            <LocaleProvider locale="de-DE">
              <FormatNumber value={subtotalSetelah} />
            </LocaleProvider>
          )
        }
      }
    ])
  }, [mode, customerIsMember]);

  if (!isReady) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <VStack>
      <HStack justify="space-between" align="center" width="full" bg="white" padding={3} borderRadius={0} marginBottom={2} borderWidth={1}>
        <VStack align="start" width="full">
          <Heading>Form Penjualan</Heading>
          <Button size="sm" bg="cyan.600" onClick={() => navigate("/menu/penjualan")}>List</Button>
        </VStack>
        <Box width={150} bg="blue.500" padding={2} borderRadius={4}>
          <Stat.Root>
            <Stat.Label color="white">Total Sebelum Disc</Stat.Label>
            <Stat.ValueText color="white">
              <LocaleProvider locale="de-DE">
                <FormatNumber value={totalSebelumDiskon} />
              </LocaleProvider>
            </Stat.ValueText>
          </Stat.Root>
        </Box>
        <Box width={150} bg="orange.500" padding={2} borderRadius={4}>
          <Stat.Root>
            <Stat.Label color="white">Total Disc</Stat.Label>
            <Stat.ValueText color="white">
              <LocaleProvider locale="de-DE">
                <FormatNumber value={totalDiskon} />
              </LocaleProvider>
            </Stat.ValueText>
          </Stat.Root>
        </Box>
        <Box width={150} bg="green.500" padding={2} borderRadius={4}>
          <Stat.Root>
            <Stat.Label color="white">Total Akhir</Stat.Label>
            <Stat.ValueText color="white">
              <LocaleProvider locale="de-DE">
                <FormatNumber value={totalAkhir} />
              </LocaleProvider>
            </Stat.ValueText>
          </Stat.Root>
        </Box>
        {customerIsMember && (
          <VStack>
            <Field.Root>
              <Field.Label>Diskon Global (%)</Field.Label>
              <Input
                type="number"
                value={discountRate}
                onChange={(e) => {
                  const newRate = parseFloat(e.target.value) || 0;
                  if (newRate >= 0 && newRate <= 50) {
                    setDiscountRate(newRate);
                    const updatedRowData = rowData.map(item => ({
                      ...item,
                      dpjl_disc: newRate
                    }));
                    setRowData(updatedRowData);
                  }
                }}
                min="0"
                max="50"
                width="100px"
              />
            </Field.Root>
          </VStack>
        )}
      </HStack>
      <HStack bg="white" width="full" align="start" gap={0}>
        <VStack align="start" flex="1" padding={4} borderWidth={1} height="calc(100vh - 200px)">
          <HStack width="full" justify="space-between" borderBottomWidth={1} paddingY={2}>
            <Text fontWeight="bold">Header</Text>
            {mode == "create" ? (
              <Button size="xs" bg="cyan.600" onClick={() => popupFormHeaderRef?.current?.open()}>
                <FiEdit2 />
              </Button>
            ) : ""}
          </HStack>
          <Box>
            <Text fontSize="sm" color="gray.500">Customer</Text>
            <HStack>
              <Text>{customerName ? customerName : "-"}</Text>
              {customerIsMember && (
                <Badge colorScheme="green" size="sm">Member</Badge>
              )}
            </HStack>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">Gudang</Text>
            <Text>{gudangName ? gudangName : "-"}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">Catatan</Text>
            <Text>{catatan ? catatan : "-"}</Text>
          </Box>
        </VStack>
        <VStack flex="3" borderWidth={1} height="calc(100vh - 200px)" padding={4} align="start">
          <HStack width="full" justify="space-between" borderBottomWidth={1} paddingY={3}>
            <Text fontWeight="bold">Detail</Text>
          </HStack>
          {mode == "create" ? (
            <HStack>
              <Button size="xs" bg="cyan.600" onClick={openProdukDialog}>
                <FiPlus></FiPlus>
              </Button>
              <Button size="xs" bg="red.600" onClick={removeDetail}>
                <FiTrash></FiTrash>
              </Button>
            </HStack>
          ) : ""}
          <Box width="full" height="calc(100vh - 250px)">
            <AgGridReact
              theme={defaultTheme}
              rowData={rowData}
              defaultColDef={defaultColDef}
              columnDefs={colDefs}
              rowSelection={rowSelection}
              onSelectionChanged={onSelectionChanged}
              onCellValueChanged={onCellValueChanged}
            ></AgGridReact>
          </Box>
          {mode == "create" ? (
            <HStack justify="end" width="full">
              <Button bg="cyan.600" size="sm" loading={isLoading} onClick={submit}>Simpan</Button>
            </HStack>
          ) : ""}
        </VStack>

        {/* Dialog Header */}
        <PopupFormHeader ref={popupFormHeaderRef} data={{ tanggal, customer, customerName, customerIsMember, gudang, gudangName, catatan }} onSubmitted={updateHeader} />

        {/* Dialog List Produk */}
        <ProdukPopupList ref={produkPopupListRef} onRowDoubleClicked={addDetail} />
      </HStack>
    </VStack>
  );
};
