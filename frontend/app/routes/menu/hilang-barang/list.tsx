import { Alert, Box, ButtonGroup, FormatNumber, HStack, IconButton, LocaleProvider, Pagination } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { type TrHilangBarangModel } from "~/model/hilang-barang";
import { type ColDef, type RowDoubleClickedEvent } from "ag-grid-community";
import { defaultTheme } from "~/ag-grid/theme";
import apiClient from "~/api/axios";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface HilangBarangListProps {
  onRowDoubleClicked: (row: TrHilangBarangModel) => void
}

export type HilangBarangListRef = {
  refresh: () => void
};

const HilangBarangList = forwardRef<HilangBarangListRef, HilangBarangListProps>(({ onRowDoubleClicked }, ref) => {
  const [error, setError] = useState<string>();
  const [filters, setFilters] = useState<any>();
  const [rowData, setRowData] = useState<TrHilangBarangModel[]>();
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
  const [colDefs] = useState<ColDef<TrHilangBarangModel>[]>([
    { headerName: "ID", field: "hil_id", width: 120 },
    { headerName: "Tanggal", field: "hil_tanggal", width: 120 },
    { headerName: "Gudang", field: "hil_gud_id", width: 100 },
    { headerName: "Catatan", field: "hil_catatan", width: 300 },
    { headerName: "Total Biaya", field: "hil_total_biaya", width: 150, cellStyle: { textAlign: 'right' }, filter: false, cellRenderer: (params: any) => {
      return (
        <LocaleProvider locale="de-DE">
          <FormatNumber value={params.node.data.hil_total_biaya}/>
        </LocaleProvider>
      )
    } },
    { headerName: "Void", field: "hil_void", width: 80 },
  ]);

  const getHilangBarang = async () => {
    try {
      const response = await apiClient(true).get("/v1/hilang-barang", {
        params: {
          page: currentPage,
          ...(filters && filters)
        }
      })
      const responseData = response.data;
      if (!responseData.status) {
        setError(responseData.message);
      } else {
        setRowData(responseData.data.hilang_barangs.data);
        setTotal(responseData.data.hilang_barangs.total);
        setPerPage(responseData.data.hilang_barangs.per_page);
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
    getHilangBarang();
  }, []);

  useEffect(() => {
    getHilangBarang();
  }, [currentPage, filters]);

  useImperativeHandle(ref, () => ({
    refresh: () => {
      getHilangBarang();
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
})

export default HilangBarangList;