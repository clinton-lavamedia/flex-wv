'use client'

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Card, CardBody, Input, Button, Slider } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { getRedirectResult, signInWithRedirect ,RecaptchaVerifier,signInWithPhoneNumber} from "firebase/auth";
import { auth } from "./src/lib/clientApp";
import toast,{ Toaster } from "react-hot-toast";

import { useEffect, useState } from "react";
export default function Home() {
	const router = useRouter()
	const [phone, setPhone] = useState("");
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const resendOTP = async () => {
		console.log('sending otp')
		if (phone == null) {
		 // toast.error("something wrong try to again send otp");
		  return;
		}
	    var recaptcha;

		/* if (isButtonDisabled) {
		  return;
		} */
	
		try {
		  setIsButtonDisabled(true);
		 
		  const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {
			size: "invisible",
		  });
	
		  const confirmation = await signInWithPhoneNumber(
			auth,
			"+91" + phone,
			recaptcha
		  );
		  console.log(confirmation)
		  if (typeof window !== 'undefined') {
			sessionStorage.setItem('phone', phone)
			sessionStorage.setItem('confirmation', JSON.stringify(confirmation))

		  }
		  toast.success("otp sended successfully");
		  router.push('/otp')
		  
		  /* toast.success("otp sended successfully");
		  dispatch(addUser(confirmation));
		  dispatch(addPhoneNumber(phone));
		  dispatch(changeStateFalse());
		  setOtpTime(40); */
		} catch (error:any) {
		  switch (error.code) {
			case "auth/too-many-requests":
			  toast.error("Too many requests. Please try again later.");
			  break;
			case "auth/invalid-phone-number":
			  toast.error("The phone number is invalid.");
			  break;
			  case"auth/quota-exceeded":
			  toast.error("Quota exceeded");
			default:
			  toast.error("Something went wrong. Please try again later.",error.code);
			  break;
		  }
		  recaptcha = "";
		  if (typeof window !== 'undefined') {
			sessionStorage.setItem('phone', phone)
		  }
		  router.push('/otp')
		  console.log(error);
		} finally {
		  setIsButtonDisabled(false);
		}
	  };
	
	
	return (
		<Card
			isBlurred
			className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
			shadow="sm"
		>
			<CardBody>
				<div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">

					<div className="flex flex-col col-span-6 md:col-span-8">
						<div className="text-6xl inline-block w-[326px]  pt-2">
							Enter your phone
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
								type="tel"
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
							disabled={isButtonDisabled}
							className=" bg-lime-400 font-medium h-14 rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black" // variant="shadow"
							onClick={() =>  resendOTP() /* router.push('/otp') */}
							>
								Get OTP
							</Button>
						</div>


					</div>
				</div>
				<Toaster />
			</CardBody>
		</Card>
	);
}
