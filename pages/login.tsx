import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import Layout from '../components/Layout';

type FormData = {
  username: string;
  password: string;
};


const Login : React.FC = () => {
	const { register, handleSubmit } = useForm();
	const [message, setMessage] = useState("");
	const router = useRouter();

	const onSubmit = async (formData: FormData) => {
		const response = await fetch ("/api/profile/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: 'include',
			body: JSON.stringify({profile: formData}),
		})
		const data = await response.json();
		setMessage(data.message);

		await router.push("/");
	}
	return(
		<Layout>
			<h3>Login</h3>
				<form onSubmit={handleSubmit(onSubmit)}>
					<label>username:</label>
					<input name="username" ref={register} />
					<label>password:</label>
					<input name="password" ref={register} />
					<input type="submit" />
					{message}
				</form>
		</Layout>
	);
}

export default Login;