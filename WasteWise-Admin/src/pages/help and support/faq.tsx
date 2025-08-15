import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch,
  faChevronDown,
  faFileAlt,
  faCreditCard,
  faUser,
  faCog,
  faLock
} from '@fortawesome/free-solid-svg-icons';

type FAQItem = {
  question: string;
  answer: string;
  category: string;
  id: number;
  anchor: string;
};

const FAQPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Sample FAQ data with anchors
  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "How do I reset my password?",
      answer: "You can reset your password by visiting the account settings page...",
      category: "account",
      anchor: "password-reset"
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, MasterCard...",
      category: "billing",
      anchor: "payment-methods"
    },
    // Add more FAQ items...
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: faFileAlt },
    { id: 'account', name: 'Account', icon: faUser },
    { id: 'billing', name: 'Billing', icon: faCreditCard },
    { id: 'security', name: 'Security', icon: faLock },
    { id: 'settings', name: 'Settings', icon: faCog },
  ];

  // Handle URL parameters and anchors
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.some(cat => cat.id === categoryParam)) {
      setActiveCategory(categoryParam);
    }

    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Update URL when category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', activeCategory);
    }
    setSearchParams(searchParams);
  }, [activeCategory]);

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search help articles"
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-4 top-4 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`p-4 rounded-lg flex flex-col items-center transition-colors ${
              activeCategory === cat.id 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            aria-current={activeCategory === cat.id ? 'true' : undefined}
          >
            <FontAwesomeIcon icon={cat.icon} className="mb-2 text-lg" aria-hidden="true" />
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No results found for "{searchQuery}"
          </div>
        ) : (
          filteredFAQs.map((item) => (
            <div 
              key={item.id}
              id={item.anchor}
              className="border rounded-lg bg-white hover:border-blue-200 transition-colors scroll-mt-24"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => setExpandedQuestion(expandedQuestion === item.id ? null : item.id)}
                aria-expanded={expandedQuestion === item.id}
                aria-controls={`faq-answer-${item.id}`}
              >
                <span className="font-medium text-gray-800">{item.question}</span>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`transform transition-transform ${
                    expandedQuestion === item.id ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {expandedQuestion === item.id && (
                <div 
                  id={`faq-answer-${item.id}`}
                  className="px-6 py-4 border-t bg-gray-50"
                  role="region"
                >
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-12 text-center border-t pt-12">
        <h2 className="text-xl font-semibold mb-4">Still need help?</h2>
        <Link 
          to="/contact-support" 
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default FAQPage;