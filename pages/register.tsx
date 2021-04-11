import React from 'react';
import { useForm } from 'react-hook-form'
import Layout from '../components/Layout';
import { Profile } from '../interfaces/index'
import { useRouter } from 'next/router'



const Register : React.FC = () => {
	const { register, handleSubmit } = useForm();
	const Router = useRouter();
	const onSubmit = async (formData: Profile) => {
		const response = await fetch("/api/profile/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({profile: formData}),
		});
		await response.json();
		Router.push("/login");
	}

	return(
		<Layout>
			<h3>Register</h3>
				<form onSubmit={handleSubmit(onSubmit)}>
					<label>Name:</label>
						<input name="name" placeholder="Name" ref={register} />

					<label>username:</label>
						<input name="username" placeholder="username" ref={register} />

					<label>Email:</label>
						<input name="email" placeholder="Email" ref={register} />
						
					<label>Password:</label>
						<input name="password" type="password" placeholder="Password" ref={register} />
					
					<label>Repeat Password:</label>
						<input name="repeatpassword" type="password" placeholder="Repeat Password" ref={register} />
					<input type="submit" />
				</form>
		</Layout>
	);
}

export default Register;