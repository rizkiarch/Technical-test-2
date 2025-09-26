import { Alert, Box, ButtonGroup, HStack, IconButton, Pagination } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import type UserModel from "~/model/user";
import { type ColDef, type RowDoubleClickedEvent } from "ag-grid-community";
import { defaultTheme } from "~/ag-grid/theme";
import apiClient from "~/api/axios";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface UserListProps {
  onRowDoubleClicked: (row: UserModel) => void
}

export type UserListRef = {
  refresh: () => void
};

const UserList = forwardRef<UserListRef, UserListProps>(({ onRowDoubleClicked }, ref) => {
  const [error, setError] = useState<string>();
  const [filters, setFilters] = useState<any>();
  const [rowData, setRowData] = useState<UserModel[]>();
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
  const [colDefs] = useState<ColDef<UserModel>[]>([
    { headerName: "ID", field: "usr_id", width: 100 },
    { headerName: "Username", field: "usr_nama", width: 300 }
  ]);

  const getUser = async () => {
    try {
      const response = await apiClient(true).get("/v1/user", {
        params: {
          page: currentPage,
          ...(filters && filters)
        }
      })
      const responseData = response.data;
      if (!responseData.status) {
        setError(responseData.message);
      } else {
        setRowData(responseData.data.users.data);
        setTotal(responseData.data.users.total);
        setPerPage(responseData.data.users.per_page);
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
    getUser();
  }, []);

  useEffect(() => {
    getUser();
  }, [currentPage, filters]);

  useImperativeHandle(ref, () => ({
    refresh: () => {
      getUser();
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

export default UserList;