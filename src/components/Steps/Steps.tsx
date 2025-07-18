'use client';

import React from 'react'
import Title from '../ui/Title'
import content from '~/config/content'
import Image from "next/legacy/image";
import StepCard from './StepCard';
"use client";

import { motion } from 'framer-motion';

const Steps = () => {
    const { steps } = content.home;
    
    return (
        <section id='keysteps' className='py-20 bg-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className='text-center space-y-4 mb-16'
                >
                    <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900'>
                        <span className='gradient-text'>{steps.title[0]}</span>{' '}
                        <span>{steps.title[1]}</span>
                    </h2>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                        Transform your videos into intelligent knowledge with our simple process
                    </p>
                </motion.div>

                <div className='space-y-16 lg:space-y-24'>
                    {steps.steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <StepCard step={step} index={index} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Steps
