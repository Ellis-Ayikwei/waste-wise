import { faClock, faEnvelope, faHeadset, faLifeRing, faMapMarkerAlt, faPhone, 
         faSearch, faUser, faTruck, faCreditCard, faQuestionCircle, faExclamationTriangle,
         faBook, faTools, faShieldAlt, faMoneyBill, faBoxOpen, faCalendarAlt,
         faGavel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Define help article interfaces
interface HelpArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  role: 'customer' | 'provider' | 'both';
  url: string;
}

const ContactSupportPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [userRole, setUserRole] = useState<'customer' | 'provider'>('customer');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<HelpArticle[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    
    // Mock help articles data
    const helpArticles: HelpArticle[] = [
        {
            id: '1',
            title: 'How to Book a Move',
            excerpt: 'Step-by-step guide to booking your moving service through our platform.',
            category: 'bookings',
            tags: ['booking', 'request', 'service'],
            role: 'customer',
            url: '/help/booking-guide'
        },
        {
            id: '2',
            title: 'Comparing Quotes',
            excerpt: 'Learn how to evaluate and compare quotes from different providers.',
            category: 'bookings',
            tags: ['quotes', 'pricing', 'bids'],
            role: 'customer',
            url: '/help/comparing-quotes'
        },
        {
            id: '3',
            title: 'Payment Options and Methods',
            excerpt: 'Information about payment timing, accepted methods, and security.',
            category: 'payments',
            tags: ['payment', 'billing', 'fees'],
            role: 'customer',
            url: '/help/payment-guide'
        },
        {
            id: '4',
            title: 'Creating a Provider Profile',
            excerpt: 'Complete guide to setting up your service provider profile.',
            category: 'account',
            tags: ['profile', 'setup', 'registration'],
            role: 'provider',
            url: '/help/provider-profile-setup'
        },
        {
            id: '5',
            title: 'Managing Your Vehicle Fleet',
            excerpt: 'How to add, update, and manage your vehicles in the system.',
            category: 'vehicles',
            tags: ['fleet', 'trucks', 'vans'],
            role: 'provider',
            url: '/help/fleet-management'
        },
        {
            id: '6',
            title: 'Bidding on Jobs',
            excerpt: 'Best practices for submitting competitive bids and winning more jobs.',
            category: 'jobs',
            tags: ['bidding', 'quotes', 'jobs'],
            role: 'provider',
            url: '/help/bidding-guide'
        },
        {
            id: '7',
            title: 'Cancellation Policy',
            excerpt: 'Understanding our cancellation policy and refund process.',
            category: 'policies',
            tags: ['cancellation', 'refund'],
            role: 'both',
            url: '/help/cancellation-policy'
        },
        {
            id: '8',
            title: 'Insurance Coverage Details',
            excerpt: 'Information about insurance options and coverage during moves.',
            category: 'policies',
            tags: ['insurance', 'coverage', 'protection'],
            role: 'both',
            url: '/help/insurance-details'
        },
        {
            id: '9',
            title: 'How to File a Dispute',
            excerpt: 'Step-by-step guide to filing and resolving disputes on our platform.',
            category: 'disputes',
            tags: ['dispute', 'claim', 'resolution', 'issues'],
            role: 'both',
            url: '/help/dispute-guide'
        },
        {
            id: '10',
            title: 'Dispute Resolution Process',
            excerpt: 'Understanding how disputes are evaluated and resolved on our platform.',
            category: 'disputes',
            tags: ['dispute', 'mediation', 'resolution', 'process'],
            role: 'both',
            url: '/help/dispute-process'
        },
        {
            id: '11',
            title: 'Damage Claim Documentation',
            excerpt: 'How to properly document damages for successful claims.',
            category: 'disputes',
            tags: ['damage', 'photos', 'evidence', 'claims'],
            role: 'customer',
            url: '/help/damage-documentation'
        },
        {
            id: '12',
            title: 'Responding to Customer Disputes',
            excerpt: 'Best practices for providers when responding to customer disputes.',
            category: 'disputes',
            tags: ['dispute', 'customer relations', 'resolution', 'service issues'],
            role: 'provider',
            url: '/help/provider-dispute-guide'
        }
    ];

    // Customer-focused categories
    const customerCategories = [
        { id: 'bookings', name: 'Booking a Move', icon: faCalendarAlt },
        { id: 'payments', name: 'Payments & Billing', icon: faCreditCard },
        { id: 'account', name: 'Account Help', icon: faUser },
        { id: 'policies', name: 'Policies & Insurance', icon: faShieldAlt },
        { id: 'disputes', name: 'Disputes & Claims', icon: faGavel }
    ];

    // Provider-focused categories
    const providerCategories = [
        { id: 'jobs', name: 'Job Management', icon: faTools },
        { id: 'vehicles', name: 'Vehicle Management', icon: faTruck },
        { id: 'payments', name: 'Payments & Payouts', icon: faMoneyBill },
        { id: 'policies', name: 'Policies & Requirements', icon: faShieldAlt },
        { id: 'disputes', name: 'Disputes & Claims', icon: faGavel }
    ];

    // Get categories based on selected role
    const categories = userRole === 'customer' ? customerCategories : providerCategories;

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const filtered = helpArticles.filter(article => 
                (article.role === userRole || article.role === 'both') &&
                (article.title.toLowerCase().includes(query) || 
                 article.excerpt.toLowerCase().includes(query) ||
                 article.tags.some(tag => tag.toLowerCase().includes(query)))
            );
            setSearchResults(filtered);
        } else if (selectedCategory) {
            // Filter by category if no search query but category is selected
            const filtered = helpArticles.filter(article => 
                (article.role === userRole || article.role === 'both') &&
                article.category === selectedCategory
            );
            setSearchResults(filtered);
        } else {
            // Show featured articles for the selected role
            const featured = helpArticles.filter(article => 
                (article.role === userRole || article.role === 'both')
            ).slice(0, 6);
            setSearchResults(featured);
        }
    }, [searchQuery, userRole, selectedCategory]);

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
        setSearchQuery(''); // Clear search when changing categories
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Header Section */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">MoreVans Help Center</h1>
                <p className="text-gray-600 text-lg">Find answers or contact our support team for assistance</p>
            </div>

            {/* Help Center Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl mb-16">
                {/* Role Selector */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex p-1 bg-gray-100 rounded-lg">
                        <button 
                            className={`px-4 py-2 rounded-md ${userRole === 'customer' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                            onClick={() => setUserRole('customer')}
                        >
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            Customer Help
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-md ${userRole === 'provider' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                            onClick={() => setUserRole('provider')}
                        >
                            <FontAwesomeIcon icon={faTruck} className="mr-2" />
                            Provider Help
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search help articles..."
                            className="w-full p-4 pl-12 border rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`p-4 rounded-lg flex flex-col items-center text-center transition-colors ${
                                selectedCategory === category.id 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white hover:bg-gray-50'
                            }`}
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            <FontAwesomeIcon 
                                icon={category.icon} 
                                className={`text-2xl mb-2 ${selectedCategory === category.id ? 'text-white' : 'text-blue-600'}`} 
                            />
                            <span className="font-medium">{category.name}</span>
                        </button>
                    ))}
                </div>

                {/* Results Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">
                        {searchQuery 
                            ? `Search Results (${searchResults.length})` 
                            : selectedCategory 
                                ? `${categories.find(c => c.id === selectedCategory)?.name} Articles` 
                                : 'Popular Help Articles'}
                    </h3>

                    {searchResults.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {searchResults.map(article => (
                                <Link 
                                    to={article.url} 
                                    key={article.id}
                                    className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <h4 className="font-medium text-blue-600 mb-2">{article.title}</h4>
                                    <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
                                    <div className="flex items-center text-blue-500 text-sm">
                                        <FontAwesomeIcon icon={faBook} className="mr-2" /> Read article
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-gray-400 text-4xl mb-3" />
                            <h4 className="font-medium text-lg mb-1">No articles found</h4>
                            <p className="text-gray-500">
                                Try adjusting your search terms or browsing by category
                            </p>
                        </div>
                    )}
                </div>

                {/* Still Need Help Section */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6 text-center">
                    <FontAwesomeIcon icon={faQuestionCircle} className="text-blue-500 text-xl mb-2" />
                    <p className="text-gray-700">
                        Can't find what you're looking for? Contact our support team for personalized assistance.
                    </p>
                </div>
            </div>

            {/* Contact Methods Grid */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Direct Support Options</h2>
                <p className="text-gray-600">Get in touch with our support team through your preferred channel</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-blue-50 p-6 rounded-xl text-center">
                    <div className="inline-block bg-blue-600 p-4 rounded-full mb-4">
                        <FontAwesomeIcon icon={faHeadset} className="text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                    <p className="text-gray-600 mb-4">Instant connection with support agents</p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Start Chat</button>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <div className="inline-block bg-gray-700 p-4 rounded-full mb-4">
                        <FontAwesomeIcon icon={faEnvelope} className="text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                    <p className="text-gray-600 mb-4">Typically responds within 2 hours</p>
                    <a href="mailto:support@company.com" className="text-blue-600 hover:underline">
                        support@company.com
                    </a>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <div className="inline-block bg-gray-700 p-4 rounded-full mb-4">
                        <FontAwesomeIcon icon={faPhone} className="text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
                    <p className="text-gray-600 mb-4">24/7 toll-free number</p>
                    <a href="tel:+18005551234" className="text-blue-600 hover:underline">
                        +1 (800) 555-1234
                    </a>
                </div>
            </div>

            {/* Support Form + Info */}
            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-white p-8 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                        <FontAwesomeIcon icon={faLifeRing} className="text-blue-600" />
                        Support Request Form
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Subject</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Message</label>
                            <textarea
                                rows={5}
                                required
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Additional Info */}
                <div className="space-y-8">
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faClock} className="text-gray-600" />
                            Support Hours
                        </h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>• 24/7 Emergency Support</li>
                            <li>• Phone Support: Always available</li>
                            <li>• Email Support: Responses within 2 hours</li>
                            <li>• Live Chat: Mon-Fri 8AM-8PM EST</li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-600" />
                            Headquarters
                        </h3>
                        <address className="not-italic text-gray-600">
                            123 Tech Street
                            <br />
                            Silicon Valley, CA 94043
                            <br />
                            United States
                        </address>
                        <div className="mt-4 aspect-video bg-gray-200 rounded-lg overflow-hidden">
                            <iframe title="Office Location" width="100%" height="100%" src="https://maps.google.com/maps?q=Silicon+Valley&output=embed" className="border-0"></iframe>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Common Solutions Section */}
            <div className="mt-16 text-center">
                <h2 className="text-2xl font-semibold mb-4">Common Solutions</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { title: 'Password Reset', category: 'account', anchor: 'password-reset' },
                        { title: 'Billing Issues', category: 'billing', anchor: 'billing-issues' },
                        { title: 'Account Recovery', category: 'security', anchor: 'account-recovery' },
                        { title: 'Raise a Dispute', path: '/disputes', isFullPath: true },
                    ].map((solution) => (
                        <Link 
                            key={solution.title} 
                            to={solution.isFullPath ? solution.path : `/faq?category=${solution.category}#${solution.anchor}`} 
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                            <span className="group-hover:text-blue-600 transition-colors">{solution.title}</span>
                            <span className="ml-2 text-blue-600">→</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactSupportPage;
