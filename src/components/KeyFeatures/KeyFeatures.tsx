import React from 'react'
import Title from '../ui/Title'
import content from '~/config/content'

const KeyFeatures = () => {
    const { keyFeatures } = content.home;
    
    return (
      <div className="w-responsive grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          {/* title & subtitle */}
          <div className="space-y-4">
            <Title className="lg:text-start">
              {keyFeatures.title[0]}{" "}
              <span className="text-purple">{keyFeatures.title[1]}</span>
            </Title>
            <p>
              Get daily personalized tweet suggestions, re-write tweets you
              like, get tweet & thread ideas.
            </p>
          </div>

          {/* features */}
          <div className="space-y-7">
            {keyFeatures.features.map((feature, index) => (
              <div
                key={index}
                className={`flex-center-between ${index == 0 && "py-5 shadow-lg"} rounded-lg px-5 text-lg duration-200 hover:scale-105 hover:cursor-none`}
              >
                <p
                  className={`${index == 0 ? "text-black" : "text-black/40"} font-bold`}
                >
                  {feature}
                </p>
              </div>
            ))}
          </div>
          <div></div>
        </div>
        <div className="flex-center h-full min-h-[40vh] w-full rounded-xl bg-[#DFDEFF]"></div>
      </div>
    );
}

export default KeyFeatures
