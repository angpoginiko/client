import { useState } from 'react';

interface Params {
  initialValue?: string;
}


export default function useCase ({initialValue} : Params) {
	const [text, setText] = useState(initialValue);

	const toPascalCase = () => {
		const newString = text!.replace(/\w+/g,
			function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();});
		setText(newString);
	}

	const toCamelCase = () => {
		const newString = text!.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		}).replace(/\s+/g, '');
		setText(newString);
	}

	return {
		toPascalCase,
		toCamelCase
	}
}