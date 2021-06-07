import Layout from '../components/Layout'
import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  useColorModeValue,
	useDisclosure
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config';
import { useEffect } from 'react';
import userRoles from '../constants/userRoles';
import { useRouter } from 'next/router';
import ModalComp from '../components/ModalComp'
import EditProfile from '../components/EditProfile'
import EditPassword from '../components/EditPassword'
import { useQuery } from 'react-query';
import { Profile } from '../interfaces';

export default function ProfilePage({ user } : any) {
	const { onOpen, isOpen, onClose } = useDisclosure();
	const { onOpen: onOpenPassword, isOpen: isOpenPassword, onClose: onClosePassword } = useDisclosure();
	const router = useRouter();
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/HomeCashier')
		} else if(userRoles.Admin == user.userRole){
			router.replace('/HomeAdmin')
		}
	}, [user]);
	
	const fetchCart = async () => {
		const res = await fetch(`api/profile/GetUser`);
		return res.json();
	}
	const { data: profile, refetch } = useQuery<Profile>("productTypes", fetchCart);
  return (
		<Layout title="Profile" authentication={user}>
    <Center py={6}>
      <Box
        maxW={'320px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
        textAlign={'center'}>
        <Avatar
          size={'xl'}
          src={profile?.image?.toString() || ""}
          alt={'Avatar Alt'}
          mb={4}
          pos={'relative'}
        />
        <Heading fontSize={'2xl'} fontFamily={'body'}>
          {profile?.name}
        </Heading>
        <Text fontWeight={600} color={'gray.500'} mb={4}>
					{profile?.username}<br/>
					{profile?.email}
        </Text>
          	Address: {profile?.address || "N/A"}
					<p>
						Gender: {profile?.gender || "N/A"}
					</p>
					<p>
						Mobile Number: {profile?.mobileNumber || "N/A"}
					</p>
					<p>
						TIN: {profile?.tin || "N/A"}
					</p>

        <Stack mt={8} direction={'row'} spacing={4}>
          <Button
            flex={1}
            fontSize={'sm'}
            rounded={'full'}
            _focus={{
              bg: 'gray.200',
            }}
						onClick={onOpenPassword}
						>
            Edit Password
          </Button>
          <Button
            flex={1}
            fontSize={'sm'}
            rounded={'full'}
            bg={'blue.400'}
            color={'white'}
            boxShadow={
              '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
            }
            _hover={{
              bg: 'blue.500',
            }}
            _focus={{
              bg: 'blue.500',
            }}
						onClick={onOpen}
						>
            Edit Profile
          </Button>
        </Stack>
      </Box>
    </Center>
		
			<ModalComp isModalOpen={isOpen} onModalClose={onClose} title="">
				<EditProfile modalClose={onClose} refresh={refetch} defaultValues={profile} id={user.id}/>
			</ModalComp>

			<ModalComp isModalOpen={isOpenPassword} onModalClose={onClosePassword} title="">
				<EditPassword modalClose={onClose} id={user.id}/>
			</ModalComp>
		</Layout>
  );
}

ProfilePage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	return {user: json};
}