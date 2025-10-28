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
import { addMember } from "../lib/api";
import { AddMemberModal } from "./AddMemberModal";

interface MemberListProps {
  members: User[];
  groupId: string;
}

export const MemberList: React.FC<MemberListProps> = ({ members, groupId }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isAddingMember, setIsAddingMember] = React.useState(false);

  const mutation = useMutation({
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
            </HStack>
          </Card>
        ))}
        {members.length === 0 && <Text color="gray.600">No members yet</Text>}
      </VStack>

      <AddMemberModal
        isOpen={isAddingMember}
        onClose={() => setIsAddingMember(false)}
        onAdd={(email) => mutation.mutate(email)}
        isAdding={mutation.isPending}
      />
    </>
  );
};
