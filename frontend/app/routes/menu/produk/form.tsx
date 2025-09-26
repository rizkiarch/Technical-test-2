import { Alert, Box, Button, Field, HStack, Input, NumberInput, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import apiClient from "~/api/axios";
import { PasswordInput } from "~/components/ui/password-input";
import { toaster } from "~/components/ui/toaster";
import type ProdukModel from "~/model/produk";

type ProdukFormProps = {
  mode: "create" | "edit";
  data?: ProdukModel,
  onSubmitted?: () => void
}

export default function ProdukForm({ mode, data, onSubmitted }: ProdukFormProps) {
  const [name, setName] = useState<string>("");
  const [defPrice, setDefPrice] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [minOrder, setMinOrder] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const submit = async () => {
    setError("");
    if (!name) {
      setError("Silakan isi nama produk");
      return
    }
    if (!defPrice) {
      setError("Silakan isi harga default");
      return
    }
    if (!minPrice && minPrice !== 0) {
      setError("Silakan isi harga minimum");
      return
    }
    if (!minOrder && minOrder !== 0) {
      setError("Silakan isi minimum order");
      return
    }
    try {
      setIsLoading(true);
      const response = await apiClient(true).post("/v1/produk", {
        prd_nama: name,
        prd_hargadef: defPrice,
        prd_hargamin: minPrice,
        prd_min_pesanan: minOrder
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
    if (data?.prd_nama) {
      setName(data?.prd_nama);
    }
    if (data?.prd_hargadef) {
      setDefPrice(data?.prd_hargadef);
    }
    if (data?.prd_hargamin) {
      setMinPrice(data?.prd_hargamin);
    }
    if (data?.prd_min_pesanan) {
      setMinOrder(data?.prd_min_pesanan);
    }
  }, []);

  return (
    <Box>
      {alertError()}
      <VStack>
        <Field.Root required>
          <Field.Label>
            Nama Produk <Field.RequiredIndicator />
          </Field.Label>
          <Input placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)}/>
        </Field.Root>
        <Field.Root required>
          <Field.Label>
            Harga Default <Field.RequiredIndicator />
          </Field.Label>
          <NumberInput.Root width="full" value={defPrice ? defPrice.toString() : "0"} defaultValue="0">
            <NumberInput.Input placeholder="Enter Price" onChange={(e) => setDefPrice(parseFloat(e.target.value))}/>
          </NumberInput.Root>
        </Field.Root>
        <Field.Root required>
          <Field.Label>
            Harga Minimum <Field.RequiredIndicator />
          </Field.Label>
          <NumberInput.Root width="full" value={minPrice ? minPrice.toString() : "0"} defaultValue="0">
            <NumberInput.Input placeholder="Enter Price" onChange={(e) => setMinPrice(parseFloat(e.target.value))}/>
          </NumberInput.Root>
        </Field.Root>
        <Field.Root required>
          <Field.Label>
            Minimum Pesanan <Field.RequiredIndicator />
          </Field.Label>
          <NumberInput.Root width="full" value={minOrder ? minOrder.toString() : "0"} defaultValue="0">
            <NumberInput.Input placeholder="Enter Qty" onChange={(e) => setMinOrder(parseFloat(e.target.value))}/>
          </NumberInput.Root>
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
