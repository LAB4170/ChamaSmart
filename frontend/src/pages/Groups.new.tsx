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
} from "@chakra-ui/react";
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
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <VStack align="stretch" spacing={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading size="lg">My Groups</Heading>
            <Button
              colorScheme="brand"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create New Group
            </Button>
          </Box>

          {groups.length === 0 ? (
            <Card>
              <VStack py={8} spacing={4}>
                <Text>You haven't joined any groups yet.</Text>
                <Button
                  colorScheme="brand"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create Your First Group
                </Button>
              </VStack>
            </Card>
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
