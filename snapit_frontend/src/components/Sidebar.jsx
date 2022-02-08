import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {RiHomeFill} from 'react-icons/ri';
import {IoIosArrowForward} from 'react-icons/io';

import logo from '../assets/logo.png';
import logoName from '../assets/snapit_black.png';
import { categories } from '../static/categories';

const isNotActiveStyle = 'flex items-center px-5 py-1 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 py-1 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';

const Sidebar = ({user, closeToggle}) => {
    const handleCloseSidebar = () => {
        if(closeToggle) closeToggle(false);
    }
    return (
        <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
            <div className='flex flex-col min-h-3'>
                <Link to='/' className='flex px-5 my-6 w-190 items-center' onClick={handleCloseSidebar}>
                    <div><img className='rounded-full shadow-sm' src={logo} width='300px' alt="Logo" /></div>                        
                    <div><img className='pt-1' src={logoName} alt="Logo" /></div>
                </Link>
                <div className='flex flex-col gap-5'>
                    <NavLink to='/' className={({isActive}) => (isActive ? isActiveStyle : isNotActiveStyle)} onClick={handleCloseSidebar}>
                        <RiHomeFill /> Home
                    </NavLink>
                    <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Discover Categories</h3>
                    <div className='ml-4'>
                        {categories.slice(0, categories.length - 1).map((category) => (
                            <NavLink key={category.name} to={`/category/${category.name}`} className={({isActive}) => (isActive ? isActiveStyle : isNotActiveStyle)} onClick={handleCloseSidebar}>
                                <img src={category.image} alt={category.name}  className='w-10 h-10 rounded-full shadow-sm'/>
                                {category.name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
            {user && (
                <Link to={`user-profile/${user._id}`} className='flex my-5 mb-3 gap-2 p-2 pr-4 pl-4 items-center bg-white rounded-lg shadow-lg mx-3' onClick={handleCloseSidebar}>
                    <img src={user.image} className='w-10 h-10 rounded-full mr-4' alt="User" />
                    <p>{user.userName}</p>
                    <IoIosArrowForward />
                </Link>
            )}
        </div>
    )
}

export default Sidebar
