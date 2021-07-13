import {
	Stack,
	SimpleGrid
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config';
import { useEffect, useState } from 'react';
import userRoles from '../constants/userRoles';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { useQuery } from 'react-query';
import { CarouselType, ProductType } from '../interfaces';
import HomeItem from '../components/HomeItem'
import CarouselComp from '../components/CarouselComp';
import Footer from '../components/Footer';
import PageLoader from '../components/PageLoader';

export default function AuthIndexPage({ user, onStore } : any) {
	const [isLoading, setIsLoading] = useState(false);
	const [productTypeQuery, setProductTypeQuery] = useState("");
	
	const fetchProducts = async () => {
		if(productTypeQuery != ""){
			const res = await fetch(`api/products/getProductByType/${productTypeQuery}`);
			return res.json();
		}	
	}
	const { data: products, refetch, isFetching } = useQuery<ProductType[]>("products", fetchProducts);
	
	useEffect(() => {
		refetch();
	}, [productTypeQuery]);

	const router = useRouter();
	useEffect(() => {
		if(onStore){
			router.replace('/store');
		} else if(userRoles.Cashier == user.userRole){
			router.replace('/home-cashier');
		} else if(userRoles.Admin == user.userRole){
			router.replace('/home-admin');
		}
	}, [user, onStore]);

	const fetchCarousel = async () => {
		const res = await fetch(`api/carousel/getCarousel`);
		return res.json();
	}
	const { data: carousel, isFetching: isCarouselFetching } = useQuery<CarouselType>("carousel", fetchCarousel);
  return (
    <>
			<Layout authentication={user} onStore={false} setIsLoading={setIsLoading} setProductTypeQuery={setProductTypeQuery}>
				{!isLoading ? 
				<Stack direction="row" spacing={productTypeQuery === "" ? "20%" : "10%"} height="200%">
				<Sidebar setQuery={setProductTypeQuery}/>
					<SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 6}} gap={2} spacing={"10px"} py={{base: 12, md: 40}} height="100%">
						{!isFetching && products && products.map((product) => {
							return (
								<>
									<HomeItem product={product} customerId={user.id} key={product._id}/>
								</>
							)
						})}
						{productTypeQuery == "" && <CarouselComp carousel={carousel!} isFetching={isCarouselFetching} onHome={true}/>}
						{isFetching && (<PageLoader size="xl"/>)}
					</SimpleGrid>
				</Stack> : <PageLoader size="xl"/>}
			</Layout>
			{!isLoading && <Footer />}
    </>
  );
}

AuthIndexPage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${json!.id}`, ctx);
	return {user: json, onStore};
}