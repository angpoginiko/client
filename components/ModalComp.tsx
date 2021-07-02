import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"

interface ModalCompProps {
	children: React.ReactNode,
	isModalOpen: boolean;
	onModalClose: () => void;
	title: string; 
}

export default function ModalComp({children, isModalOpen, onModalClose, title} : ModalCompProps) {
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
						{children}
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}