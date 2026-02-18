import React from 'react'
import Hero from './components/Hero'
import LogoCarousel from './components/LogoCarousel'
import OurServices from './components/OurServices'
import ConsultancyContainer from './components/ConsultancyContainer'
import AboutUs from './components/AboutUs'

const page = () => {
    return (
        <div className='bg-white flex flex-col min-h-screen items-center justify-center w-full'>
            <Hero />
            <LogoCarousel />
            <AboutUs />
            <OurServices />
            <ConsultancyContainer />
        </div>
    )
}

export default page