import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { GudangPopupListRef } from "../gudang/popup-list";
import type GudangModel from "~/model/gudang";
import { Alert, Button, CloseButton, Dialog, Field, Input, InputGroup, Portal, Textarea, VStack } from "@chakra-ui/react";
import GudangPopupList from "../gudang/popup-list";

type PopupFormHeaderProps = {
  onSubmitted?: (data: any) => void;
  data: any
};

export type PopupFormHeaderRef = {
  open: () => void;
  close: () => void;
};

const PopupFormHeader = forwardRef<PopupFormHeaderRef, PopupFormHeaderProps>(({ onSubmitted, data }, ref) => {
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const [tanggal, setTanggal] = useState<string>("");
  const [gudang, setGudang] = useState<string>("");
  const [catatan, setCatatan] = useState<string>("");
  const gudangPopupListRef = useRef<GudangPopupListRef>(null);

  const gudangPicked = (data: GudangModel) => {
    setGudang(data.gud_id);
  };

  const submit = () => {
    if (!tanggal) {
      setError("Silakan pilih tanggal");
      return;
    }
    if (!gudang) {
      setError("Silakan pilih gudang");
      return;
    }
    if (onSubmitted) onSubmitted({
      tanggal: tanggal,
      gudang: gudang,
      catatan: catatan,
    });
    setOpen(false);
  };

  const gudangPicker = () => {
    return (
      <>
        <Button variant="ghost" size="sm" me={-2} onClick={() => gudangPopupListRef?.current?.open()}>
          Pilih
        </Button>
        <GudangPopupList ref={gudangPopupListRef} onRowDoubleClicked={gudangPicked}/>
      </>
    );
  }

  const alertError = () => {
    if (!error) return "";
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>{error}</Alert.Title>
      </Alert.Root>
    );
  }

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true);
    },
    close: () => {
      setOpen(false);
    }
  }))

  useEffect(() => {
    if (!open) {
      setTanggal("");
      setGudang("");
      setCatatan("");
    } else {
      if (data.tanggal) {
        setTanggal(data.tanggal);
      }
      if (data.gudang) {
        setGudang(data.gudang);
      }
      if (data.catatan) {
        setCatatan(data.catatan);
      }
    }
  }, [open]);

  return (
    <Dialog.Root key="dialog-header" size="md" open={open}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Header</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body paddingBottom={16}>
              <VStack>
                {alertError()}
                <Field.Root required>
                  <Field.Label>
                    Tanggal <Field.RequiredIndicator />
                  </Field.Label>
                  <Input type="date" placeholder="Enter Name" value={tanggal} onChange={(e) => setTanggal(e.target.value)}/>
                </Field.Root>
                <Field.Root required>
                  <Field.Label>
                    Gudang <Field.RequiredIndicator />
                  </Field.Label>
                  <InputGroup endElement={gudangPicker()}>
                    <Input value={gudang} readOnly/>
                  </InputGroup>
                </Field.Root>
                <Field.Root>
                  <Field.Label>
                    Catatan
                  </Field.Label>
                  <Textarea placeholder="Enter Name" value={catatan} onChange={(e) => setCatatan(e.target.value)}/>
                </Field.Root>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Batal</Button>
              </Dialog.ActionTrigger>
              <Button bg="cyan.600" size="sm" onClick={submit}>OK</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={() => setOpen(false)} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});

export default PopupFormHeader;