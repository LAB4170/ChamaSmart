import React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { Card } from "./Card";
import type { Group } from "../lib/api";

interface GroupCardProps {
  group: Group;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  return (
    <Card>
      <VStack align="stretch" spacing={4}>
        <Box>
          <Heading size="md" mb={2}>
            {group.name}
          </Heading>
          {group.description && (
            <Text color="gray.600" noOfLines={2}>
              {group.description}
            </Text>
          )}
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.600">
            {group.members.length} members
          </Text>
          {group.description && (
            <Badge colorScheme={group.members.length > 0 ? "green" : "yellow"}>
              {group.members.length > 0 ? "Active" : "New"}
            </Badge>
          )}
        </Box>

        <HStack spacing={2}>
          <Button
            colorScheme="brand"
            variant="solid"
            size="sm"
            width="full"
            onClick={() => (window.location.hash = `#/groups/${group.id}`)}
          >
            View Details
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
};
