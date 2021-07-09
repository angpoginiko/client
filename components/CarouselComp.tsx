
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { CarouselType } from "../interfaces";

interface CarouselCompProps {
	carousel: CarouselType
}

export default function CarouselComp({ carousel } : CarouselCompProps) {
	return(
	<Carousel autoPlay showThumbs={false} infiniteLoop width="15" showStatus={false} interval={3000} emulateTouch>
			<div>
					<img src={carousel?.image1.toString()} style={{width: "25%"}}/>
			</div>
			<div>
					<img src={carousel?.image2.toString()} style={{width: "25%"}}/>
			</div>
			<div>
					<img src={carousel?.image3.toString()} style={{width: "25%"}}/>
			</div>
		</Carousel>
	)
}