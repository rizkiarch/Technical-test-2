import { Alert, Box, ButtonGroup, FormatNumber, HStack, IconButton, LocaleProvider, Pagination } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { type TrPenjualanModel } from "~/model/penjualan";
import { type ColDef, type RowDoubleClickedEvent } from "ag-grid-community";
import { defaultTheme } from "~/ag-grid/theme";
import apiClient from "~/api/axios";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PenjualanListProps {
    onRowDoubleClicked: (row: TrPenjualanModel) => void
}

export type PenjualanListRef = {
    refresh: () => void
};

const PenjualanList = forwardRef<PenjualanListRef, PenjualanListProps>(({ onRowDoubleClicked }, ref) => {
    const [error, setError] = useState<string>();
    const [filters, setFilters] = useState<any>();
    const [rowData, setRowData] = useState<TrPenjualanModel[]>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(25);
    const [total, setTotal] = useState<number>(0);
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
    const [colDefs] = useState<ColDef<TrPenjualanModel>[]>([
        { headerName: "ID", field: "pjl_id", width: 120 },
        { headerName: "Tanggal", field: "pjl_tanggal", width: 120 },
        { headerName: "Customer", field: "customer.cus_nama", width: 200 },
        { headerName: "Gudang", field: "gudang.gud_nama", width: 150 },
        {
            headerName: "Total Harga", field: "pjl_total_harga", width: 150, cellStyle: { textAlign: 'right' }, filter: false, cellRenderer: (params: any) => {
                return (
                    <LocaleProvider locale="de-DE">
                        <FormatNumber value={params.node.data.pjl_total_harga} />
                    </LocaleProvider>
                )
            }
        },
        { headerName: "Catatan", field: "pjl_catatan", width: 200 },
        { headerName: "Status", field: "pjl_void", width: 100, cellRenderer: (params: any) => params.value === 'Y' ? 'Void' : 'Aktif' },
    ]);

    const getPenjualan = async () => {
        try {
            const response = await apiClient(true).get("/v1/pesanan-jual", {
                params: {
                    page: currentPage,
                    ...(filters && filters)
                }
            })
            console.log("Penjualan list response:", response.data);
            const responseData = response.data;
            if (!responseData.status) {
                setError(responseData.message);
            } else {
                // Check the actual response structure
                const penjualanData = responseData.data?.pesanan_juals || responseData.data?.penjualans || responseData.data;
                if (Array.isArray(penjualanData)) {
                    setRowData(penjualanData);
                    setTotal(penjualanData.length);
                    setPerPage(25);
                } else if (penjualanData?.data) {
                    setRowData(penjualanData.data);
                    setTotal(penjualanData.total || 0);
                    setPerPage(penjualanData.per_page || 25);
                } else {
                    setRowData([]);
                    setTotal(0);
                    setPerPage(25);
                }
            }
        } catch (error: any) {
            console.error(error);
            if (error?.status >= 400 || error?.status < 500) {
                setError(error?.response?.data?.message || "Internal server error");
            } else if (error?.status >= 500) {
                setError("Internal server error");
            } else {
                setError("Unknown error");
            }
        }
    }

    const onFilterChanged = (event: any) => {
        let filters: any = {};
        let filterModels = event.api.getFilterModel();
        for (let key of Object.keys(filterModels)) {
            filters[key] = filterModels[key].filter;
        }
        setFilters(filters);
        setCurrentPage(1);
    };

    useEffect(() => {
        getPenjualan();
    }, []);

    useEffect(() => {
        getPenjualan();
    }, [currentPage, filters]);

    useImperativeHandle(ref, () => ({
        refresh: () => {
            getPenjualan();
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
        <Box height="calc(100vh - 250px)" width="full">
            {alertError()}
            <AgGridReact
                theme={defaultTheme}
                rowData={rowData}
                defaultColDef={defaultColDef}
                columnDefs={colDefs}
                icons={icons}
                onFilterChanged={onFilterChanged}
                onRowDoubleClicked={(event: RowDoubleClickedEvent) => onRowDoubleClicked(event.data)}
            ></AgGridReact>
            <HStack width="full" marginY={2} justify="end">
                <Pagination.Root count={total} pageSize={perPage} defaultPage={1} key="sm">
                    <ButtonGroup variant="ghost" size="sm">
                        <Pagination.PrevTrigger asChild>
                            <IconButton onClick={() => setCurrentPage(currentPage - 1)}>
                                <LuChevronLeft />
                            </IconButton>
                        </Pagination.PrevTrigger>

                        <Pagination.Items
                            render={(page) => (
                                <IconButton variant={{ base: "ghost", _selected: "solid" }} onClick={() => setCurrentPage(page.value)}>
                                    {page.value}
                                </IconButton>
                            )}
                        />

                        <Pagination.NextTrigger asChild>
                            <IconButton onClick={() => setCurrentPage(currentPage + 1)}>
                                <LuChevronRight />
                            </IconButton>
                        </Pagination.NextTrigger>
                    </ButtonGroup>
                </Pagination.Root>
            </HStack>
        </Box>
    )
});

PenjualanList.displayName = "PenjualanList";

export default PenjualanList;