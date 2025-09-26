import { Button, CloseButton, Dialog, Heading, HStack, Portal, VStack } from "@chakra-ui/react";
import ProdukList, { type ProdukListRef } from "./list";
import ProdukForm from "./form";
import { useRef, useState } from "react";
import type ProdukModel from "~/model/produk";
import { FiPlus } from "react-icons/fi";

export default function Produk() {
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [activeData, setActiveData] = useState<ProdukModel | null>(null);
  const listRef = useRef<ProdukListRef>(null);

  const onNewButtonClicked = () => {
    setFormMode("create");
    setActiveData(null);
    setFormOpen(true);
  };

  const onRowDoubleClicked = (row: ProdukModel) => {
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
        <Heading>Produk</Heading>
        <HStack justify="end" flex={1}>
          <Button bg="cyan.600" size="sm" onClick={onNewButtonClicked}><FiPlus/> Produk Baru</Button>
        </HStack>
      </HStack>

      {/* List Produk */}
      <ProdukList ref={listRef} onRowDoubleClicked={onRowDoubleClicked}/>

      {/* Dialog Form Produk */}
      <Dialog.Root open={formOpen}>
        <Portal>
          <Dialog.Backdrop/>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Form Produk</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <ProdukForm mode={formMode} data={activeData ? activeData : undefined} onSubmitted={onFormSubmitted} />
              </Dialog.Body>
              <Dialog.CloseTrigger asChild onClick={() => setFormOpen(false)}>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  )
};
