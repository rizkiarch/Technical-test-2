import { Alert, Box, Button, Checkbox, Field, HStack, Input, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import apiClient from "~/api/axios";
import { PasswordInput } from "~/components/ui/password-input";
import { toaster } from "~/components/ui/toaster";
import type CustomerModel from "~/model/customer";

type CustomerFormProps = {
  mode: "create" | "edit";
  data?: CustomerModel,
  onSubmitted?: () => void
}

export default function CustomerForm({ mode, data, onSubmitted }: CustomerFormProps) {
  const [name, setName] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [member, setMember] = useState<string>("N");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const submit = async () => {
    setError("");
    if (!name) {
      setError("Silakan isi nama customer");
      return
    }
    try {
      setIsLoading(true);
      const response = await apiClient(true).post("/v1/customer", {
        cus_nama: name,
        cus_kota: city,
        cus_is_member: member
      });
      const responseData = response.data;
      if (!responseData.status) {
        setError(responseData.message);
      } else {
        toaster.success({ description: "Proses selesai" });
        if (onSubmitted) onSubmitted();
      }
    } catch (error: any) {
      console.error(error);
      if (error?.status >= 400 || error?.status < 500) {
        setError(error?.response?.data?.message || "Internal server error");
      } else if (error?.status >= 500) {
        setError('Internal server error');
      } else {
        setError('Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const alertError = () => {
    if (!error) return;
    return (
      <Alert.Root marginY={2} status="error">
        <Alert.Indicator />
        <Alert.Title>{error}</Alert.Title>
      </Alert.Root>
    )
  }

  useEffect(() => {
    if (data?.cus_nama) {
      setName(data?.cus_nama);
    }
    if (data?.cus_kota) {
      setCity(data?.cus_kota);
    }
    if (data?.cus_is_member) {
      setMember(data?.cus_is_member);
    }
  }, []);

  return (
    <Box>
      {alertError()}
      <VStack justify="start" align="start">
        <Field.Root required>
          <Field.Label>
            Nama Customer <Field.RequiredIndicator />
          </Field.Label>
          <Input placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)}/>
        </Field.Root>
        <Field.Root required>
          <Field.Label>
            Kota
          </Field.Label>
          <Input placeholder="Enter City" value={city} onChange={(e) => setCity(e.target.value)}/>
        </Field.Root>
        <Checkbox.Root marginY={2} onCheckedChange={(event: any) => setMember(event.checked ? "Y" : "N")} checked={member == "Y"}>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Member</Checkbox.Label>
        </Checkbox.Root>
        <HStack justify="end" width="full" paddingY={2}>
          <Button bg="cyan.600" size="sm" onClick={submit} loading={isLoading} disabled={mode != "create"}>
            {mode == "create" ? "Simpan" : "Edit"}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
