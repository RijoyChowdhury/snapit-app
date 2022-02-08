import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';

const PinDetail = ({ user }) => {
    const [pins, setPins] = useState(null);
    const [pinDetail, setPinDetail] = useState(null);
    const [comment, setComment] = useState('');
    const [addingComment, setAddingComment] = useState(false);
    const { pinId } = useParams();

    const fetchPinDetails = () => {
        let query = pinDetailQuery(pinId);
        if (query) {
            client.fetch(query).then(data => {
                setPinDetail(data[0]);
                console.log('pinDetail');
                console.log(pinDetail);
                if (data[0]) {
                    query = pinDetailMorePinQuery(data[0]);
                    client.fetch(query).then(res => {
                        setPins(res);
                    });
                }
            });
        }
    };

    const addComment = () => {
        if (comment) {
            setAddingComment(true);
            client.patch(pinId).setIfMissing({ comments: [] }).insert('after', 'comments[-1]', [{
                comment,
                _key: uuidv4(),
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id
                },
            }]).commit().then(() => {
                fetchPinDetails();
                setComment('');
                setAddingComment(false);
            });
        }
    };

    useEffect(() => {
        fetchPinDetails();
    }, [pinId]);

    if (!pinDetail) return <Spinner message='Loading Pin' />;

    return (
        <>
            <div className='flex xl:flex-row flex-col m-auto bg-white' style={{ maxWidth: '1500px', borderRadius: '32px' }}>
                <div className='relative flex justify-center items-center md:items-start flex-initial'>
                    <div className='relative'>
                        <img className='rounded-t-3xl rounded-b-3xl object-fill' src={pinDetail?.image && urlFor(pinDetail.image).url()} alt="user-post" />
                        <a className='xl:hidden absolute bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none left-5 bottom-5' href={pinDetail?.destination} target='_blank' rel='noreferrer' onClick={(e) => e.stopPropagation()}>
                            <BsFillArrowUpRightCircleFill />
                        </a>
                        <a className='absolute bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100    hover:shadow-md outline-none right-5 bottom-5' href={`${pinDetail?.image?.asset?.url}?dl=`} download onClick={(e) => e.stopPropagation()}>
                            <MdDownloadForOffline />
                        </a>
                    </div>
                </div>
                <div className='w-full p-5 flex-1 xl:min-w-620'>
                    <div className='hidden xl:flex items-center gap-2'>
                        <BsFillArrowUpRightCircleFill />
                        <a href={pinDetail?.destination} target='_blank' rel='noreferrer' className='truncate' onClick={(e) => e.stopPropagation()}>{pinDetail?.destination}</a>
                    </div>
                    <div>
                        <h1 className='text-4xl font-bold break-words mt-3'>
                            {pinDetail.title}
                        </h1>
                        <p className='mt-3 text-xl'>{pinDetail.about}</p>
                    </div>
                    <Link to={`user-profile/${pinDetail?.postedBy?._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
                        <img className='w-8 h-8 rounded-full object-cover' src={pinDetail?.postedBy?.image} alt="User" />
                        <p className='capitalize truncate'>{pinDetail?.postedBy?.userName}</p>
                    </Link>
                    <h2 className='empty-5 text-2xl mt-5'>Comments</h2>
                    <div className='max-h-370 overflow-y-auto'>
                        {pinDetail?.comments?.map((comment, i) => (
                            <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
                                <img className='w-10 h-10 rounded-full cursor-pointer' src={comment?.postedBy?.image} alt="user" />
                                <div className='flex flex-col'>
                                    <p className='font-bold'>{comment?.postedBy?.userName}</p>
                                    <p>{comment?.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-wrap mt-6 gap-3'>
                        <Link to={`user-profile/${pinDetail?.postedBy?._id}`}>
                            <img className='w-11 h-11 rounded-full cursor-pointer' src={pinDetail?.postedBy?.image} alt="User" />
                        </Link>
                        <input type="text" className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300' placeholder='Enter your comment.. .' value={comment} onChange={e => setComment(e.target.value)} />
                        <button type='button' className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none' onClick={addComment}>
                            {addingComment ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
            {pins?.length > 0 && (
                <>
                    <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
                        More like this
                    </h2>
                    <MasonryLayout pins={pins} />
                </>
            )}
        </>
    )
}

export default PinDetail
