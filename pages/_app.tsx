import React from "react";
import { ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from 'react-query'
 
const queryClient = new QueryClient()

function App({ Component, pageProps }: AppProps): React.ReactNode {
  return (
		<QueryClientProvider client={queryClient}>
			<ChakraProvider>
				<Component {...pageProps} />
			</ChakraProvider>
		</QueryClientProvider>
  );
}
export default App;