import { Button, CloseButton, Dialog, Heading, HStack, Portal, VStack } from "@chakra-ui/react";
import UserList, { type UserListRef } from "./list";
import UserForm from "./form";
import { useRef, useState } from "react";
import type UserModel from "~/model/user";
import { FiPlus } from "react-icons/fi";

export default function User() {
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [activeData, setActiveData] = useState<UserModel | null>(null);
  const listRef = useRef<UserListRef>(null);

  const onNewButtonClicked = () => {
    setFormMode("create");
    setActiveData(null);
    setFormOpen(true);
  };

  const onRowDoubleClicked = (row: UserModel) => {
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
        <Heading>User</Heading>
        <HStack justify="end" flex={1}>
          <Button bg="cyan.600" size="sm" onClick={onNewButtonClicked}><FiPlus/> User Baru</Button>
        </HStack>
      </HStack>

      {/* List User */}
      <UserList ref={listRef} onRowDoubleClicked={onRowDoubleClicked}/>

      {/* Dialog Form User */}
      <Dialog.Root open={formOpen}>
        <Portal>
          <Dialog.Backdrop/>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Form User</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <UserForm mode={formMode} data={activeData ? activeData : undefined} onSubmitted={onFormSubmitted} />
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
