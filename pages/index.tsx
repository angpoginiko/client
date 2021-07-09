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
import { NextPageContext } from 'next';
import { formAuth } from './api/formAuth';
import { server } from '../config';
import Footer from '../components/Footer';
import CarouselComp from '../components/CarouselComp';
import { CarouselType } from '../interfaces';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

export default function IndexPage({ user }: any) {
	const fetchCarousel = async () => {
		const res = await fetch(`api/carousel/getCarousel`);
		return res.json();
	}

	const router = useRouter();
	const { data: carousel } = useQuery<CarouselType>("carousel", fetchCarousel);
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
			<Layout authentication={user} onStore={false}>
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
            </Text>
          </Heading>
          <CarouselComp carousel={carousel!}/>
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
              }}
							onClick={() => router.push("/register")}
							>
              Get Started
            </Button>
          </Stack>
        </Stack>
      </Container>
		</Layout>
		<Footer />
    </>
  );
}

IndexPage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await formAuth(`${server}/api/profile/retrieve`, ctx);
	return {json};
}