import { Button, CloseButton, Dialog, Heading, HStack, Portal, VStack } from "@chakra-ui/react";
import HilangBarangList, { type HilangBarangListRef } from "./list";
import HilangBarangForm from "./form";
import { useRef, useState } from "react";
import { type TrHilangBarangModel } from "~/model/hilang-barang";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router";

export default function HilangBarang() {
  const [activeData, setActiveData] = useState<TrHilangBarangModel | null>(null);
  const listRef = useRef<HilangBarangListRef>(null);
  const navigate = useNavigate();

  const onNewButtonClicked = () => {
    setActiveData(null);
    navigate("/menu/hilang-barang/create");
  };

  const onRowDoubleClicked = (row: TrHilangBarangModel) => {
    setActiveData(row);
    navigate("/menu/hilang-barang/" + row.hil_id);
  };

  return (
    <VStack align="start" width="full">
      <HStack justify="space-between" width="full" padding={3} bg="white" borderRadius={4} borderWidth={1}>
        <Heading>Hilang Barang</Heading>
        <HStack justify="end" flex={1}>
          <Button bg="cyan.600" size="sm" onClick={onNewButtonClicked}><FiPlus/> Hilang Barang Baru</Button>
        </HStack>
      </HStack>

      {/* List HilangBarang */}
      <HilangBarangList ref={listRef} onRowDoubleClicked={onRowDoubleClicked}/>
    </VStack>
  )
};
