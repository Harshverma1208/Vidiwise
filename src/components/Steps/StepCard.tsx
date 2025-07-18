'use client';

import React from 'react'
import Button from '../ui/Button'
import Image from "next/legacy/image"
"use client";

import { motion } from 'framer-motion'
import { FileText, MessageCircle, Clock } from 'lucide-react'

interface StepCardProps {
    step: {
        id: number,
        title: string,
        desc: string,
        button: string,
        type: number,
        boxOut: string,
        boxIn: string,
        image: string
    },
    index: number
}

const StepCard = ({ step, index }: StepCardProps) => {
    const icons = [
        <FileText key="1" className="w-8 h-8" />,
        <MessageCircle key="2" className="w-8 h-8" />,
        <Clock key="3" className="w-8 h-8" />
    ];

    const gradients = [
        "from-blue-500 to-purple-600",
        "from-pink-500 to-red-500", 
        "from-purple-600 to-indigo-600"
    ];

    const isEven = index % 2 === 0;
    
    return (
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${!isEven ? 'lg:direction-reverse' : ''}`}>
            {/* Content Section */}
            <motion.div 
                className={`lg:col-span-6 space-y-6 ${!isEven ? 'lg:order-2' : 'lg:order-1'}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
            >
                <div className="space-y-4">
                    {/* Step Number */}
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradients[index]} p-3 text-white shadow-lg`}>
                            {icons[index]}
                        </div>
                        <span className="text-lg font-semibold text-gray-500">
                            Step {step.id}
                        </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                        {step.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {step.desc}
                    </p>
                    
                    {/* CTA Button */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="pt-4"
                    >
                        <Button className={`bg-gradient-to-r ${gradients[index]} text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0`}>
                            {step.button}
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Visual Section */}
            <motion.div 
                className={`lg:col-span-6 ${!isEven ? 'lg:order-1' : 'lg:order-2'}`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative">
                    {/* Main Card */}
                    <div className="glass-card p-8 shadow-glass">
                        <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <Image
              src={step.image}
              alt={step.title}
                                width={600}
                                height={400}
                                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
              priority
            />
          </div>
                        
                        {/* Overlay Content */}
                        <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r ${gradients[index]} rounded-full flex items-center justify-center shadow-xl animate-float`}>
                            <div className="text-white font-bold text-lg">
                                {step.id}
                            </div>
                        </div>
        </div>

                    {/* Background Decoration */}
                    <div className={`absolute -top-4 -left-4 w-full h-full bg-gradient-to-r ${gradients[index]} rounded-xl opacity-10 -z-10`}></div>
                </div>
            </motion.div>
      </div>
    );
}

export default StepCard
