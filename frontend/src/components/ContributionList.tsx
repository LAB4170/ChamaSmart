import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Button,
  HStack,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContributionStatus } from "../lib/api";
import type { Contribution, User } from "../lib/api";

interface ContributionListProps {
  contributions: Contribution[];
  members?: User[];
  groupId: string;
  isAdmin?: boolean;
}

export const ContributionList: React.FC<ContributionListProps> = ({
  contributions,
  members = [],
  groupId,
  isAdmin = false,
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({
      contributionId,
      status,
    }: {
      contributionId: string;
      status: "approved" | "rejected";
    }) => updateContributionStatus({ groupId, contributionId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-contributions", groupId],
      });
      toast({
        title: "Status updated",
        status: "success",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    },
  });
  if (!contributions.length) {
    return <Text>No contributions found.</Text>;
  }

  const findMemberName = (memberId: string) =>
    members.find((m) => m.id === memberId)?.name || "—";

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Member</Th>
            <Th isNumeric>Amount</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            {isAdmin && <Th>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {contributions.map((contribution) => (
            <Tr key={contribution.id}>
              <Td>{new Date(contribution.date).toLocaleDateString()}</Td>
              <Td>{findMemberName(contribution.memberId)}</Td>
              <Td isNumeric>KES {contribution.amount.toLocaleString()}</Td>
              <Td>{contribution.type}</Td>
              <Td>
                <Badge
                  colorScheme={
                    contribution.status === "approved"
                      ? "green"
                      : contribution.status === "rejected"
                      ? "red"
                      : "yellow"
                  }
                >
                  {contribution.status}
                </Badge>
              </Td>
              {isAdmin && contribution.status === "pending" && (
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() =>
                        updateStatusMutation.mutate({
                          contributionId: contribution.id,
                          status: "approved",
                        })
                      }
                      isLoading={updateStatusMutation.isPending}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={() =>
                        updateStatusMutation.mutate({
                          contributionId: contribution.id,
                          status: "rejected",
                        })
                      }
                      isLoading={updateStatusMutation.isPending}
                    >
                      Reject
                    </Button>
                  </HStack>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
