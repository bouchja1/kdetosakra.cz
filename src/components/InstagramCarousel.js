// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { InstagramFilled } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Instagram posts data
import instagramPostsData from '../data/instagram-posts.json';

export const InstagramCarousel = () => {
    const [posts, setPosts] = useState([]);
    const [expandedPosts, setExpandedPosts] = useState({});
    const [imageErrors, setImageErrors] = useState({});

    useEffect(() => {
        // Load Instagram posts from JSON file
        // The data is fetched using the script: npm run fetch-instagram
        // To update posts, run: npm run fetch-instagram
        setPosts(instagramPostsData);
    }, []);

    const handleImageError = (postId, postUrl) => {
        console.error('Failed to load Instagram image for post:', postId);
        setImageErrors(prev => ({ ...prev, [postId]: true }));
        // Try to redirect to Instagram if image fails
    };

    const toggleCaption = postId => {
        setExpandedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    if (posts.length === 0) {
        return null;
    }

    return (
        <div className="instagram-carousel-container">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                }}
                className="instagram-swiper"
            >
                {posts.map(post => (
                    <SwiperSlide key={post.id}>
                        <div className="instagram-post">
                            <div
                                className="instagram-post-image-container"
                                onClick={() => window.open(post.postUrl, '_blank')}
                                role="button"
                                tabIndex={0}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') window.open(post.postUrl, '_blank');
                                }}
                            >
                                {imageErrors[post.id] ? (
                                    <div className="instagram-post-image-placeholder">
                                        <div className="instagram-placeholder-content">
                                            <InstagramFilled style={{ fontSize: '48px', color: '#dbdbdb' }} />
                                            <p>Klikněte pro zobrazení na Instagramu</p>
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src={post.imageUrl}
                                        alt={post.caption.substring(0, 100)}
                                        className="instagram-post-image"
                                        referrerPolicy="no-referrer"
                                        crossOrigin="anonymous"
                                        onError={() => handleImageError(post.id, post.postUrl)}
                                    />
                                )}
                            </div>
                            <div className="instagram-post-caption">
                                <p>{expandedPosts[post.id] ? post.caption : truncateText(post.caption)}</p>
                                {post.caption.length > 100 && (
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={() => toggleCaption(post.id)}
                                        className="instagram-more-button"
                                    >
                                        {expandedPosts[post.id] ? 'Méně' : 'Více'}
                                    </Button>
                                )}
                                <Button
                                    type="primary"
                                    size="middle"
                                    onClick={() => window.open(post.postUrl, '_blank')}
                                    className="instagram-view-button"
                                >
                                    Zobrazit na Instagramu
                                </Button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
