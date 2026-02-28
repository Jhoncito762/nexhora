import React from 'react'
import HeroCatalog from './components/HeroCatalog'
import CatalogProducts from './components/CatalogProducts'

const page = () => {
    return (
        <main className='flex min-h-screen flex-col'>
            <HeroCatalog />
            <CatalogProducts />
        </main>
    )
}

export default page