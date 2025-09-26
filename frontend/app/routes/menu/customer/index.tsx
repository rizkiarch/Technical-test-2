import { Button, CloseButton, Dialog, Heading, HStack, Portal, VStack } from "@chakra-ui/react";
import CustomerList, { type CustomerListRef } from "./list";
import CustomerForm from "./form";
import { useRef, useState } from "react";
import type CustomerModel from "~/model/customer";
import { FiPlus } from "react-icons/fi";

export default function Customer() {
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [activeData, setActiveData] = useState<CustomerModel | null>(null);
  const listRef = useRef<CustomerListRef>(null);

  const onNewButtonClicked = () => {
    setFormMode("create");
    setActiveData(null);
    setFormOpen(true);
  };

  const onRowDoubleClicked = (row: CustomerModel) => {
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
        <Heading>Customer</Heading>
        <HStack justify="end" flex={1}>
          <Button bg="cyan.600" size="sm" onClick={onNewButtonClicked}><FiPlus/> Customer Baru</Button>
        </HStack>
      </HStack>

      {/* List Customer */}
      <CustomerList ref={listRef} onRowDoubleClicked={onRowDoubleClicked}/>

      {/* Dialog Form Customer */}
      <Dialog.Root open={formOpen}>
        <Portal>
          <Dialog.Backdrop/>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Form Customer</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <CustomerForm mode={formMode} data={activeData ? activeData : undefined} onSubmitted={onFormSubmitted} />
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
