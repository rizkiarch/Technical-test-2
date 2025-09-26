import { Box, Button, CloseButton, Dialog, Flex, HStack, Icon, IconButton, List, Portal, Spinner, Text, VStack } from "@chakra-ui/react";
import {
  FiBook,
  FiBox,
  FiChevronsLeft,
  FiCodepen,
  FiCodesandbox,
  FiHome,
  FiLogOut,
  FiMenu,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";
import { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "~/context/auth-context";
import type { Route } from "./+types/menu/layout";

const menuItems = [
  { icon: FiHome, name: "Dashboard", path: "/menu" },
  { icon: FiCodesandbox, name: "Gudang", path: "/menu/gudang" },
  { icon: FiBox, name: "Produk", path: "/menu/produk" },
  { icon: FiBox, name: "Stok", path: "/menu/stok" },
  { icon: FiBook, name: "Customer", path: "/menu/customer" },
  { icon: FiUsers, name: "User", path: "/menu/user" },
  { icon: FiCodepen, name: "Hilang Barang", path: "/menu/hilang-barang" },
  { icon: FiShoppingCart, name: "Penjualan", path: "/menu/penjualan" }
];

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "MiniERP" },
    { name: "description", content: "" },
  ];
}

export default function MenuLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState<boolean>(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <HStack minHeight="100vh" align="start" gap={0}>
      <Box as="aside" minHeight="100vh" width={isSidebarOpen ? 72 : 20} transition="width 0.25s ease" background="gray.800">
        <HStack justify="space-between" color="white" height={14} paddingX={4} shadow={"lg"} borderBottomWidth={1} borderBottomColor={"gray.900"}>
          {isSidebarOpen && <Text>MiniERP</Text>}
          <IconButton
            fontSize="18px"
            variant="ghost"
            aria-label="open menu"
            color={"gray.100"}
            _hover={{ color: "gray.900" }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {!isSidebarOpen ? <FiMenu /> : <FiChevronsLeft />}
          </IconButton>
        </HStack>
        <Box marginTop={4} paddingX={4}>
          <List.Root gap="1" variant="plain" align="center">
            {menuItems.map((item, index) => (
              <List.Item asChild key={index} paddingY={2} paddingX={3} borderRadius={4} cursor="pointer" bg={currentPath == item.path ? "gray.100" : ""} color={currentPath == item.path ? "gray.900" : "gray.100"} _hover={{ bg: "gray.100", color: "gray.900" }}>
                <Link to={item.path}>
                  <List.Indicator asChild color="cyan.600">
                    <Icon as={item.icon}></Icon>
                  </List.Indicator>
                  {isSidebarOpen ? item.name : ""}
                </Link>
              </List.Item>
            ))}
          </List.Root>
        </Box>
      </Box>
      <Box flex={1} minHeight="100vh">
        <VStack align="start" minHeight="100vh" bg={"gray.100"}>
          <HStack justify="end" bg="cyan.600" height={14} width="full" shadow={"lg"} paddingX={4}>
            <IconButton
              fontSize="18px"
              variant="ghost"
              aria-label="open menu"
              color={"gray.100"}
              _hover={{ color: "gray.900" }}
              onClick={() => setIsLogoutDialogOpen(true)}
            >
              <FiLogOut />
            </IconButton>
          </HStack>
          <Box width="full" padding={4} flex={1}>
            <Outlet />
          </Box>
        </VStack>
      </Box>

      {/* Dialog Form Customer */}
      <Dialog.Root role="alertdialog" open={isLogoutDialogOpen}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Keluar</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>
                  Anda yakin ingin keluar?
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setIsLogoutDialogOpen(false)}>Batal</Button>
                </Dialog.ActionTrigger>
                <Button colorPalette="red" size="sm" onClick={() => logout()}>Ya</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </HStack>
  );
};