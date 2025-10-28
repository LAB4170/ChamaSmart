import React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FiUsers, FiArrowRight } from "react-icons/fi";
import { GlassCard } from "./StyledComponents";
import type { Group } from "../lib/api";

interface GroupCardProps {
  group: Group;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  return (
    <GlassCard
      role="group"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px) scale(1.02)",
        boxShadow: "xl",
      }}
    >
      <VStack align="stretch" spacing={4}>
        <Box>
          <Heading size="md" mb={2} color="white">
            {group.name}
          </Heading>
          {group.description && (
            <Text color="whiteAlpha.800" noOfLines={2}>
              {group.description}
            </Text>
          )}
        </Box>

        <HStack spacing={3}>
          <Icon as={FiUsers} color="white" />
          <Text fontSize="sm" color="whiteAlpha.900">
            {group.members.length} members
          </Text>
          <Badge
            variant="solid"
            colorScheme={group.members.length > 0 ? "green" : "yellow"}
            borderRadius="full"
            px={3}
          >
            {group.members.length > 0 ? "Active" : "New"}
          </Badge>
        </HStack>

        <Button
          variant="glass"
          size="md"
          width="full"
          onClick={() => (window.location.hash = `#/groups/${group.id}`)}
          rightIcon={<Icon as={FiArrowRight} />}
          _groupHover={{
            bg: "rgba(255, 255, 255, 0.2)",
          }}
        >
          View Details
        </Button>
      </VStack>
    </GlassCard>
  );
};
