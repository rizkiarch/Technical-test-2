import { Alert, Box, Button, CloseButton, Dialog, Flex, Portal, Spinner, VStack } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import type CustomerModel from "~/model/customer";
import { type ColDef, type RowDoubleClickedEvent } from "ag-grid-community";
import { defaultTheme } from "~/ag-grid/theme";
import apiClient from "~/api/axios";

interface CustomerPopupListProps {
    onRowDoubleClicked: (row: CustomerModel) => void
}

export type CustomerPopupListRef = {
    open: () => void;
    close: () => void;
};

const CustomerPopupList = forwardRef<CustomerPopupListRef, CustomerPopupListProps>(({ onRowDoubleClicked }, ref) => {
    const [error, setError] = useState<string>();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [rowData, setRowData] = useState<CustomerModel[]>([]);
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
    const [colDefs] = useState<ColDef<CustomerModel>[]>([
        { headerName: "ID", field: "cus_id", width: 100 },
        { headerName: "Nama Customer", field: "cus_nama", width: 300 },
        { headerName: "Kota", field: "cus_kota", width: 200 },
        { headerName: "Member", field: "cus_is_member", width: 80, cellRenderer: (params: any) => params.value === 'Y' ? '✓' : '' },
        { headerName: "Aktif", field: "cus_aktif", width: 80, cellRenderer: (params: any) => params.value === 'Y' ? '✓' : '' },
    ]);

    const getCustomer = async () => {
        setLoading(true);
        setError(undefined);
        try {
            console.log("Fetching customers...");
            const response = await apiClient(true).get("/v1/pesanan-jual-customers");
            console.log("Customer response:", response.data);
            const responseData = response.data;
            if (!responseData.status) {
                setError(responseData.message);
                setRowData([]);
            } else {
                setRowData(responseData.data || []);
            }
        } catch (error: any) {
            console.error("Customer fetch error:", error);
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
            getCustomer();
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
        <Dialog.Root key="dialog-customer" size="xl" open={open}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Customer</Dialog.Title>
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

export default CustomerPopupList;