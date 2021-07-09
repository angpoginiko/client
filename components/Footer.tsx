import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { ReactNode } from 'react';
import { useQuery } from 'react-query';
import { SocialMedia } from '../interfaces';

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
	const fetchSocialMedia = async () => {
		const res = await fetch(`api/socialMedia/getSocialMedia`);
		return res.json();
	}
	const { data: socialMedia } = useQuery<SocialMedia>("socialMedia", fetchSocialMedia);
	const dateToday = new Date();
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}>
        <Text>© {dateToday.getFullYear()} Pantry Corner. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>	
          <SocialButton label={'YouTube'} href={socialMedia?.facebook!}>
            <FaFacebook />
          </SocialButton>
          <SocialButton label={'Twitter'} href={socialMedia?.twitter!}>
            <FaTwitter />
          </SocialButton>
          <SocialButton label={'Instagram'} href={socialMedia?.instagram!}>
            <FaInstagram />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}