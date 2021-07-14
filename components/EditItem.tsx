import { EditType } from "../interfaces";
import {
  Tr,
  Td,
	Link,
	useDisclosure
} from "@chakra-ui/react"
import ModalComp from './ModalComp'
import EditPassword from "./EditPassword";

interface PurchaseItemProps {
	item: EditType;
}

export default function EditItem({ item } : PurchaseItemProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();
  return (
	<>
		<Tr>
			<Td>
				<Link onClick={onOpen}>
					{item.name}
				</Link>
			</Td>
		</Tr>
		<ModalComp isModalOpen={isOpen} onModalClose={onClose} title="">
			<EditPassword modalClose={onClose} id={item._id}/>
		</ModalComp>
		</>
  );
}