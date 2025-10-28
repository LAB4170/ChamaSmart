import { Box, BoxProps, keyframes } from "@chakra-ui/react";

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const GlassCard = (props: BoxProps) => (
  <Box
    p={6}
    bg="rgba(255, 255, 255, 0.1)"
    backdropFilter="blur(10px)"
    borderRadius="xl"
    border="1px solid rgba(255, 255, 255, 0.2)"
    transition="all 0.3s ease-in-out"
    _hover={{
      transform: "translateY(-5px)",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
    }}
    {...props}
  />
);

export const FloatingCard = (props: BoxProps) => (
  <Box animation={`${floatAnimation} 3s ease-in-out infinite`} {...props} />
);

export const GradientBorder = (props: BoxProps) => (
  <Box
    position="relative"
    p={0.5}
    borderRadius="xl"
    bg="linear-gradient(45deg, #2196f3, #e91e63)"
    _before={{
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: "xl",
      padding: "2px",
      background: "linear-gradient(45deg, #2196f3, #e91e63)",
      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      maskComposite: "exclude",
    }}
    {...props}
  />
);
