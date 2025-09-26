import { Button, CloseButton, Dialog, Heading, HStack, Portal, VStack } from "@chakra-ui/react";
import StokList, { type StokListRef } from "./list";
import { useRef, useState } from "react";
import type StokModel from "~/model/stok";
import { FiPlus } from "react-icons/fi";

export default function Stok() {
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [activeData, setActiveData] = useState<StokModel | null>(null);
  const listRef = useRef<StokListRef>(null);

  const onNewButtonClicked = () => {
    setFormMode("create");
    setActiveData(null);
    setFormOpen(true);
  };

  const onRowDoubleClicked = (row: StokModel) => {
    setFormMode("edit");
    setActiveData(row);
    setFormOpen(true);
  };

  const onFormSubmitted = () => {
    setFormOpen(false);
    listRef.current?.refresh();
  };

  return (
    <VStack align="start" width="full">
      <HStack justify="space-between" width="full" padding={3} bg="white" borderRadius={4} borderWidth={1}>
        <Heading>Stok</Heading>
      </HStack>

      {/* List Stok */}
      <StokList ref={listRef} onRowDoubleClicked={onRowDoubleClicked}/>
    </VStack>
  )
};
