import Image from "next/legacy/image";
import React from 'react'

interface EarlyAdopterCardProps {
    usecase:  {
        id: number;
        title: string;
        icon: string;
        desc: string;
        height: string;
    }
}
// testimonial: {
//     id: number;
//     name: string;
//     role: string;
//     message: string;
//     height: number;
// };


const EarlyAdopterCard = ({ usecase }: EarlyAdopterCardProps) => {
// const EarlyAdopterCard = ({ testimonial }: EarlyAdopterCardProps) => {
    return (
      <div
        className={` flex flex-col items-stretch space-y-16 rounded-xl bg-white p-8 shadow-lg`}
        style={{ height: usecase.height }}
      >
        <h3 className="flex-1 text-2xl font-medium">{usecase.desc}</h3>

        <div className="flex items-center justify-between space-y-2">
          <p className="font-bold">{usecase.title}</p>
          {/* <p className='text-gray-500'>{usecase.role}</p> */}
          <Image
            src={usecase.icon}
            alt={usecase.title}
            width={75}
            height={75}
          />
        </div>
      </div>
    );
}

export default EarlyAdopterCard
