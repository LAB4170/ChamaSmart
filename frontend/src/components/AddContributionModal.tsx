import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contributionSchema, type ContributionInput } from "../lib/validations";

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (amount: number) => void;
  isAdding: boolean;
}

export const AddContributionModal: React.FC<AddContributionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  isAdding,
}) => {
  const methods = useForm<ContributionInput>({
    resolver: zodResolver(contributionSchema),
  });

  const onSubmit = (data: ContributionInput) => {
    onAdd(data.amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Contribution</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Amount</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      placeholder="Enter amount"
                      {...methods.register("amount", { valueAsNumber: true })}
                    />
                  </NumberInput>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="brand"
                  width="full"
                  isLoading={isAdding}
                >
                  Add Contribution
                </Button>
              </VStack>
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
