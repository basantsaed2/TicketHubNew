import React from 'react'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Links = () => {
       return (
              <div
                     className='w-full flex items-center justify-evenly gap-x-10 bg-mainColor rounded-3xl'
              >
                     <NavLink to={''}
                            className='text-xl font-TextFontRegular text-white underline'
                     >
                            <h1 className='p-2'>Home</h1>
                     </NavLink>
                     <NavLink to={'my_trips'}
                            className='text-xl font-TextFontRegular text-white pb-1'
                     >
                            My Trips
                     </NavLink>
                     <NavLink
                            to={'wallet'}
                            className='text-xl font-TextFontRegular text-white pb-1'
                     >
                            Wallet
                     </NavLink>
                     <NavLink to={'points'}
                            className='text-xl font-TextFontRegular text-white pb-1'
                     >
                           Points
                     </NavLink>
              </div>
       )
}

export default Links