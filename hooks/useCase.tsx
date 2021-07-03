


export default function useCase () {

	const toPascalCase = (text: string) => {
		const newString = text!.replace(/\w+/g,
			function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();});
		return newString;
	}

	const toCamelCase = (text: string) => {
		const newString = text!.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		}).replace(/\s+/g, '');
		return newString;
	}

	return {
		toPascalCase,
		toCamelCase,
	}
}