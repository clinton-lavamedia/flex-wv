'use client'
import { useState, useEffect } from "react";
import { Card, CardBody, Input, Button, Slider } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";

let flex = [
	{
		id: 1,
		name: 'Fashionista'
	}, {
		id: 2,
		name: 'Fitness Guru'
	}, {
		id: 3,
		name: 'College crush'
	}, {
		id: 4,
		name: 'Beer bro'
	}, {
		id: 5,
		name: 'Social glue'
	}, {
		id: 6,
		name: 'Drama queen'
	}]
export default function Flex() {
	const router = useRouter()
    const [phone, setPhone] = useState("");

	const [selected, setSelected] = useState(0);
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
           
            console.log(phone)
        }
    }, []);
	const handleSubmit = () => {
		const scriptUrl = 'https://script.google.com/macros/s/AKfycbx-qAgan8f2eFFL8Qj-HybhnDsLYivuYVt2pNpnuFa0mOeaTRM9XGmBmVlL6XQs8xE1/exec'
		var data={
			name:'',
			phone:phone,
			firebaseid:'',
			vote:flex[selected].name
		}
		fetch(scriptUrl, {method: 'POST',mode: 'no-cors', headers:{contentType: "application/json"} , body: JSON.stringify(data)})
        .then(res => {
            console.log("SUCCESSFULLY SUBMITTED",res)
        })
        .catch(err => console.log(err))
	}
	//https://script.google.com/macros/s/AKfycbxruIeLHmpR8eYWwOWDp7JGt4Mm04crZFmlbBoovYuiA4R08IaGr3x4Q10TAQQ9DGV9/exec
	return (
		<div>

			<div>
				{flex.map((flex) =>
					<Card id={flex.id.toString()}
					onPress={() => setSelected(flex.id)}
						isBlurred
						isPressable
						className={flex.id==selected ? "bg-lime-400 font-medium rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black mb-2"
						:
						"bg-white font-medium rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black mb-2"} 
						//className=" bg-white font-medium rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black mb-2"
						>
						<CardBody>
							<p className="text-6xl inline-block w-[326px]  pt-2">{flex.name}</p>
						</CardBody>
					</Card>

				)}
			</div>

			<Button color="success"
				//isDisabled={isVerifyButtonDisabled}
				onClick={handleSubmit}
				className=" bg-lime-400 h-14 font-medium rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black" // variant="shadow"
			>
				Done

			</Button>
		</div>
	);
}
