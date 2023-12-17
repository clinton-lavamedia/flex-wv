'use client'
import { useState, useEffect } from "react";
import { Card, CardBody, Input, Button, Slider } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";
/* import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library'; */

//import data from './google.json'
//https://docs.google.com/spreadsheets/d/1p8jyvPb1Pp4r-E-yTft1ZKqks5rXjfKVnvuKyHXobDM/edit#gid=0
//https://docs.google.com/spreadsheets/d/1MH5aI6_c9QBrIR2kvZZhyZplHKmF4cjU4B7yuaSEilI/edit#gid=0// Config variables
/* const SPREADSHEET_ID = '1p8jyvPb1Pp4r-E-yTft1ZKqks5rXjfKVnvuKyHXobDM';
const SHEET_ID = 0;
const GOOGLE_CLIENT_EMAIL = data.client_email;
const GOOGLE_SERVICE_PRIVATE_KEY = data.private_key.replace(/\\n/g, '\n');

const serviceAccountAuth = new JWT({
	// env var values here are copied from service account credentials generated by google
	// see "Authentication" section in docs for more info
	email: data.client_email,
	key: data.private_key.replace(/\\n/g, '\n'),
	scopes: [
		'https://www.googleapis.com/auth/drive',
		'https://www.googleapis.com/auth/drive.file',
		'https://www.googleapis.com/auth/spreadsheets',
	],
});
// GoogleSpreadsheet Initialize
const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
const appendSpreadsheet = async (row: any) => {
	try {

		// loads document properties and worksheets
		await doc.loadInfo();

		const sheet = doc.sheetsById[SHEET_ID];
		await sheet.addRow(row);
	} catch (e) {
		console.error('Error: ', e);
	}
}; */
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
	},
	{
		id: 7,
		name: 'Skincare enthusiast'
	},
	{
		id: 8,
		name: 'Dance drunk'
	},
	{
		id: 9,
		name: '3am buddy'
	},
	{
		id: 10,
		name: 'Herbalist'
	},]
export default function Flex() {
	const router = useRouter()
	const [phone, setPhone] = useState("");
	const [name, setName] = useState("");

	const [selected, setSelected] = useState(0);
	useEffect(() => {
		if (window) {
			// set props data to session storage or local storage  
			const phone = window.sessionStorage.getItem('phone')
			const name = window.sessionStorage.getItem('name')
			if (phone == null) {
				router.push('/')
				toast.error("something wrong try to again send otp");
				return;
			}
			setPhone(phone)
			setName(name ? name : '')
			console.log(phone, name)
		}
	}, []);
	const handleSubmit = () => {

		/* const newRow = {
			name: name,
			phone: phone,
			firebaseid: '',
			vote: flex[selected-1].name
		}; */
		console.log(process.env.NEXT_PUBLIC_USLACK)
		let url=process.env.NEXT_PUBLIC_USLACK!
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify({ text: phone +' '+ name+ ' '+ flex[selected-1].name }),
		})
			.then((data) => {
				console.log(data);
				//sessionStorage.setItem('token', data)

				router.push('/success')
			})
			.catch((error) => {
				console.error(error);


			});
		//appendSpreadsheet(newRow);
		router.push('/success')
	}
	return (
		<div>

			<div className="flex flex-col mt-3 gap-1 ">
				{flex.map((flex) =>
					<Card id={flex.id.toString()}
						onPress={() => setSelected(flex.id)}
						isBlurred
						isPressable
						className={flex.id == selected ? "bg-lime-400  rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black mb-2"
							:
							"bg-white  rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black mb-2"}
					//className=" bg-white font-medium rounded-[10px] text-6xl shadow-[2px_2px_0px_#000] box-border border-[1px] border-solid border-black mb-2"
					>
						<CardBody>
							<p className="text-6xl mr-14 ml-14 pt-2">{flex.name}</p>
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
