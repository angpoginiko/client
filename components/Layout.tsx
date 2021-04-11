import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

type Props = {
  children?: ReactNode
  title?: string
	auth?: boolean
}

const Layout = ({ children, title = 'This is the default title', auth }: Props) => {
	const Router = useRouter();

	const onLogout = async () =>{ 
		await fetch("api/profile/logout",{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include"
		})
		await Router.push("/login")
	}

	const loginButton = (
		<>
			<Link href="/register">
          <a>Register</a>
      </Link> |{' '}
			<Link href="/login">
          <a>Login</a>
      </Link> |
		</>
	);

	const logoutButton = (
		<>
			<a onClick={onLogout} href="#">Logout</a>
			|{' '}
		</>
	)
	
	return(
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>{' '}
        |{' '}
        {auth ? logoutButton: loginButton}
      </nav>
    </header>
    {children}
  </div>
)}

export default Layout
