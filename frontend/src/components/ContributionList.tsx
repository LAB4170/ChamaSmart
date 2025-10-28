import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Text,
} from "@chakra-ui/react";

interface Contribution {
  id: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
}

interface ContributionListProps {
  contributions: Contribution[];
}

export const ContributionList: React.FC<ContributionListProps> = ({
  contributions,
}) => {
  const getStatusColor = (status: Contribution["status"]) => {
    switch (status) {
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "yellow";
    }
  };

  if (!contributions.length) {
    return <Text>No contributions found.</Text>;
  }

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th isNumeric>Amount</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {contributions.map((contribution) => (
            <Tr key={contribution.id}>
              <Td>{new Date(contribution.date).toLocaleDateString()}</Td>
              <Td isNumeric>KES {contribution.amount.toLocaleString()}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(contribution.status)}>
                  {contribution.status}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
