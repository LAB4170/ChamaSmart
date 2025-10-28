import React from "react";
import {
  Box,
  Container,
  Grid,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getGroups, getProfile } from "../lib/api";
import { Card } from "../components/Card";
import { GroupCard } from "../components/GroupCard";

const Dashboard: React.FC = () => {
  const toast = useToast();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    onError: (error: Error) => {
      toast({
        title: "Failed to load profile",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    },
  });

  const { data: groups = [], isLoading: loadingGroups } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
    onError: (error: Error) => {
      toast({
        title: "Failed to load groups",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    },
  });

  if (loadingUser || loadingGroups) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading dashboard...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Welcome back, {user?.name}!
          </Heading>
          <Text color="gray.600">
            Here's an overview of your groups and activities
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card>
            <Stat>
              <StatLabel>Active Groups</StatLabel>
              <StatNumber>{groups.length}</StatNumber>
            </Stat>
          </Card>
          <Card>
            <Stat>
              <StatLabel>Total Contributions</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
          </Card>
          <Card>
            <Stat>
              <StatLabel>Next Meeting</StatLabel>
              <StatNumber>-</StatNumber>
            </Stat>
          </Card>
        </SimpleGrid>

        <Box>
          <Heading size="md" mb={4}>
            Recent Groups
          </Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {groups.slice(0, 3).map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
            {groups.length === 0 && (
              <Card>
                <Text color="gray.600">No groups joined yet</Text>
              </Card>
            )}
          </Grid>
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Recent Activity
          </Heading>
          <Card>
            <Text color="gray.600">No recent activity</Text>
          </Card>
        </Box>
      </VStack>
    </Container>
  );
};

export default Dashboard;
