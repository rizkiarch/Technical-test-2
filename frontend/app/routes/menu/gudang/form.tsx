import { Alert, Box, Button, Field, HStack, Input, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import apiClient from "~/api/axios";
import { PasswordInput } from "~/components/ui/password-input";
import { toaster } from "~/components/ui/toaster";
import type GudangModel from "~/model/gudang";

type GudangFormProps = {
  mode: "create" | "edit";
  data?: GudangModel,
  onSubmitted?: () => void
}

export default function GudangForm({ mode, data, onSubmitted }: GudangFormProps) {
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const submit = async () => {
    setError("");
    if (!name) {
      setError("Silakan isi nama gudang");
      return
    }
    try {
      setIsLoading(true);
      const response = await apiClient(true).post("/v1/gudang", {
        gud_nama: name,
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
    if (data?.gud_nama) {
      setName(data?.gud_nama);
    }
  }, []);

  return (
    <Box>
      {alertError()}
      <VStack>
        <Field.Root required>
          <Field.Label>
            Nama Gudang <Field.RequiredIndicator />
          </Field.Label>
          <Input placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)}/>
        </Field.Root>
        <HStack justify="end" width="full" paddingY={2}>
          <Button bg="cyan.600" size="sm" onClick={submit} loading={isLoading} disabled={mode != "create"}>
            {mode == "create" ? "Simpan" : "Edit"}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
