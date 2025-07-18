import React from 'react'

const loading = () => {
    return (
        <div className='w-screen h-screen bg-black z-50 grid place-content-center'>
            <div className={`w-[50px] h-[50px] rounded-full border-t-4 animate-spin border-gray-200 `}></div>
        </div>
    )
}

export default loading;
