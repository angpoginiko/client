import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
	useDisclosure,
	Button,
} from "@chakra-ui/react"

interface ModalCompProps {
	children: React.ReactNode,
	isModalOpen: boolean;
	onModalClose: () => void;
}

export default function ModalComp({children, isModalOpen, onModalClose} : ModalCompProps) {
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
					{children}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}