import React from 'react'
import HeroCatalog from './components/HeroCatalog'
import CatalogProducts, { Product } from './components/CatalogProducts'
import axiosPublic from '@/src/apis/axiosPublic'

const page = async () => {
    let initialProducts: Product[] = []
    let initialError = false

    try {
        const response = await axiosPublic.get<{ products: Product[] }>(process.env.NEXT_PUBLIC_PRODUCTS_PUBLIC!)
        initialProducts = response.data.products
    } catch {
        initialError = true
    }

    return (
        <main className='flex min-h-screen flex-col'>
            <HeroCatalog productCount={initialProducts.length} />
            <CatalogProducts initialProducts={initialProducts} initialError={initialError} />
        </main>
    )
}

export default page