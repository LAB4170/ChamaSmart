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
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberSchema, type MemberInput } from "../lib/validations";
import { FormInput } from "./FormInput";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (email: string) => void;
  isAdding: boolean;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  isAdding,
}) => {
  const methods = useForm<MemberInput>({
    resolver: zodResolver(memberSchema),
  });

  const onSubmit = (data: MemberInput) => {
    onAdd(data.email);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Member</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormInput
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter member's email"
                />
                <Button
                  type="submit"
                  colorScheme="brand"
                  width="full"
                  isLoading={isAdding}
                >
                  Add Member
                </Button>
              </VStack>
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
