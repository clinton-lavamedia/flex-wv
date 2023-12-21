'use client'

import { Link } from "@nextui-org/link";
import { useRouter } from 'next/navigation'
import { Card, CardBody, Input, Button, Avatar } from "@nextui-org/react";
import { useState, useEffect } from "react";
import './otpInputs.css';
import { PhoneAuthProvider, signInWithCredential, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../src/lib/clientApp";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from 'next/navigation'
import { Bars } from 'react-loader-spinner'

export default function OTP() {
    const router = useRouter()

    const [confirmationResult, setConfirmationResult] = useState({});
    const [otpTime, setOtpTime] = useState(40);
    const [phone, setPhone] = useState("");
    const searchParams = useSearchParams()

    var param = searchParams.get('name')
    const [name, setName] = useState(param ? param : 'Tara');
	const [isLoading, setLoading] = useState(false);

    const [isVerifyButtonDisabled, setIsVerifyButtonDisabled] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        if (window) {
            // set props data to session storage or local storage  
            const phone = window.sessionStorage.getItem('phone')
            if (phone == null) {
                router.push('/')
                toast.error("something wrong try to again send otp");
                return;
            }
            setPhone(phone)
            var confirmation = window.sessionStorage.getItem('confirmation')
            confirmation = JSON.parse(confirmation)
            setConfirmationResult(confirmation)
            console.log(phone)
        }
    }, []);
    var recaptcha;

    const [inputValues, setInputValues] = useState({
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
        input6: '',
        // Add more input values here
    });
    useEffect(() => {
        if (otpTime > 0) {
            const intervalId = setInterval(() => {
                setOtpTime(otpTime - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [otpTime]);
    //this function updates the value of the state inputValues
    const handleInputChange = (inputId, value) => {
        setInputValues((prevInputValues) => ({
            ...prevInputValues,
            [inputId]: value,
        }));
    };
    const resendOTP = async () => {
        setLoading(true)

        if (phone == null) {
            router.push('/')
            toast.error("something wrong try to again send otp");
            return;
        }

        if (isButtonDisabled) {
            return;
        }

        try {
            setIsButtonDisabled(true);
            const recaptchaParent = document.getElementById("recaptcha-container");
			if (recaptchaParent) {
				recaptchaParent.innerHTML = "<div id='recaptcha'></div>";
			}
            recaptcha = new RecaptchaVerifier(auth, "recaptcha", {
                size: "invisible",
            });

            const confirmation = await signInWithPhoneNumber(
                auth,
                "+91" + phone,
                recaptcha
            );
            setConfirmationResult(confirmation)
            recaptcha = ""
            toast.success("otp resent successfully");
            setOtpTime(40);
            setLoading(false)

        } catch (error) {
            setLoading(false)

            switch (error.code) {
                case "auth/too-many-requests":
                    toast.error("Too many requests. Please try again later.");
                    break;
                case "auth/invalid-phone-number":
                    toast.error("The phone number is invalid.");
                    break;
                default:
                    toast.error("Something went wrong. Please try again later.");
                    break;
            }
            console.log(error);
        } finally {
            setLoading(false)

            setIsButtonDisabled(false);
        }
    };

    //this function processes form submission
    const handleSubmit = async () => {
        /*   if (isVerifyButtonDisabled) {
              return;
          } */
          setLoading(true)

        setIsVerifyButtonDisabled(true);

        console.log('submitting', Number(inputValues.input1 + inputValues.input2 + inputValues.input3 + inputValues.input4 + inputValues.input5 + inputValues.input6))
        console.log(confirmationResult)
        // ... Your submit logic here
        try {
            var credential = PhoneAuthProvider.credential(confirmationResult.verificationId, Number(inputValues.input1 + inputValues.input2 + inputValues.input3 + inputValues.input4 + inputValues.input5 + inputValues.input6));
            const loggedIn = await signInWithCredential(auth, credential)
            console.log(loggedIn)
            if (loggedIn.user.accessToken) {
                sessionStorage.setItem('firebasetoken', loggedIn.user.accessToken)
                sessionStorage.setItem('userid', loggedIn.user.uid)
                //router.push('/success?name=' + name)

                //const origin=request.headers.get("origin")
                fetch('https://' + process.env.NEXT_PUBLIC_USLACK, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({ text: phone + ' verified the OTP for: '+ name }),
                })
                    .then((data) => {
                        console.log(data);
                        setLoading(false)

                        //sessionStorage.setItem('token', data)
                        router.push('/success?name='+name)
                    })
                    .catch((error) => {
                        setLoading(false)
                        console.error(error);
                    });
                /*  fetch('http://13.126.83.192/auth/login', {
                     method: 'POST',
                     headers: {
     
                         'Access-Control-Allow-Credentials':true,
                         'Content-type': 'application/json',
                         'Access-Control-Allow-Origin':'*',
                         'Access-Control-Allow-Methods':'GET,DELETE,PATCH,POST,PUT',
                         Authorization:loggedIn.user.accessToken
                     },
                     body: JSON.stringify({ phone_number: phone }),
                 })
                     .then((response) => response.json())
                     .then((data) => {
                         console.log(data);
                         sessionStorage.setItem('token', data)
                        
                         router.push('/flex')
                     })
                     .catch((error) => {
                         console.error(error);
                         router.push('/flex')
     
                         setIsVerifyButtonDisabled(false);
     
                     });
                 */

            } setIsVerifyButtonDisabled(false);

            /*  credential.confirm(Number(inputValues.input1+inputValues.input2+inputValues.input3+inputValues.input4+inputValues.input5+inputValues.input6)).then((result) => {
                 // User signed in successfully.
                 const user = result.user;
                 console.log(result)
     
                 // ...
               }).catch((error) => {
                 console.log(error)
                 // User couldn't sign in (bad verification code?)
                 // ...
               }) */
        } catch (error) {
            // router.push('/flex')
            setLoading(false)
            setIsVerifyButtonDisabled(false);

            switch (error.code) {
                case "auth/too-many-requests":
                    toast.error("Too many requests. Please try again later.");
                    break;
                case "auth/invalid-phone-number":
                    toast.error("The phone number is invalid.");
                    break;
                default:
                    toast.error("Something went wrong. Please try again later.");
                    break;
            }
            console.log(error);
        } finally {
            setLoading(false)
            setIsVerifyButtonDisabled(false);
        }
    };
    function getImage(name){
		switch (name.toLowerCase()){
			case "vaishnavi":
				return "https://heyo-public-assets.s3.ap-south-1.amazonaws.com/vaishnavi.jpeg";
			case "riya":
				return "https://heyo-public-assets.s3.ap-south-1.amazonaws.com/riya.jpeg";
				default:
					return "https://i.pravatar.cc/150?u=a04258114e29026708c"
		}
	}
	var camalize = function camalize(str) {
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
				<div className=" text-mini  pt-2 pb-2">
                    Verify your number to make your vote count
                </div>
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
                                Enter your OTP
                            </div>
                            <div id='OTPInputGroup' className="digitGroup" data-autosubmit="true">
                                <OTPInput
                                    id="input1"
                                    value={inputValues.input1}
                                    onValueChange={handleInputChange}
                                    previousId={null}
                                    // handleSubmit={handleSubmit}
                                    nextId="input2"
                                />
                                <OTPInput
                                    id="input2"
                                    value={inputValues.input2}
                                    onValueChange={handleInputChange}
                                    previousId="input1"
                                    //  handleSubmit={handleSubmit}
                                    nextId="input3"
                                />
                                <OTPInput
                                    id="input3"
                                    value={inputValues.input3}
                                    onValueChange={handleInputChange}
                                    previousId="input2"
                                    //  handleSubmit={handleSubmit}
                                    nextId="input4"
                                />

                                <OTPInput
                                    id="input4"
                                    value={inputValues.input4}
                                    onValueChange={handleInputChange}
                                    previousId="input3"
                                    //  handleSubmit={handleSubmit}
                                    nextId="input5"
                                />
                                <OTPInput
                                    id="input5"
                                    value={inputValues.input5}
                                    onValueChange={handleInputChange}
                                    previousId="input4"
                                    //  handleSubmit={handleSubmit}
                                    nextId="input6"
                                />
                                <OTPInput
                                    id="input6"
                                    value={inputValues.input6}
                                    onValueChange={handleInputChange}
                                    previousId="input5"
                                    nextId="input6"
                                //  handleSubmit={handleSubmit}
                                />
                            </div>
                            <span>OTP sent to +91 {phone.substring(0, 2)}******{phone.substring(8, 10)}</span>

                            {/*  <div className="btnGroup" onClick={handleSubmit}>
                <button>Submit</button>
            </div> */}
                            <div className="flex flex-row col-span-6 md:row-span-8 ">
                                <Button onClick={() => resendOTP()} isDisabled={otpTime > 0}
                                    className=" bg-white font-medium h-14 rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black mr-4"
                                >
                                    <span>{isButtonDisabled ? "Sending" : "Resend in (" + otpTime + ")"}</span>

                                </Button>

                                <Button color="success"
                                    isDisabled={isVerifyButtonDisabled}
                                    onClick={handleSubmit}
                                    className=" bg-lime-400 font-medium h-14 rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black" // variant="shadow"
                                >
                                    {isVerifyButtonDisabled ? "Verifying" : "Submit"}

                                </Button>
                            </div>

                        </div>


                    </div>
                </CardBody>
                <Toaster />
            </Card>
        </div>

    );
}
//Our child component
const OTPInput = ({ id, previousId, nextId, value, onValueChange, handleSubmit }) => {
    //This callback function only runs when a key is released
    const handleKeyUp = (e) => {
        //check if key is backspace or arrowleft
        if (e.keyCode === 8 || e.keyCode === 37) {
            //find the previous element
            const prev = document.getElementById(previousId);
            if (prev) {
                //select the previous element
                prev.select();
            }
        } else if (
            (e.keyCode >= 48 && e.keyCode <= 57) || //check if key is numeric keys 0 to 9
            (e.keyCode >= 65 && e.keyCode <= 90) || //check if key is alphabetical keys A to Z
            (e.keyCode >= 96 && e.keyCode <= 105) || //check if key is numeric keypad keys 0 to 9
            e.keyCode === 39 //check if key is right arrow key
        ) {
            //find the next element
            const next = document.getElementById(nextId);
            if (next) {
                //select the next element
                next.select();
            } else {
                //check if inputGroup has autoSubmit enabled
                const inputGroup = document.getElementById('OTPInputGroup');
                if (inputGroup && inputGroup.dataset['autosubmit']) {
                    //submit the form
                    handleSubmit();
                }
            }
        }
    }
    return (
        <input
            id={id}
            name={id}
            type="number"
            value={value}
            maxLength={1}
            onChange={(e) => onValueChange(id, e.target.value)}
            onKeyUp={handleKeyUp}
        />
    );
};