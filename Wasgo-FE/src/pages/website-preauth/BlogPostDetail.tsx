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
                    title: 'Smart Waste Management: How IoT is Revolutionizing Ghana\'s Cities',
                    content: `
                        <p>Ghana is experiencing a waste management revolution, driven by cutting-edge Internet of Things (IoT) technology. As urbanization accelerates across cities like Accra, Kumasi, and Takoradi, innovative smart waste management solutions are emerging to address the growing challenges of waste collection and disposal.</p>
                        
                        <h2>The Challenge of Urban Waste in Ghana</h2>
                        <p>With over 60% of Ghana's population expected to live in urban areas by 2030, cities are grappling with increasing volumes of waste. Traditional collection methods often prove inadequate, leading to overflowing bins, missed collections, and environmental health concerns.</p>
                        
                        <h2>Enter Smart IoT Technology</h2>
                        <p>WasteWise's smart bin technology represents a paradigm shift in waste management. These intelligent containers are equipped with sensors that monitor fill levels, temperature, and even detect different types of waste materials.</p>
                        
                        <h2>Real-Time Monitoring and Optimization</h2>
                        <p>IoT sensors provide real-time data on waste levels, enabling collection teams to optimize routes and schedules. This means bins are emptied before they overflow, reducing odors, pest problems, and environmental contamination.</p>
                        
                        <h2>Benefits for Ghanaian Cities</h2>
                        <p>Smart waste management systems offer numerous advantages:</p>
                        <ul>
                            <li><strong>Reduced Collection Costs:</strong> Optimized routes can reduce fuel consumption by up to 40%</li>
                            <li><strong>Improved Hygiene:</strong> Proactive collection prevents overflow and associated health risks</li>
                            <li><strong>Environmental Protection:</strong> Better waste management reduces pollution and improves air quality</li>
                            <li><strong>Data-Driven Decisions:</strong> Analytics help city planners make informed infrastructure decisions</li>
                        </ul>
                        
                        <h2>Success Stories from Accra</h2>
                        <p>The Greater Accra Metropolitan Area has seen remarkable improvements since implementing smart waste management systems. Collection efficiency has increased by 35%, and citizen satisfaction with waste services has risen significantly.</p>
                        
                        <h2>Mobile App Integration</h2>
                        <p>Citizens can now request on-demand waste collection through mobile apps, similar to ride-hailing services. This democratizes access to waste management services and ensures no community is left behind.</p>
                        
                        <h2>Supporting Local Economy</h2>
                        <p>Smart waste management creates employment opportunities for local youth as collection agents, maintenance technicians, and data analysts. The technology also supports the growth of recycling businesses through better waste sorting and material recovery.</p>
                        
                        <h2>Environmental Impact</h2>
                        <p>By 2025, smart waste management systems in Ghana are projected to divert over 200,000 tons of waste from landfills annually, contributing to the country's climate change mitigation goals.</p>
                        
                        <h2>The Future of Waste Management</h2>
                        <p>As Ghana continues to embrace digital transformation, smart waste management represents just the beginning. Future innovations may include AI-powered waste sorting, blockchain-based recycling incentives, and integration with smart city infrastructure.</p>
                        
                        <h2>Getting Involved</h2>
                        <p>Citizens, businesses, and waste management providers can all participate in this transformation. Whether through adopting smart collection services, becoming a certified waste provider, or simply practicing better waste segregation, everyone has a role to play in making Ghana cleaner and more sustainable.</p>
                    `,
                    author: 'Dr. Kwame Asante',
                    date: '2025-08-15',
                    category: 'Smart Technology',
                    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    readTime: '8 min read',
                    tags: ['IoT', 'Smart Bins', 'Technology', 'Ghana', 'Urban Planning', 'Environment'],
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
