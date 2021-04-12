import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Head from 'next/head';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react';

export default function CallToActionWithAnnotation() {
	const [message, setMessage] = useState("")
	const [auth, setAuth] = useState(false)
	useEffect(() => {
		(
			async () =>{
				const response = await fetch("/api/profile/retrieve");
				if(response.ok){
					const content = await response.json();
					setMessage(`Hi ${content.name}`);
					setAuth(true);
				} else{
					setMessage("")
				}
		}
		)();
	});
  return (
    <>
			<Layout auth={auth}>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Welcome <br />
            <Text as={'span'} color={'green.400'}>
						{message}
            </Text>
          </Heading>
          <Text color={'gray.500'}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis lorem sit amet lectus tristique, 
					venenatis varius nibh blandit. Fusce faucibus varius lorem. 
					Ut consequat, lacus eu ultricies suscipit, purus sem convallis purus, 
					et fringilla magna lectus in purus. 
					Morbi mollis tempor dolor, in interdum mauris pharetra sit amet. 
					Aliquam dictum viverra dui, in pellentesque urna dignissim quis. 
					Nam commodo venenatis suscipit. Vestibulum imperdiet lorem nec ex hendrerit dapibus. 
					Integer at nisl felis.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Button
              colorScheme={'green'}
              bg={'green.400'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'green.500',
              }}>
              Get Started
            </Button>
          </Stack>
        </Stack>
      </Container>
			</Layout>
    </>
  );
}

