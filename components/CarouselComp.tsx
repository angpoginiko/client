
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { CarouselType } from "../interfaces";
import PageLoader from "./PageLoader";

interface CarouselCompProps {
	carousel: CarouselType
	isFetching: boolean
}

export default function CarouselComp({ carousel, isFetching } : CarouselCompProps) {
	if(isFetching){
		return <PageLoader size="xl"/>
	}
	return(
	<Carousel autoPlay showThumbs={false} infiniteLoop width="15" showStatus={false} interval={3000} emulateTouch>
			<div>
					<img src={carousel?.image1.toString()} style={{width: "30%"}}/>
			</div>
			<div>
					<img src={carousel?.image2.toString()} style={{width: "30%"}}/>
			</div>
			<div>
					<img src={carousel?.image3.toString()} style={{width: "30%"}}/>
			</div>
		</Carousel>
	)
}