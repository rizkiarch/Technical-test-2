import { Alert, Box, Button, CloseButton, Dialog, Flex, FormatNumber, LocaleProvider, Portal, Spinner, VStack } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import type ProdukModel from "~/model/produk";
import { type ColDef, type RowDoubleClickedEvent } from "ag-grid-community";
import { defaultTheme } from "~/ag-grid/theme";
import apiClient from "~/api/axios";

interface ProdukPopupListProps {
    onRowDoubleClicked: (row: ProdukModel) => void
}

export type ProdukPopupListRef = {
    open: () => void;
    close: () => void;
};

const ProdukPopupList = forwardRef<ProdukPopupListRef, ProdukPopupListProps>(({ onRowDoubleClicked }, ref) => {
    const [error, setError] = useState<string>();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [rowData, setRowData] = useState<ProdukModel[]>([]);
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            filter: true,
            sortable: true,
            resizable: true,
            suppressMenu: true,
            floatingFilter: true,
            suppressFloatingFilterButton: true,
        }
    }, []);
    const icons = useMemo(() => {
        return {
            filter: ' '
        }
    }, []);
    const [colDefs] = useState<ColDef<ProdukModel>[]>([
        { headerName: "ID", field: "prd_id", width: 120 },
        { headerName: "Nama Produk", field: "prd_nama", width: 250 },
        {
            headerName: "Harga Default", field: "prd_hargadef", width: 130, cellStyle: { textAlign: 'right' }, cellRenderer: (params: any) => {
                const value = parseFloat(params.node.data.prd_hargadef) || 0;
                return (
                    <LocaleProvider locale="de-DE">
                        <FormatNumber value={value} />
                    </LocaleProvider>
                )
            }
        },
        {
            headerName: "Harga Minimum", field: "prd_hargamin", width: 130, cellStyle: { textAlign: 'right' }, cellRenderer: (params: any) => {
                const value = parseFloat(params.node.data.prd_hargamin) || 0;
                return (
                    <LocaleProvider locale="de-DE">
                        <FormatNumber value={value} />
                    </LocaleProvider>
                )
            }
        },
        { headerName: "Min Pesanan", field: "prd_min_pesanan", width: 100, cellStyle: { textAlign: 'right' } },
    ]);

    const getProduk = async () => {
        setLoading(true);
        setError(undefined);
        try {
            console.log("Fetching products...");
            const response = await apiClient(true).get("/v1/pesanan-jual-products");
            console.log("Product response:", response.data);
            const responseData = response.data;
            if (!responseData.status) {
                setError(responseData.message);
                setRowData([]);
            } else {
                setRowData(responseData.data || []);
            }
        } catch (error: any) {
            console.error("Product fetch error:", error);
            if (error?.response?.status >= 400 && error?.response?.status < 500) {
                setError(error?.response?.data?.message || "Client error");
            } else if (error?.response?.status >= 500) {
                setError("Internal server error");
            } else {
                setError("Network error: " + (error.message || "Unknown error"));
            }
            setRowData([]);
        } finally {
            setLoading(false);
        }
    }

    useImperativeHandle(ref, () => ({
        open: () => {
            setOpen(true);
            getProduk();
        },
        close: () => {
            setOpen(false);
        }
    }));

    const alertError = () => {
        if (!error) return "";
        return (
            <Alert.Root status="error" marginY={2}>
                <Alert.Indicator />
                <Alert.Title>{error}</Alert.Title>
            </Alert.Root>
        )
    }

    return (
        <Dialog.Root key="dialog-produk" size="xl" open={open}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Produk</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body paddingBottom={16}>
                            <VStack>
                                {alertError()}
                                {loading ? (
                                    <Flex align="center" justify="center" height="400px" width="full">
                                        <Spinner size="xl" />
                                    </Flex>
                                ) : (
                                    <Box height="400px" width="full">
                                        <AgGridReact
                                            theme={defaultTheme}
                                            rowData={rowData}
                                            defaultColDef={defaultColDef}
                                            columnDefs={colDefs}
                                            icons={icons}
                                            onRowDoubleClicked={(event: RowDoubleClickedEvent) => {
                                                onRowDoubleClicked(event.data);
                                                setOpen(false);
                                            }}
                                        ></AgGridReact>
                                    </Box>
                                )}
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Batal</Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={() => setOpen(false)} />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});

export default ProdukPopupList;