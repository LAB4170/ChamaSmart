import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getGroup,
  getMembers,
  getContributions,
  addContribution,
  type Contribution,
} from "../lib/api";
import { Card } from "../components/Card";
import { MemberList } from "../components/MemberList";
import { ContributionList } from "../components/ContributionList";
import { AddContributionModal } from "../components/AddContributionModal";

const GroupDetail: React.FC = () => {
  const toast = useToast();
  const [isAddingContribution, setIsAddingContribution] = React.useState(false);

  // Get group ID from URL hash
  const groupId = window.location.hash.split("/").pop() || "";

  const { data: group, isLoading: loadingGroup } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroup(groupId),
    enabled: !!groupId,
  });

  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ["group-members", groupId],
    queryFn: () => getMembers(groupId),
    enabled: !!groupId,
  });

  const { data: contributions = [], isLoading: loadingContributions } =
    useQuery({
      queryKey: ["group-contributions", groupId],
      queryFn: () => getContributions(groupId),
      enabled: !!groupId,
    });

  const contributionMutation = useMutation({
    mutationFn: (data: { amount: number; date: string }) =>
      addContribution(groupId, data),
    onSuccess: () => {
      toast({
        title: "Contribution added",
        status: "success",
        duration: 3000,
      });
      setIsAddingContribution(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add contribution",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    },
  });

  if (loadingGroup || loadingMembers || loadingContributions) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading group details...</Text>
      </Container>
    );
  }

  if (!group) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Group not found</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Heading size="lg">{group.name}</Heading>
            {group.description && (
              <Text color="gray.600" mt={2}>
                {group.description}
              </Text>
            )}
          </Box>
          <Button
            colorScheme="brand"
            onClick={() => setIsAddingContribution(true)}
          >
            Add Contribution
          </Button>
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          <Card>
            <VStack align="start">
              <Text fontWeight="bold">Members</Text>
              <Text fontSize="2xl">{members.length}</Text>
            </VStack>
          </Card>
          <Card>
            <VStack align="start">
              <Text fontWeight="bold">Total Contributions</Text>
              <Text fontSize="2xl">
                {contributions.reduce((sum, c) => sum + c.amount, 0)}
              </Text>
            </VStack>
          </Card>
          <Card>
            <VStack align="start">
              <Text fontWeight="bold">Next Meeting</Text>
              <Text fontSize="2xl">-</Text>
            </VStack>
          </Card>
        </Grid>

        <Tabs>
          <TabList>
            <Tab>Members</Tab>
            <Tab>Contributions</Tab>
            <Tab>Meetings</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <MemberList members={members} groupId={group.id} />
            </TabPanel>
            <TabPanel>
              <ContributionList
                contributions={contributions}
                members={members}
              />
            </TabPanel>
            <TabPanel>
              <Card>
                <Text color="gray.600">No meetings scheduled</Text>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      <AddContributionModal
        isOpen={isAddingContribution}
        onClose={() => setIsAddingContribution(false)}
        onAdd={(data) => contributionMutation.mutate(data)}
        isAdding={contributionMutation.isPending}
      />
    </Container>
  );
};

export default GroupDetail;
