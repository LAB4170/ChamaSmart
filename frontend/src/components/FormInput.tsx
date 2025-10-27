import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

interface FormInputProps extends InputProps {
  name: string;
  label: string;
}

export const FormInput = ({ name, label, ...props }: FormInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string;

  return (
    <FormControl isInvalid={!!error} mb={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input id={name} {...register(name)} {...props} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
