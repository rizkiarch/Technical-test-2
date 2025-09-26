import { Box, Button, CloseButton, Dialog, Flex, FormatNumber, Heading, HStack, LocaleProvider, Portal, Spinner, Stat, Text, VStack } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import { type RowSelectionOptions } from "ag-grid-community";
import type { ColDef } from "node_modules/ag-grid-community/dist/types/src/main-umd-noStyles";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiEdit2, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import { defaultTheme } from "~/ag-grid/theme";
import apiClient from "~/api/axios";
import { toaster } from "~/components/ui/toaster";
import { type DtHilangBarangModel, type TrHilangBarangModel } from "~/model/hilang-barang";
import ProdukList from "../produk/list";
import type ProdukModel from "~/model/produk";
import PopupFormHeader, { type PopupFormHeaderRef } from "./popup-form-header";

type HilangBarangFormProps = {
  data?: TrHilangBarangModel
}

export default function HilangBarangForm({ data }: HilangBarangFormProps) {
  const { trxID } = useParams();
  const navigate = useNavigate();
  const popupFormHeaderRef = useRef<PopupFormHeaderRef>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(true);
  const [mode, setMode] = useState<string>("create");
  const [produkDialogOpen, setProdukDialogOpen] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<DtHilangBarangModel[]>();
  const [rowData, setRowData] = useState<DtHilangBarangModel[]>([]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: false
    }
  }, []);
  const [colDefs, setColDefs] = useState<ColDef<DtHilangBarangModel>[]>();
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple" | undefined
  >(() => {
    if (mode == "edit") return undefined;
    return { mode: "multiRow" };
  }, [mode]);
  const [tanggal, setTanggal] = useState<string>();
  const [gudang, setGudang] = useState<string>();
  const [catatan, setCatatan] = useState<string>();
  const [totalBiaya, setTotalBiaya] = useState<number>(0);

  const updateHeader = (data: any) => {
    setTanggal(data.tanggal);
    setGudang(data.gudang);
    setCatatan(data.catatan);
  };

  const openProdukDialog = () => {
    setProdukDialogOpen(true);
  };

  const onSelectionChanged = (event: any) => {
    if (event.selectedNodes && event.selectedNodes.length > 0)
    setSelectedRows(event.selectedNodes.map((node: any) => node.data))
  };

  const addDetail = (prd: ProdukModel) => {
    const duplicateIdx = rowData.findIndex((row: DtHilangBarangModel) => row.dhil_prd_id == prd.prd_id);
    if (duplicateIdx > -1) {
      toaster.warning({
        description: prd.prd_nama + " sudah ditambahkan"
      });
      return;
    }

    setRowData([...rowData, {
      dhil_id: crypto.randomUUID(),
      dhil_hil_id: "",
      dhil_prd_id: prd.prd_id,
      dhil_prd_nama: prd.prd_nama,
      dhil_qty: 0,
      dhil_biaya: 0
    }]);

    setProdukDialogOpen(false);
  };

  const removeDetail = () => {
    if (!selectedRows || selectedRows.length == 0) {
      toaster.warning({
        description: "Tidak ada baris yang dipilih"
      });
      return;
    }

    const toRemoveDhilID = selectedRows.map((row: DtHilangBarangModel) => row.dhil_id);
    setRowData(rowData.filter((row: DtHilangBarangModel) => !toRemoveDhilID.includes(row.dhil_id)));
  };

  const calcTotalBiaya = () => {
    setTotalBiaya(
      rowData.reduce((total: number, x: DtHilangBarangModel) => {
        return total + (x.dhil_qty * x.dhil_biaya);
      }, 0)
    )
  };

  const submit = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient(true).post("/v1/hilang-barang", {
        hil_tanggal: tanggal,
        hil_gud_id: gudang,
        hil_catatan: catatan,
        details: rowData
      });
      const responseData = response.data;
      if (!responseData.status) {
        toaster.error({
          description: responseData.message
        });
      } else {
        toaster.success({ description: "Proses selesai" });
        navigate("/menu/hilang-barang/" + responseData.data.hilang_barang.hil_id);
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
      const response = await apiClient(true).get("/v1/hilang-barang/" + trxID);
      const responseData = response.data;
      if (!responseData.status) {
        toaster.error({
          description: responseData.message
        });
      } else {
        setTanggal(responseData.data.hilang_barang.hil_tanggal);
        setGudang(responseData.data.hilang_barang.hil_gud_id);
        setCatatan(responseData.data.hilang_barang.hil_catatan);
        setTotalBiaya(parseFloat(responseData.data.hilang_barang.hil_total_biaya));
        setRowData(
          responseData.data.hilang_barang.details.map((row: any) => {
            return {
              dhil_id: row.dhil_id,
              dhil_hil_id: row.dhil_hil_id,
              dhil_prd_id: row.dhil_prd_id,
              dhil_prd_nama: row.dhil_prd_nama,
              dhil_qty: parseFloat(row.dhil_qty),
              dhil_biaya: parseFloat(row.dhil_biaya),
            }
          })
        );
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

  useEffect(() => {
    calcTotalBiaya();
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
      { headerName: "No. Produk", field: "dhil_prd_id", width: 150 },
      { headerName: "Nama Produk", field: "dhil_prd_nama", width: 250 },
      { headerName: "Qty", field: "dhil_qty", width: 100, editable: mode == "create", cellStyle: { textAlign: "right", background: mode == "create" ? "#fef08a" : "" } },
      { headerName: "Biaya", field: "dhil_biaya", width: 120, editable: mode == "create", cellStyle: { textAlign: "right", background: mode == "create" ? "#fef08a" : "" }, cellRenderer: (params: any) => {
        return (
          <LocaleProvider locale="de-DE">
            <FormatNumber value={params.node.data.dhil_biaya}/>
          </LocaleProvider>
        )
      } },
      { headerName: "Total", field: "dhil_biaya", width: 120, cellStyle: { textAlign: "right" }, cellRenderer: (params: any) => {
        return (
          <LocaleProvider locale="de-DE">
            <FormatNumber value={params.node.data.dhil_qty * params.node.data.dhil_biaya}/>
          </LocaleProvider>
        )
      } }
    ])
  }, [mode]);

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
          <Heading>Hilang Barang</Heading>
          <Button size="sm" bg="cyan.600" onClick={() => navigate("/menu/hilang-barang")}>List</Button>
        </VStack>
        <Box width={150} bg="green.500" padding={2} borderRadius={4}>
          <Stat.Root>
            <Stat.Label color="white">Total Biaya</Stat.Label>
            <Stat.ValueText color="white">
              <LocaleProvider locale="de-DE">
                <FormatNumber value={totalBiaya}/>
              </LocaleProvider>
            </Stat.ValueText>
          </Stat.Root>
        </Box>
      </HStack>
      <HStack bg="white" width="full" align="start" gap={0}>
        <VStack align="start" flex="1" padding={4} borderWidth={1} height="calc(100vh - 200px)">
          <HStack width="full" justify="space-between" borderBottomWidth={1} paddingY={2}>
            <Text fontWeight="bold">Header</Text>
            {mode == "create" ? (
              <Button size="xs" bg="cyan.600" onClick={() => popupFormHeaderRef?.current?.open()}>
                <FiEdit2/>
              </Button>
            ) : ""}
          </HStack>
          <Box>
            <Text fontSize="sm" color="gray.500">Tanggal</Text>
            <Text>{tanggal ? tanggal : "-"}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">Gudang</Text>
            <Text>{gudang ? gudang : "-"}</Text>
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
              onCellValueChanged={calcTotalBiaya}
            ></AgGridReact>
          </Box>
          {mode == "create" ? (
            <HStack justify="end" width="full">
              <Button bg="cyan.600" size="sm" loading={isLoading} onClick={submit}>Simpan</Button>
            </HStack>
          ) : ""}
        </VStack>

        {/* Dialog Header */}
        <PopupFormHeader ref={popupFormHeaderRef} data={{ tanggal, gudang, catatan }} onSubmitted={updateHeader} />

        {/* Dialog List Produk */}
        <Dialog.Root key="dialog-produk" size="xl" open={produkDialogOpen}>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Produk</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body paddingBottom={16}>
                  <ProdukList onRowDoubleClicked={addDetail}/>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setProdukDialogOpen(false)}>Batal</Button>
                  </Dialog.ActionTrigger>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" onClick={() => setProdukDialogOpen(false)} />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </HStack>
    </VStack>
  );
};
