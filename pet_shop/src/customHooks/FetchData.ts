import * as _React from 'react';
import { useState, useEffect } from 'react';


// interal imports
import { serverCalls } from '../api';


export interface ShopProps {
    id: string, 
    animal_type: string,
    image: string,
    description: string,
    price: string,
    prod_id: string,
    quantity: number,
    order_id?: string,
    color: string
}


interface GetShopDataProps {
    shopData: ShopProps[]
    getData: () => void
}


export const useGetShop = (): GetShopDataProps => {
    const [ shopData, setShopData ] = useState<ShopProps[]>([])

    const handleDataFetch = async () => {
        const result = await serverCalls.getShop()

        setShopData(result)
    }

    useEffect( () => { handleDataFetch() }, [])

    return { shopData, getData: handleDataFetch }
}