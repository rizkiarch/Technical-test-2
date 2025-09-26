import { useAuth } from "~/context/auth-context";
import type { Route } from "./+types/home";
import { Flex, Spinner } from "@chakra-ui/react";
import { Navigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MiniERP" },
    { name: "description", content: "" },
  ];
}

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isAuthenticated) return <Navigate to="/menu"/>;

  if (!isAuthenticated) return <Navigate to="/login"/>;
}
