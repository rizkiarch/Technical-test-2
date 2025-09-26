import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import GudangList from "./list";
import { forwardRef, useImperativeHandle, useState } from "react";
import type { GudangListProps } from ".";

export type GudangPopupListRef = {
  open: () => void;
  close: () => void;
}

const GudangPopupList = forwardRef<GudangPopupListRef, GudangListProps>(({ onRowDoubleClicked }, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  
  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true);
    },
    close: () => {
      setOpen(false);
    }
  }));

  return (
    <Dialog.Root key="gudang-popup-list" size="xl" open={open}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Gudang</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body paddingBottom={16}>
              <GudangList onRowDoubleClicked={(data) => { onRowDoubleClicked(data); setOpen(false); }}/>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Batal</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={() => setOpen(false)}/>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});

export default GudangPopupList;