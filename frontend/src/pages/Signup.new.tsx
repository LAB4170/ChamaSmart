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
import { signup } from "../lib/api";
import { signupSchema, type SignupInput } from "../lib/validations";
import { FormInput } from "../components/FormInput";
import { Card } from "../components/Card";

const Signup: React.FC = () => {
  const toast = useToast();
  const methods = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast({
        title: "Account created",
        description: "Please sign in with your new account",
        status: "success",
        duration: 5000,
      });
      window.location.hash = "#/login";
    },
    onError: (error: Error) => {
      toast({
        title: "Signup failed",
        description: error.message || "Please check your details and try again",
        status: "error",
        duration: 5000,
      });
    },
  });

  const onSubmit = (data: SignupInput) => {
    mutation.mutate(data);
  };

  return (
    <Container maxW="md" py={12}>
      <Card>
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading size="lg">Create Account</Heading>
            <Text color="gray.600" mt={2}>
              Join ChamaSmart today
            </Text>
          </Box>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormInput
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                />
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
                  placeholder="Create a password"
                />
                <FormInput
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                />
                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  width="full"
                  isLoading={mutation.isPending}
                >
                  Create Account
                </Button>
              </VStack>
            </form>
          </FormProvider>

          <Text textAlign="center">
            Already have an account?{" "}
            <Button
              variant="link"
              colorScheme="brand"
              onClick={() => (window.location.hash = "#/login")}
            >
              Sign in
            </Button>
          </Text>
        </VStack>
      </Card>
    </Container>
  );
};

export default Signup;
