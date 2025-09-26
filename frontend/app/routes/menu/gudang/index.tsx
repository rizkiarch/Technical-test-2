import { Button, CloseButton, Dialog, Heading, HStack, Portal, VStack } from "@chakra-ui/react";
import GudangList, { type GudangListRef } from "./list";
import GudangForm from "./form";
import { useRef, useState } from "react";
import type GudangModel from "~/model/gudang";
import { FiPlus } from "react-icons/fi";

export interface GudangListProps {
  onRowDoubleClicked: (row: GudangModel) => void
}

export default function Gudang() {
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [activeData, setActiveData] = useState<GudangModel | null>(null);
  const listRef = useRef<GudangListRef>(null);

  const onNewButtonClicked = () => {
    setFormMode("create");
    setActiveData(null);
    setFormOpen(true);
  };

  const onRowDoubleClicked = (row: GudangModel) => {
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
        <Heading>Gudang</Heading>
        <HStack justify="end" flex={1}>
          <Button bg="cyan.600" size="sm" onClick={onNewButtonClicked}><FiPlus/> Gudang Baru</Button>
        </HStack>
      </HStack>

      {/* List Gudang */}
      <GudangList ref={listRef} onRowDoubleClicked={onRowDoubleClicked}/>

      {/* Dialog Form Gudang */}
      <Dialog.Root open={formOpen}>
        <Portal>
          <Dialog.Backdrop/>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Form Gudang</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <GudangForm mode={formMode} data={activeData ? activeData : undefined} onSubmitted={onFormSubmitted} />
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
