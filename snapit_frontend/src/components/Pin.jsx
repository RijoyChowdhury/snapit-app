import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import {MdDownloadForOffline} from 'react-icons/md';
import {AiTwotoneDelete} from 'react-icons/ai';
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs';
import {FcLike, FcLikePlaceholder} from 'react-icons/fc';
import {client, urlFor} from '../client';
import {fetchUser} from '../utils/fetchUser';

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
    const user = fetchUser();
    const [postHovered, setPostHovered] = useState(false);
    const [alreadySaved, setAlreadySaved] = useState(false);
    const navigate = useNavigate();
    const savePin = (id) => {
        if(!alreadySaved) {
            setAlreadySaved(true);
            client.patch(id).setIfMissing({save: []}).insert('after', 'save[-1]', [{
                _key: uuidv4(),
                userId: user?.googleId,
                postedBy: {
                    _type: postedBy,
                    _ref: user?.googleId,
                }
            }]).commit();
        }
    };
    const deletePin = (id) => {
        client.delete(id).then(() => {
            window.location.reload();
        })
    }
    
    useEffect(() => {
        setAlreadySaved(!!(save?.filter(item => item.postedBy._id === user?.googleId))?.length);
    }, []);
    
    return (
        <div className='m-2'>
            <div className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out' onMouseEnter={() => setPostHovered(true)} onMouseLeave={() => setPostHovered(false)} onClick={() => navigate(`/pin-detail/${_id}`)}>
                <img className='rounded-lg w-full' src={urlFor(image).width(250).url()} alt="User Post" />
                {postHovered && (
                    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-4 pr-4 pt-4 z-50' style={{height: '100%'}}>
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none' href={`${image?.asset?.url}?dl=`} download onClick={(e) => e.stopPropagation()}>
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {alreadySaved ? (
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                }} type='button' className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-white text-xl opacity-75  hover:shadow-md outline-none'>
                                    <FcLike />
                                </button>
                            ) : (
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    savePin(_id);
                                }} type='button' className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-black text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'>
                                    <FcLikePlaceholder />
                                </button>
                            )}
                        </div>
                        <div className='flex justify-between items-center gap-2 w-full'>
                            {destination && (
                                <a href={destination} target='_blank' rel='noreferrer' className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none' onClick={(e) => e.stopPropagation()}>
                                    <BsFillArrowUpRightCircleFill />
                                </a>
                            )}
                            {postedBy?._id === user?.googleId && (
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    deletePin(_id);
                                }} type='button' className='bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark text-xl rounded-3xl hover:shadow-md outline-none'>
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className='flex items-center justify-between'>
                <Link to={`user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
                    <img className='w-8 h-8 rounded-full object-cover' src={postedBy?.image} alt="User" />
                    <p className='capitalize truncate'>{postedBy?.userName}</p>
                </Link>
                {save?.length && (<div className='flex justify-center items-center text-dark mt-2'>
                    <FcLike className='mr-2' fontSize={20} />
                    {save?.length}
                </div>)}
            </div>
        </div>
    )
}

export default Pin
