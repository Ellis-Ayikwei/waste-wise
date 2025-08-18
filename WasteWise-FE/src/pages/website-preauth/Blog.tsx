import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faNewspaper, faBookmark, faShare } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';
import BlogCard from '../../components/blog/BlogCard';

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    category: string;
    image: string;
    readTime: string;
    tags: string[];
}

const Blog: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isScrolled, setIsScrolled] = useState(false);

    // Monitor scroll position for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Sample blog data - In a real app, this would come from an API
    const blogPosts: BlogPost[] = [
        {
            id: 1,
            title: 'Smart Waste Management: How IoT is Revolutionizing Ghana\'s Cities',
            excerpt: 'Discover how smart IoT bins and sensors are transforming waste collection in Accra, Kumasi, and other Ghanaian cities. Learn about the environmental and economic benefits...',
            content: 'Full content here...',
            author: 'Dr. Kwame Asante',
            date: '2025-08-15',
            category: 'Smart Technology',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            readTime: '6 min read',
            tags: ['IoT', 'Smart Bins', 'Technology', 'Ghana'],
        },
        {
            id: 2,
            title: 'Plastic Waste Recycling in Ghana: Opportunities and Challenges',
            excerpt: 'Ghana generates over 1.7 million tons of plastic waste annually. Explore the current recycling landscape, innovative solutions, and how citizens can contribute...',
            content: 'Full content here...',
            author: 'Ama Osei-Bonsu',
            date: '2025-08-10',
            category: 'Recycling',
            image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            readTime: '8 min read',
            tags: ['Plastic Recycling', 'Environment', 'Sustainability'],
        },
        {
            id: 3,
            title: 'Community Composting: Turning Organic Waste into Garden Gold',
            excerpt: 'Learn how Ghanaian communities are implementing composting programs to reduce organic waste and create nutrient-rich soil for urban farming initiatives...',
            content: 'Full content here...',
            author: 'John Mensah',
            date: '2025-08-05',
            category: 'Composting',
            image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            readTime: '5 min read',
            tags: ['Composting', 'Organic Waste', 'Urban Farming'],
        },
        {
            id: 4,
            title: 'E-Waste Management: Safely Disposing of Electronics in Ghana',
            excerpt: 'With increasing electronic consumption, proper e-waste disposal is crucial. Discover certified e-waste collection points and recycling facilities across Ghana...',
            content: 'Full content here...',
            author: 'Fatima Al-Hassan',
            date: '2025-07-28',
            category: 'E-Waste',
            image: 'https://images.unsplash.com/photo-1586627717195-1da3bef5b66a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            readTime: '7 min read',
            tags: ['E-Waste', 'Electronics', 'Environment', 'Safety'],
        },
        {
            id: 5,
            title: 'Commercial Waste Solutions for Ghanaian Businesses',
            excerpt: 'From restaurants to offices, businesses generate significant waste. Explore cost-effective and environmentally responsible waste management strategies...',
            content: 'Full content here...',
            author: 'Samuel Akoto',
            date: '2025-07-20',
            category: 'Business Solutions',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            readTime: '6 min read',
            tags: ['Commercial Waste', 'Business', 'Cost Savings'],
        },
        {
            id: 6,
            title: 'EPA Regulations: Understanding Ghana\'s Waste Management Laws',
            excerpt: 'Stay compliant with Ghana\'s Environmental Protection Agency regulations. A comprehensive guide for businesses and waste management providers...',
            content: 'Full content here...',
            author: 'Prof. Akosua Frimpong',
            date: '2025-07-15',
            category: 'Regulations',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            readTime: '9 min read',
            tags: ['EPA', 'Regulations', 'Compliance', 'Legal'],
        },
    ];

    const categories = ['all', 'Smart Technology', 'Recycling', 'Composting', 'E-Waste', 'Business Solutions', 'Regulations'];

    const filteredPosts = blogPosts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar isScrolled={isScrolled} />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 text-white py-24">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                        alt=""
                        className="w-full h-full object-cover opacity-30 scale-105"
                        style={{ objectPosition: '50% 65%' }}
                        loading="eager"
                    />
                    {/* Animated grid pattern overlay */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-10 z-10"></div>
                </div>
                <div className="container mx-auto px-4 relative z-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
                        <div className="inline-block p-3 bg-white/10 rounded-full mb-6">
                            <FontAwesomeIcon icon={faNewspaper} className="text-3xl" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">WasteWise Blog</h1>
                        <p className="text-xl text-white/90 mb-8">Expert insights on waste management, recycling, and sustainability in Ghana</p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                placeholder="Search waste management articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/70" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <div className="container mx-auto px-4 mt-8 ">
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedCategory === category
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md'
                            }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Blog Posts Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                            <FontAwesomeIcon icon={faSearch} className="text-4xl text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No articles found</h3>
                            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-primary/5">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Stay Updated on Waste Management</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Subscribe to our newsletter for the latest sustainability tips, recycling updates, and environmental initiatives in Ghana.</p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">Subscribe</button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
