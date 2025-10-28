import React from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "../lib/api";
import { loginSchema, type LoginInput } from "../lib/validations";
import { Card } from "../components/Card";
import { FormInput } from "../components/FormInput";

const Login: React.FC = () => {
  const toast = useToast();
  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: ({ email, password }: LoginInput) => login(email, password),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      window.location.hash = "#/dashboard";
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description:
          error.message || "Please check your credentials and try again",
        status: "error",
        duration: 5000,
      });
    },
  });

  const onSubmit = (data: LoginInput) => {
    mutation.mutate(data);
  };

  // Removed handleSubmit since we're using react-hook-form's onSubmit

  return (
    <Container maxW="md" py={12}>
      <Card>
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading size="lg">Welcome to ChamaSmart</Heading>
            <Text color="gray.600" mt={2}>
              Sign in to continue
            </Text>
          </Box>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormInput
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                />
                <FormInput
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                />
                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  width="full"
                  isLoading={mutation.isPending}
                >
                  Sign In
                </Button>
              </VStack>
            </form>
          </FormProvider>

          <Text textAlign="center">
            Don't have an account?{" "}
            <Button
              variant="link"
              colorScheme="brand"
              onClick={() => (window.location.hash = "#/signup")}
            >
              Sign up
            </Button>
          </Text>
        </VStack>
      </Card>
    </Container>
  );
};

export default Login;
