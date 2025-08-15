import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';
import BlogPost from '../../components/blog/BlogPost';

interface BlogPostData {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
    category: string;
    image: string;
    readTime: string;
    tags: string[];
}

const BlogPostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [isScrolled, setIsScrolled] = useState(false);
    const [post, setPost] = useState<BlogPostData | null>(null);
    const [loading, setLoading] = useState(true);

    // Monitor scroll position for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Simulate API call to fetch blog post
    useEffect(() => {
        // In a real app, this would be an API call
        const fetchPost = async () => {
            try {
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Mock data - replace with actual API call
                const mockPost: BlogPostData = {
                    id: Number(id),
                    title: 'Top Tips for a Stress-Free House Move',
                    content: `
                        <p>Moving house can be one of the most stressful experiences in life, but with the right preparation and mindset, it can be a smooth and even enjoyable process. Here are our top tips for a stress-free move:</p>
                        
                        <h2>1. Start Planning Early</h2>
                        <p>Begin your moving preparations at least 8 weeks before your move date. Create a detailed checklist and timeline to keep track of all tasks.</p>
                        
                        <h2>2. Declutter Before Packing</h2>
                        <p>Take this opportunity to sort through your belongings. Donate, sell, or discard items you no longer need. This will reduce your moving costs and make unpacking easier.</p>
                        
                        <h2>3. Pack Room by Room</h2>
                        <p>Pack one room at a time, clearly labeling each box with its contents and destination room. This will make unpacking much more organized.</p>
                        
                        <h2>4. Create an Essentials Box</h2>
                        <p>Pack a box with items you'll need immediately upon arrival: toiletries, a change of clothes, basic kitchen items, and important documents.</p>
                        
                        <h2>5. Take Photos of Electronics</h2>
                        <p>Before unplugging any electronics, take photos of the cable setup. This will make reconnecting everything much easier in your new home.</p>
                        
                        <h2>6. Keep Important Documents Safe</h2>
                        <p>Keep all important documents, such as contracts, insurance papers, and personal records, in a separate, secure folder that you'll transport personally.</p>
                        
                        <h2>7. Measure Your New Space</h2>
                        <p>Take measurements of your new home's rooms and doorways to ensure your furniture will fit. This will help you plan the layout and identify any potential issues.</p>
                        
                        <h2>8. Update Your Address</h2>
                        <p>Don't forget to update your address with important institutions: banks, insurance companies, utility providers, and the post office.</p>
                        
                        <h2>9. Take Care of Yourself</h2>
                        <p>Moving is physically and mentally demanding. Remember to stay hydrated, take breaks, and get enough rest during the process.</p>
                        
                        <h2>10. Celebrate Your Move</h2>
                        <p>Once you're settled in, take time to celebrate your new beginning. Order takeout, invite friends over, or simply enjoy your new space.</p>
                    `,
                    author: 'Sarah Johnson',
                    date: '2024-03-15',
                    category: 'Moving Tips',
                    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    readTime: '8 min read',
                    tags: ['Moving Tips', 'Organization', 'Planning', 'Home Moving', 'Packing'],
                };

                setPost(mockPost);
            } catch (error) {
                console.error('Error fetching blog post:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar isScrolled={isScrolled} />

            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : post ? (
                <BlogPost post={post} />
            ) : (
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
                    <a href="/blog" className="text-primary hover:text-primary-dark transition-colors">
                        Return to Blog
                    </a>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default BlogPostDetail;
