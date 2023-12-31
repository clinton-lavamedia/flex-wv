'use client'

import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { Avatar } from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from "react";
import Image from 'next/image'
import logo from './logo.png'
import { Suspense } from 'react'

import monsters from './success/monsters.png'
/* export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
}; */

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const searchParams = useSearchParams()
	var param = searchParams.get('name')
	const [name, setName] = useState(param ? param : 'Tara');

	const renderLayout = () => {
		// Check the current route and conditionally render the layout
		if (pathname !== '/success') {
			return <div className="flex flex-col items-center align-middle justify-center pt-10">

				<Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c"
					radius="full"
					size="lg"
					className="w-40 h-40 text-large align-middle" />
				{/* <div className="text-6xl   pt-2">
					{name ? name : 'Tara'}
				</div> */}
				<div className="text-6xl  pt-2 ">
					What describes {name ? name : 'Tara'} best?
				</div>
			</div>
		}
		// Render the default layout for other pages
		return <div></div>;
	};
	const renderFooter = () => {
		// Check the current route and conditionally render the layout
		if (pathname !== '/success') {
			return <footer className="w-full flex items-center justify-center py-3" 
			>
				<Image
					src={logo}
					// width={500}
					// height={500}
					alt="Logo"
				/>
			</footer>
		} else {
			// Render the default layout for other pages
			return <footer className="w-full flex items-center justify-center" 
			style={{bottom:0,left:0}}>
				<Image
					src={monsters}
					style={{
						width: '100%'}}
					// width={500}
					// height={500}
					alt="Monsters"
				/>
			</footer>
		}

	};
	return (
		<html lang="en" suppressHydrationWarning>
			<head >

			</head>
			<body
				style={{ backgroundColor: '#F6F6F6' }}
				className={clsx(
					"min-h-screen bg-background font-sans antialiased h-full",
					fontSans.variable
				)}
			>
				{/* <div>
					{renderLayout()}
				</div> */}
				{/* <div className="flex flex-col items-center align-middle justify-center pt-10">

					<Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c"
						radius="full"
						size="lg"
						className="w-40 h-40 text-large align-middle" />
					<div className="text-6xl   pt-2">
						Tara
					</div>
					<div className=" text-medium">
						What describes Tara best?
					</div>
				</div> */}

				<Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
					<div className=" h-full flex flex-col">
						{/* <Navbar /> */}

						<main className="container flex-grow">

							{/* 						<main className="container  pt-2  mx-auto max-w-7xl px-6 flex-grow">
 */}
							{children}
						</main>
						{renderFooter()}
						<div id="recaptcha-container">
						<div id="recaptcha"></div>

						</div>

					</div>
				</Providers>
			</body>
		</html>
	);
}
