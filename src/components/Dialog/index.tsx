import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";

export interface DialogProps extends ModalProps {
  title?: string;
}

const Dialog = (props: DialogProps) => {
  const { children, title, ...restProps } = props;
  return (
    <Modal {...restProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title || "Dialog"}</ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default Dialog;
