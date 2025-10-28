import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { FiPlus, FiUsers } from "react-icons/fi";
import { GlassCard, FloatingCard } from "../components/StyledComponents";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getGroups, createGroup } from "../lib/api";
import { Card } from "../components/Card";
import { GroupCard } from "../components/GroupCard";
import { CreateGroupModal } from "../components/CreateGroupModal";

const Groups: React.FC = () => {
  const toast = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  const createMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      toast({
        title: "Group created",
        status: "success",
        duration: 3000,
      });
      setIsCreateModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create group",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    },
  });

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading groups...</Text>
      </Container>
    );
  }

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, blue.900, purple.900)"
      pt={8}
    >
      <Container maxW="container.xl" py={8}>
        <Box mb={8}>
          <VStack align="stretch" spacing={6}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bg="rgba(255, 255, 255, 0.1)"
              p={6}
              borderRadius="xl"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255, 255, 255, 0.2)"
              mb={4}
            >
              <Heading size="lg" color="white">My Groups</Heading>
              <Button
                variant="glass"
                leftIcon={<Icon as={FiPlus} />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create New Group
              </Button>
            </Box>

            {groups.length === 0 ? (
              <GlassCard>
                <VStack py={12} spacing={6}>
                  <FloatingCard>
                    <Icon as={FiUsers} boxSize={12} color="white" opacity={0.8} />
                  </FloatingCard>
                  <Text color="white" fontSize="lg">You haven't joined any groups yet.</Text>
                  <Button
                    variant="glass"
                    size="lg"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Create Your First Group
                  </Button>
                </VStack>
              </GlassCard>
            ) : (
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={6}
              >
                {groups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </Grid>
            )}
          </VStack>
        </Box>

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(data) => createMutation.mutate(data)}
        isCreating={createMutation.isPending}
      />
    </Container>
  );
};

export default Groups;
