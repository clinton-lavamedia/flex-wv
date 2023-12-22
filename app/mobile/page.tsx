'use client'

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Card, CardBody, Input, Button, Slider, Avatar } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { getRedirectResult, signInWithRedirect, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../src/lib/clientApp";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from 'next/navigation'
import { Bars } from 'react-loader-spinner'

import React, { useRef, useState, useEffect } from 'react';
export default function Home() {
	const searchParams = useSearchParams()
	var param = searchParams.get('name')
	const [name, setName] = useState(param ? param : 'Tara');
	const [isLoading, setLoading] = useState(false);

	/* const searchParams = useSearchParams()
useEffect(() => {
	

	var param = searchParams.get('name')
	setName(param? param : '')
	
}, []); */
	const router = useRouter()
	const [phone, setPhone] = useState("");
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	
	const resendOTP = async () => {
		setLoading(true)

		console.log('sending otp')
		/* if (phone == null) {
			// toast.error("something wrong try to again send otp");
			return;
		} */
		var recaptcha;

		/* if (isButtonDisabled) {
		  return;
		} */

		try {
			setIsButtonDisabled(true);
			const recaptchaParent = document.getElementById("recaptcha-container");
			if (recaptchaParent) {
				recaptchaParent.innerHTML = "<div id='recaptcha'></div>";
			}
			const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {
				size: "invisible",
			});

			const confirmation = await signInWithPhoneNumber(
				auth,
				"+91" + phone,
				recaptcha
			);
			recaptcha.clear()
			console.log(confirmation)
			if (typeof window !== 'undefined') {
				sessionStorage.setItem('phone', phone)
				sessionStorage.setItem('confirmation', JSON.stringify(confirmation))
				//sessionStorage.setItem('name', name ? name : '')

			}
			toast.success("OTP sent successfully");
			//let url=process.env.NEXT_PUBLIC_USLACK!
			fetch('https://' + process.env.NEXT_PUBLIC_USLACK!, {
				method: 'POST',
				headers: {
					'Content-type': 'application/x-www-form-urlencoded',
				},
				body: JSON.stringify({ text: phone + ' requested an OTP to flex on : ' + name + ' ' }),
			})
				.then((data) => {
					setLoading(false)

					console.log(data);
					//sessionStorage.setItem('token', data)

					//router.push('/success')
				})
				.catch((error) => {
					setLoading(false)

					console.error(error);


				});
			router.push('/otp?name=' + name)

			/* toast.success("otp sended successfully");
			dispatch(addUser(confirmation));
			dispatch(addPhoneNumber(phone));
			dispatch(changeStateFalse());
			setOtpTime(40); */
		} catch (error: any) {
			setLoading(false)

			switch (error.code) {
				case "auth/too-many-requests":
					toast.error("Too many requests. Please try again later.");
					break;
				case "auth/invalid-phone-number":
					toast.error("The phone number is invalid.");
					break;
				case "auth/quota-exceeded":
					toast.error("Quota exceeded");
				default:
					toast.error("Something went wrong. Please try again later.", error.code);
					break;
			}
			recaptcha = "";
			if (typeof window !== 'undefined') {
				sessionStorage.setItem('phone', phone)
			}
			//router.push('/mobile?name=' + name)
			fetch('https://' + process.env.NEXT_PUBLIC_USLACK!, {
				method: 'POST',
				headers: {
					'Content-type': 'application/x-www-form-urlencoded',
				},
				body: JSON.stringify({ text: phone + ' requested an OTP to flex on : ' + name + ' ' }),
			})
				.then((data) => {
					setLoading(false)
					router.push('/otp?name=' + name)

					console.log(data);
					//sessionStorage.setItem('token', data)

					//router.push('/success')
				})
				.catch((error) => {
					setLoading(false)

					console.error(error);


				});
			//router.push('/otp')
			console.log(error);
		} finally {
			setLoading(false)

			setIsButtonDisabled(false);
		}
	};
	function getImage(name: any){
		switch (name.toLowerCase()) {
			case "vaishnavi":
				return "https://heyo-public-assets.s3.ap-south-1.amazonaws.com/" + process.env.NEXT_PUBLIC_VASINAVI;
			case "riya":
				return "https://heyo-public-assets.s3.ap-south-1.amazonaws.com/" + process.env.NEXT_PUBLIC_RIYA;
			case "jenny":
				return "https://heyo-public-assets.s3.ap-south-1.amazonaws.com/" + process.env.NEXT_PUBLIC_JENNY;
			case "aashi":
				return "https://heyo-public-assets.s3.ap-south-1.amazonaws.com/" + process.env.NEXT_PUBLIC_AASHI;
			default:
				return "https://i.pravatar.cc/150?u=a04258114e29026708c"
		}
	}
	var camalize = function camalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	return (
		<div>
			<div className="flex flex-col items-center align-middle justify-center pt-10">

			<Avatar src={getImage(name)}
					radius="full"
					size="lg"
					className="w-40 h-40 text-large align-middle" />
				<div className="text-6xl   pt-2">
					{name ? camalize(name) : 'Tara'}
				</div>
				{/* <div className=" text-mini  pt-2 pb-2">
					Verify your number to make your vote count
				</div> */}
				<Bars
					height="80"
					width="80"
					color="#4fa94d"
					ariaLabel="bars-loading"
					wrapperStyle={{}}
					wrapperClass=""
					visible={isLoading}
				/>
			</div>
			<Card
				isBlurred
				className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
				shadow="sm"
			>
				<CardBody>
					<div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">

						<div className="flex flex-col col-span-6 md:col-span-8">
							<div className="text-6xl inline-block w-[326px]  pt-2">
							Verify your number to make your vote count
							</div>
							<div className="flex flex-col mt-3 gap-1 ">
								<Input
									classNames={{
										label: "text-black/50 dark:text-white/90",
										input: [
											'text-3xl',

										],
										//innerWrapper: "bg-transparent",
										inputWrapper: [
											'rounded-[10px]', 'bg-white', 'shadow-[2px_2px_0px_#000]', 'box-border', 'w-full', 'h-[54px]', 'border-[1px]', 'border-solid', 'border-black',
											//"text-black/90 dark:text-white/90",
											"placeholder:text-default-700/50 dark:placeholder:text-white/60",
										],
									}}
									isRequired
									type="number"
									placeholder=" 0000000000"
									onValueChange={setPhone}
									value={phone}
									startContent={
										<div className="pointer-events-none flex items-center">
											<span className="text-default-400 text-6xl">+91</span>
										</div>
									}
									className="max-w-xs"
								/>

								<div className="text-mini inline-block w-[326px] pt-14">
									We don’t share your number with anyone
								</div>
								<Button color="success"
									disabled={isLoading || phone.length<9 }
									className={(!isLoading && phone.length>9 )? "  bg-lime-400 flex  h-14 font-medium rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black"
										:
										" bg-gray-300 flex h-14 font-medium rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black"
									}
									//className=" bg-lime-400 font-medium h-14 rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black" // variant="shadow"
									onClick={() => resendOTP() /* router.push('/otp') */}
								>
									Get OTP
								</Button>
							</div>


						</div>
					</div>
					<Toaster />
				</CardBody>
			</Card>

		</div>

	);
}
