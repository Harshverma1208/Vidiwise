import React, { use } from 'react'
import Title, { SubTitle } from '../ui/Title'
import content from '~/config/content';
import Image from "next/legacy/image";
import EarlyAdopterCard from './EarlyAdopterCard';

const EarlyAdopters = () => {
    const { usecases } = content.home;
    // const { testimonials } = content.home;
    
    
    return (
      <div id="features" className="space-y-24">
        <div className="space-y-8">
          <Title className="">
            <span>{usecases.title[0]} </span>
            <div className="text-purple relative inline">
              <span>
                {usecases.title[1]}
                {/* <Image
                  src="/icons/hero/wigly.svg"
                  alt="wigly"
                  width={118}
                  height={5}
                  className="absolute -bottom-2 left-0 right-0 w-full"
                /> */}
              </span>
            </div>{" "}
            {usecases.title[2]}
          </Title>
          {/* <SubTitle subTitleClass="lg:w-1/2">{testimonials.subtitle}</SubTitle> */}
        </div>
        <div className="mx-auto grid gap-4 rounded-xl bg-[#e6bf9f12] p-3 lg:grid-cols-2 lg:items-center xl:w-[60%]">
          {usecases.usecase.map((usecase, index) => (
            <EarlyAdopterCard key={usecase.id} usecase={usecase} />
          ))}
        </div>
        {/* <div className="mx-auto grid gap-4 rounded-xl bg-[#e6bf9f12] p-3 lg:grid-cols-2 xl:w-[60%]">
          {testimonials.testimonials.map((testimonial, index) => (
            <EarlyAdopterCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div> */}
      </div>
    );
}




export default EarlyAdopters
