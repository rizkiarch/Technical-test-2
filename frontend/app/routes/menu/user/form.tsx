import { Alert, Box, Button, Field, HStack, Input, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import apiClient from "~/api/axios";
import { PasswordInput } from "~/components/ui/password-input";
import { toaster } from "~/components/ui/toaster";
import type UserModel from "~/model/user";

type UserFormProps = {
  mode: "create" | "edit";
  data?: UserModel,
  onSubmitted?: () => void
}

export default function UserForm({ mode, data, onSubmitted }: UserFormProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const submit = async () => {
    setError("");
    if (!username) {
      setError("Silakan isi username");
      return
    }
    if (!password) {
      setError("Silakan isi password");
      return
    }
    if (!passwordConfirmation) {
      setError("Silakan isi konfirmasi password");
      return
    }
    if (password != passwordConfirmation) {
      setError("Password tidak sama");
      return
    }
    try {
      setIsLoading(true);
      const response = await apiClient(true).post("/v1/user", {
        usr_nama: username,
        usr_pswd: password,
        usr_pswd_confirmation: passwordConfirmation
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
    if (data?.usr_nama) {
      setUsername(data?.usr_nama);
    }
  }, []);

  return (
    <Box>
      {alertError()}
      <VStack>
        <Field.Root required>
          <Field.Label>
            Username <Field.RequiredIndicator />
          </Field.Label>
          <Input placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </Field.Root>
        <Field.Root required>
          <Field.Label>
            Password <Field.RequiredIndicator />
          </Field.Label>
          <PasswordInput placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </Field.Root>
        <Field.Root required>
          <Field.Label>
            Konfirmasi Password <Field.RequiredIndicator />
          </Field.Label>
          <PasswordInput placeholder="Enter password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}/>
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
