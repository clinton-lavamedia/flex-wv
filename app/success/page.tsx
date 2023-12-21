'use client'

import { title } from "@/components/primitives";
import Image from 'next/image'
import flex from './flex.png'
import monsters from './monsters.png'
import group from './group.png'

import { useState, useEffect } from "react";
import { Avatar, Button } from "@nextui-org/react";
import { useSearchParams } from 'next/navigation'
import { isIOS, isAndroid } from 'react-device-detect';
import Link from "next/link";
import { useRouter } from 'next/navigation'
import toast, { Toaster } from "react-hot-toast";

export default function Success() {
  const [height, setHeight] = useState(0);
  const [otpTime, setOtpTime] = useState(4);
  const router = useRouter()
  const [phone, setPhone] = useState("");

  const searchParams = useSearchParams()

  var param = searchParams.get('name')
  const [name, setName] = useState(param ? param : 'Tara');
  useEffect(() => {
    if (window) {
      setHeight(window.innerHeight);

    }
  }, []);
  useEffect(() => {
    if (otpTime > 0) {
      const intervalId = setInterval(() => {
        setOtpTime(otpTime - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [otpTime]);
  useEffect(() => {
    if (window) {
      // set props data to session storage or local storage  
      const phone = window.sessionStorage.getItem('phone')
      if (phone == null) {
        router.push('/?name=' + name)
        // toast.error("something wrong try to again send otp");
        return;
      }
      setPhone(phone)

      console.log(phone)
    }
  }, []);
  function handleSubmit() {
    fetch('https://' + process.env.NEXT_PUBLIC_USLACK, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ text: phone + ' is using : Android:' + isAndroid  }),
    })
      .then((data) => {
        console.log(data,isAndroid);
        //sessionStorage.setItem('token', data)
        isAndroid ?
          window.location.href = 'https://play.google.com/store/apps/details?id=com.lavamedia.heyo.prod'
          //<Link href="https://play.google.com/store/apps/details?id=com.lavamedia.heyo.prod" rel="noopener noreferrer" target="_blank"> Heyo </Link>
          :
          window.location.href = 'https://apps.apple.com/in/app/heyo-make-new-friends/id6448174840'

      })
      .catch((error) => {
        console.error(error);


      });

  }
  function getImage(name: any){
		switch (name.toLowerCase()){
			case "vaishnavi":
				return "https://heyo-public-assets.s3.ap-south-1.amazonaws.com/"+process.env.NEXT_PUBLIC_VASINAVI;
			case "riya":
				return "https://heyo-public-assets.s3.ap-south-1.amazonaws.com/"+process.env.NEXT_PUBLIC_RIYA;
				default:
					return "https://i.pravatar.cc/150?u=a04258114e29026708c"
		}
	}
  var camalize = function camalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
  return (
    <div className="flex flex-col items-center align-middle justify-center pt-10">
      {otpTime > 0 ?

        <div className="flex flex-col items-center align-middle justify-center pt-10">

          <Avatar src={getImage(name)}
            radius="full"
            size="lg"
            className="w-40 h-40 text-large align-middle" />
          <div className="text-6xl   pt-2">
					{name ? camalize(name) : 'Tara'}
          </div>
          <div className=" text-lg pt-32">
            Great!
          </div>
          <div className=" text-mini  pt-2 pb-2">
            Your vote has been
            successfully been submitted
          </div>
        </div>
        :
        <div>
          <Image
            src={group}
            style={{
              color: 'transparent',
              // position: 'absolute',
              width: '100%',
              // inset: 0, bottom: 0, left: 0,
              // top: height - 309

            }}
            // fill={true}
            // width={500}
            // height={500}
            alt="monsters"
          />
          <div className="text-6xl   pt-2">
            Find your college fam
          </div>
          <Button color="success"
            // isDisabled={isVerifyButtonDisabled}
            onClick={handleSubmit}
            className=" mt-2 bg-lime-400 font-medium h-14 rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black"
          >
            Download now

          </Button>
          {/* <Image
        src={monsters}
        className="flex bottom-0"
        style={{
          color: 'transparent',
          position: 'absolute',
          width: '100%',
         // inset: 0, 
          bottom: 0, 
          left: 0,
        //  top: height - 309

        }}
        // fill={true}
        // width={500}
        // height={500}
        alt="monsters"
      /> */}
        </div>

      }

    </div >
  );
}


