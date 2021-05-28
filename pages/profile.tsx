import Layout from '../components/Layout'
import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Link,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config';
import { useEffect } from 'react';
import userRoles from '../constants/userRoles';
import { useRouter } from 'next/router';

export default function ProfilePage({ user, profile } : any) {
	const router = useRouter();
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/HomeCashier')
		} else if(userRoles.Admin == user.userRole){
			router.replace('/HomeAdmin')
		}
	}, [user]);
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
          src={profile.image || ""}
          alt={'Avatar Alt'}
          mb={4}
          pos={'relative'}
        />
        <Heading fontSize={'2xl'} fontFamily={'body'}>
          {profile.name}
        </Heading>
        <Text fontWeight={600} color={'gray.500'} mb={4}>
					{profile.username}
					<p>
						{profile.email}
					</p>
        </Text>
        <Text
          textAlign={'center'}
          color={useColorModeValue('gray.700', 'gray.400')}
          px={3}>
          	Address: {profile.address || "N/A"}
					<p>
						Gender: {profile.gender || "N/A"}
					</p>
					<p>
						Mobile Number: {profile.mobileNumber || "N/A"}
					</p>
					<p>
						TIN: {profile.tin || "N/A"}
					</p>
        </Text>

        <Stack mt={8} direction={'row'} spacing={4}>
          <Button
            flex={1}
            fontSize={'sm'}
            rounded={'full'}
            _focus={{
              bg: 'gray.200',
            }}>
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
            }}>
            Edit Profile
          </Button>
        </Stack>
      </Box>
    </Center>
		</Layout>
  );
}

ProfilePage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const profile = await frontEndAuthentication(`${server}/api/profile/GetUser`, ctx);
	return {user: json, profile};
}