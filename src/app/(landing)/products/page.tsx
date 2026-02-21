import React from 'react'

const page = () => {
    return (
        <div className='w-full flex flex-col gap-4 justify-center items-center min-h-screen bg-background'>
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="nexhoraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgb(7,100,144)" />
                        <stop offset="100%" stopColor="rgb(34,64,171)" />
                    </linearGradient>
                </defs>
                <path fill="url(#nexhoraGrad)" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z" />
                <rect fill="url(#nexhoraGrad)" x="11" y="6" rx="1" width="2" height="7">
                    <animateTransform attributeName="transform" type="rotate" dur="9s" values="0 12 12;360 12 12" repeatCount="indefinite" />
                </rect>
                <rect fill="url(#nexhoraGrad)" x="11" y="11" rx="1" width="2" height="9">
                    <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
                </rect>
            </svg>
            <h1 className="text-xl font-semibold text-gray-700">En desarrollo</h1>
        </div>
    )
}

export default page