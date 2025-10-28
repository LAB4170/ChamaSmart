import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        background: "linear-gradient(135deg, #1a365d 0%, #2a4365 100%)",
        color: "gray.50",
      },
    },
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "xl",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          transition: "all 0.3s ease-in-out",
          _hover: {
            transform: "translateY(-5px)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
    Button: {
      variants: {
        glass: {
          bg: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "white",
          _hover: {
            bg: "rgba(255, 255, 255, 0.2)",
            transform: "translateY(-2px)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
          },
          _active: {
            transform: "translateY(0)",
          },
        },
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
            transform: "translateY(-2px)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
          },
          _active: {
            transform: "translateY(0)",
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: "rgba(26, 32, 44, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        },
      },
    },
  },
  colors: {
    brand: {
      50: "#e3f2fd",
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#2196f3",
      600: "#1e88e5",
      700: "#1976d2",
      800: "#1565c0",
      900: "#0d47a1",
    },
  },
});

export default theme;
