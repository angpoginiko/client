
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { CarouselType } from "../interfaces";
import PageLoader from "./PageLoader";
import { useMediaQuery, Center } from "@chakra-ui/react"

interface CarouselCompProps {
	carousel: CarouselType
	isFetching: boolean;
	onHome?: boolean;
}

export default function CarouselComp({ carousel, isFetching, onHome } : CarouselCompProps) {
	if(isFetching){
		return <PageLoader size="xl"/>
	}
	let width = "50%"
	const [isSmall] = useMediaQuery("(min-width: 48em)")
	if(onHome){
		if(isSmall){
			width = "100%"
		}
	}
	return(
		<Center>
		<Carousel autoPlay showThumbs={false} infiniteLoop width="15" showStatus={false} interval={3000} emulateTouch>
				<div>
						<img src={carousel?.image1.toString()} style={{width: width}}/>
				</div>
				<div>
						<img src={carousel?.image2.toString()} style={{width: width}}/>
				</div>
				<div>
						<img src={carousel?.image3.toString()} style={{width: width}}/>
				</div>
			</Carousel>
		</Center>
	)
}