import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import { Profile } from '../interfaces/index'
import {
  Box,
  FormControl,
  FormLabel,
  Stack,
  Button,
  Heading,
  useColorModeValue,
	FormErrorMessage,
	useDisclosure,
} from '@chakra-ui/react';
import ModalComp from './ModalComp';

interface EditProfileImageProps {
	modalClose: () => void;
	refresh: () => void;
	id: string;
}

export default function EditProfileImagePage({ modalClose, refresh, id } : EditProfileImageProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const { register, handleSubmit, errors } = useForm();
	const [image, setImage] = useState<string | ArrayBuffer | null>("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")
	
	const onSubmit = async (formData: Profile) => {
		const changedImage = formData.image;
    const reader = new FileReader();
		let newImage : string | ArrayBuffer | null = '';
     reader.onload = async () =>{
      if(reader.readyState === 2){
        newImage = reader.result;
				const response = await fetch("/api/profile/EditImage", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					},
					body: JSON.stringify({image: newImage, id}),
				});
				await response.json();
				onOpen();
      }
    }
    reader.readAsDataURL(changedImage![0] as Blob);
	}

	const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () =>{
      if(reader.readyState === 2){
        setImage(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0])
  };

	return(
		<>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Edit Profile</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
						<FormControl id="image" isInvalid={errors.image && errors.image.type === "required"}>
              <FormLabel>Image </FormLabel>
							<img src={image?.toString()} alt="" id="img" className="img" />
              <input type="file" name="image" ref={register({required:true})} onChange={imageHandler} accept="image/*"/>
							<FormErrorMessage>Product Image is Required</FormErrorMessage>
            </FormControl>

            <Stack spacing={10}>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
								type="submit"
								>
                Save
              </Button>
            </Stack>
          </Stack>
				</form>	
        </Box>
      </Stack>
			<ModalComp isModalOpen={isOpen} onModalClose={() => {onClose(), modalClose(), refresh()}} title="Add Cashier">
				Profile Picture Edited
			</ModalComp>
		</>
	);
}