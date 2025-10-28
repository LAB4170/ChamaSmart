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
import { groupSchema, type GroupInput } from "../lib/validations";
import { FormInput } from "./FormInput";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: GroupInput) => void;
  isCreating: boolean;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  isCreating,
}) => {
  const methods = useForm<GroupInput>({
    resolver: zodResolver(groupSchema),
  });

  const onSubmit = (data: GroupInput) => {
    onCreate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormInput
                  name="name"
                  label="Group Name"
                  placeholder="Enter group name"
                />
                <FormInput
                  name="description"
                  label="Description (Optional)"
                  placeholder="Enter group description"
                />
                <Button
                  type="submit"
                  colorScheme="brand"
                  width="full"
                  isLoading={isCreating}
                >
                  Create Group
                </Button>
              </VStack>
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
