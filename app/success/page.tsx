import { title } from "@/components/primitives";
import Image from 'next/image'
import flex from './flex.png'
export default function Success() {
	return (
		<div>
 <Image
      src={flex}
     // width={500}
     // height={500}
      alt="Picture of the author"
    /></div>
	);
}
