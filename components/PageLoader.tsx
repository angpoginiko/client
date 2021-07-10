import {
	Spinner,
	Center
} from '@chakra-ui/react'

interface PageLoaderProps {
	size: string;
}

export default function PageLoader({size}: PageLoaderProps) {
	return (
		<Center width="100%"><Spinner size={size}/></Center>
	)
}