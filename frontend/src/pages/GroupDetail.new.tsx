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
  HStack,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGroup,
  getMembers,
  getContributions,
  addContribution,
  addMember,
  leaveGroup,
  deleteGroup,
  getProfile,
  type Contribution,
  type User,
} from "../lib/api";
import { Card } from "../components/Card";
import { MemberList } from "../components/MemberList";
import { ContributionList } from "../components/ContributionList";
import { AddContributionModal } from "../components/AddContributionModal";

const GroupDetail: React.FC = () => {
  const toast = useToast();
  const [isAddingContribution, setIsAddingContribution] = React.useState(false);
  const [isLeavingGroup, setIsLeavingGroup] = React.useState(false);
  const [isDeletingGroup, setIsDeletingGroup] = React.useState(false);

  // Get current user profile
  const { data: currentUser } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

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

  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({
        queryKey: ["group-contributions", groupId],
      });
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

  const addMemberMutation = useMutation({
    mutationFn: (email: string) => addMember(groupId, email),
    onSuccess: (newMember: User) => {
      toast({
        title: "Member added",
        description: `${newMember.name} has been added to the group`,
        status: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["group-members", groupId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add member",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    },
  });

  const leaveGroupMutation = useMutation({
    mutationFn: () => leaveGroup(groupId),
    onSuccess: () => {
      toast({
        title: "Left group",
        status: "success",
        duration: 3000,
      });
      window.location.hash = "#/groups";
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to leave group",
        description: error.message,
        status: "error",
        duration: 5000,
      });
      setIsLeavingGroup(false);
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: () => deleteGroup(groupId),
    onSuccess: () => {
      toast({
        title: "Group deleted",
        status: "success",
        duration: 3000,
      });
      window.location.hash = "#/groups";
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete group",
        description: error.message,
        status: "error",
        duration: 5000,
      });
      setIsDeletingGroup(false);
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
          <HStack>
            <Button
              colorScheme="brand"
              onClick={() => setIsAddingContribution(true)}
            >
              Add Contribution
            </Button>
            {currentUser?.id === group.adminId ? (
              <Button
                colorScheme="red"
                variant="outline"
                onClick={() => setIsDeletingGroup(true)}
                isLoading={deleteGroupMutation.isPending}
              >
                Delete Group
              </Button>
            ) : (
              <Button
                colorScheme="red"
                variant="outline"
                onClick={() => setIsLeavingGroup(true)}
                isLoading={leaveGroupMutation.isPending}
              >
                Leave Group
              </Button>
            )}
          </HStack>
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
                groupId={groupId}
                isAdmin={currentUser?.id === group.adminId}
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

      {/* Leave Group Dialog */}
      <AlertDialog
        isOpen={isLeavingGroup}
        leastDestructiveRef={React.useRef(null)}
        onClose={() => setIsLeavingGroup(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Leave Group?</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to leave this group? You will need to be
              re-added by an admin to join again.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={React.useRef(null)}
                onClick={() => setIsLeavingGroup(false)}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => leaveGroupMutation.mutate()}
                isLoading={leaveGroupMutation.isPending}
                ml={3}
              >
                Leave Group
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Delete Group Dialog */}
      <AlertDialog
        isOpen={isDeletingGroup}
        leastDestructiveRef={React.useRef(null)}
        onClose={() => setIsDeletingGroup(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Group?</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this group? This action cannot be
              undone and all group data will be permanently deleted.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={React.useRef(null)}
                onClick={() => setIsDeletingGroup(false)}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => deleteGroupMutation.mutate()}
                isLoading={deleteGroupMutation.isPending}
                ml={3}
              >
                Delete Group
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default GroupDetail;
