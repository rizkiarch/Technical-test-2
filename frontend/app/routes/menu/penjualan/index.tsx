import { Button, Heading, HStack, VStack } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import type { TrPenjualanModel } from "~/model/penjualan";
import type { PenjualanListRef } from "./list";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import PenjualanList from "./list";

export default function Penjualan() {
    const [activeData, setActiveData] = useState<TrPenjualanModel | null>(null);
    const listRef = useRef<PenjualanListRef>(null);
    const navigate = useNavigate();

    const onNewButtonClicked = () => {
        setActiveData(null);
        navigate("/menu/penjualan/create");
    };

    const onRowDoubleClicked = (row: TrPenjualanModel) => {
        setActiveData(row);
        navigate("/menu/penjualan/" + row.pjl_id);
    };

    return (
        <VStack align="start" width="full">
            <HStack justify="space-between" width="full" padding={3} bg="white" borderRadius={4} borderWidth={1}>
                <Heading>Penjualan</Heading>
                <HStack justify="end" flex={1}>
                    <Button bg="cyan.600" size="sm" onClick={onNewButtonClicked}><FiPlus /> Tambah Transaksi</Button>
                </HStack>
            </HStack>

            {/* List Penjualan */}
            <PenjualanList ref={listRef} onRowDoubleClicked={onRowDoubleClicked} />
        </VStack>
    )
}