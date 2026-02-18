import React from 'react'
import HeroAbousUs from './components/HeroAbousUs'
import MissionVission from './components/MissionVission'
import TeamSection from './components/TeamSection'
import ValuesStrip from './components/ValuesStrip'

const page = () => {
    return (
        <div className='bg-white flex flex-col min-h-screen items-center justify-center w-full'>
            <HeroAbousUs />
            <MissionVission />
            <ValuesStrip />
            <TeamSection />
        </div>
    )
}

export default page