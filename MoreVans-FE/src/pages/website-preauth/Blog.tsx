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
            title: 'Top Tips for a Stress-Free House Move',
            excerpt: 'Moving house can be overwhelming, but with the right preparation and mindset, it can be a smooth experience. Here are our top tips...',
            content: 'Full content here...',
            author: 'Sarah Johnson',
            date: '2024-03-15',
            category: 'Moving Tips',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            readTime: '5 min read',
            tags: ['Moving Tips', 'Organization', 'Planning'],
        },
        {
            id: 2,
            title: 'How to Choose the Right Moving Company',
            excerpt: 'Selecting the right moving company is crucial for a successful relocation. Learn what to look for and what questions to ask...',
            content: 'Full content here...',
            author: 'Michael Brown',
            date: '2024-03-10',
            category: 'Moving Tips',
            image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            readTime: '7 min read',
            tags: ['Moving Companies', 'Selection', 'Tips'],
        },
        {
            id: 3,
            title: 'Packing Like a Pro: Essential Moving Supplies',
            excerpt: "Having the right supplies can make all the difference when packing for a move. Here's our comprehensive guide...",
            content: 'Full content here...',
            author: 'Emma Wilson',
            date: '2024-03-05',
            category: 'Packing Guide',
            image: 'https://images.unsplash.com/photo-1600514973912-2a2f4d5d1d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            readTime: '6 min read',
            tags: ['Packing', 'Supplies', 'Organization'],
        },
    ];

    const categories = ['all', 'Moving Tips', 'Packing Guide', 'Moving Companies', 'Storage Solutions'];

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
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Moving Blog</h1>
                        <p className="text-xl text-white/90 mb-8">Expert advice, tips, and insights to make your moving experience smoother</p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                placeholder="Search articles..."
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
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Stay Updated</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Subscribe to our newsletter for the latest moving tips and industry insights.</p>
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
