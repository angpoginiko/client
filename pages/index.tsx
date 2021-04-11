import { useEffect, useState } from 'react'
import Layout from '../components/Layout'

const IndexPage = () => {
	const [message, setMessage] = useState("")
	const [auth, setAuth] = useState(false)
	useEffect(() => {
		(
			async () =>{
				const response = await fetch("/api/profile/retrieve");
				if(response.ok){
					const content = await response.json();
					setMessage(`Hi ${content.name}`);
					setAuth(true);
				} else{
					setMessage("You need to login first")
				}
		}
		)();
	});
	return(
  <Layout title="Home | Next.js + TypeScript Example" auth={auth}>
    <h1>Hello Next.js 👋</h1>
    {message}
  </Layout>
)}

export default IndexPage
