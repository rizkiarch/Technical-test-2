import { Alert, Box, Button, Flex, Heading, Input, Spinner, VStack } from "@chakra-ui/react";
import type { Route } from "./+types/login";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "~/context/auth-context";
import { PasswordInput } from "~/components/ui/password-input";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MiniERP" },
    { name: "description", content: "" },
  ];
}

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>();
  const { isAuthenticated, login, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isAuthenticated) return <Navigate to="/menu" />;

  const handleSubmit = async () => {
    setError("");
    try {
      await login(username, password);
      navigate("/menu");
    } catch (error: any) {
      console.error(error);
      setError(error?.message || "Internal server error");
    }
  };

  const alertError = () => {
    if (!error) return "";
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>{error}</Alert.Title>
      </Alert.Root>
    )
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minH="100vh">
      <VStack padding={8} borderWidth="1px" borderRadius="lg" shadow="lg" width={{ "base": "full", "sm": 450 }}>
        <Heading size="lg" marginBottom={4}>Login</Heading>
        {alertError()}
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <PasswordInput placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></PasswordInput>
        <Button bg="cyan.600" onClick={handleSubmit} w="full" marginTop={4}>
          Login
        </Button>
      </VStack>
    </Box>
  );
}
