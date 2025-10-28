import React from "react";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "../lib/api";
import { Card } from "./Card";
import { addMember, removeMemberFromGroup } from "../lib/api";
import { AddMemberModal } from "./AddMemberModal";

interface MemberListProps {
  members: User[];
  groupId: string;
}

export const MemberList: React.FC<MemberListProps> = ({ members, groupId }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isAddingMember, setIsAddingMember] = React.useState(false);

  const addMemberMutation = useMutation({
    mutationFn: (email: string) => addMember(groupId, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-members", groupId] });
      toast({
        title: "Member added",
        status: "success",
        duration: 3000,
      });
      setIsAddingMember(false);
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

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) =>
      removeMemberFromGroup({ groupId, memberId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-members", groupId] });
      toast({
        title: "Member removed",
        status: "success",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove member",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    },
  });

  return (
    <>
      <Box mb={4}>
        <Button
          colorScheme="brand"
          size="sm"
          onClick={() => setIsAddingMember(true)}
        >
          Add Member
        </Button>
      </Box>

      <VStack spacing={4} align="stretch">
        {members.map((member) => (
          <Card key={member.id}>
            <HStack spacing={4}>
              <Avatar name={member.name} size="sm" />
              <Box flex={1}>
                <Text fontWeight="bold">{member.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  {member.email}
                </Text>
              </Box>
              <Button
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => removeMemberMutation.mutate(member.id)}
                isLoading={removeMemberMutation.isPending}
              >
                Remove
              </Button>
            </HStack>
          </Card>
        ))}
        {members.length === 0 && <Text color="gray.600">No members yet</Text>}
      </VStack>

      <AddMemberModal
        isOpen={isAddingMember}
        onClose={() => setIsAddingMember(false)}
        onAdd={(email) => addMemberMutation.mutate(email)}
        isAdding={addMemberMutation.isPending}
      />
    </>
  );
};
