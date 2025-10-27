import React from "react";
import { api_login } from "../lib/mockApi";

const Login: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api_login(email);
      window.location.hash = "#/dashboard";
      window.location.reload(); // Refresh to update header/sidebar state
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

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
