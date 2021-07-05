export default function useUnitConverter () {

	const toGrams = (toConvert: number, unitOfMeasure: string) => {
		if(unitOfMeasure.toLowerCase() === "liters" || unitOfMeasure.toLowerCase() === "kilograms"){
			return toConvert*1000;
		} else if(unitOfMeasure.toLowerCase() === "mililiters"){
			return toConvert;
		}
	}

	const toMililiter = (toConvert: number, unitOfMeasure: string) => {
		if(unitOfMeasure.toLowerCase() === "liters" || unitOfMeasure.toLowerCase() === "kilograms"){
			return toConvert*1000;
		} else if(unitOfMeasure.toLowerCase() === "grams"){
			return toConvert;
		}
	}

	const toKilogram = (toConvert: number, unitOfMeasure: string) => {
		if(unitOfMeasure.toLowerCase() === "grams" || unitOfMeasure.toLowerCase() === "mililiters"){
			return toConvert/1000;
		} else if(unitOfMeasure.toLowerCase() === "liters"){
			return toConvert;
		}
	}

	const toLiter = (toConvert: number, unitOfMeasure: string) => {
		if(unitOfMeasure.toLowerCase() === "grams" || unitOfMeasure.toLowerCase() === "mililiters"){
			return toConvert/1000;
		} else if(unitOfMeasure.toLowerCase() === "kilograms"){
			return toConvert;
		}
	}

	return {toGrams, toKilogram, toMililiter, toLiter};
}