import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faChevronDown, 
  faChevronUp, 
  faSearch, 
  faSpinner, 
  faThumbsUp, 
  faReply,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

// Types for reviews
interface ReviewAttachment {
  id: string;
  url: string;
  thumbnail: string;
}

interface Review {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  bookingId: string;
  serviceType: string;
  serviceDate: string;
  rating: number;
  title: string;
  comment: string;
  recommendProvider: boolean;
  isPublic: boolean;
  createdAt: string;
  attachments: ReviewAttachment[];
  response?: {
    text: string;
    createdAt: string;
  };
}

// Rating stats component
const RatingStats: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  
  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</span>
            <span className="text-yellow-400 ml-2">
              <FontAwesomeIcon icon={faStar} />
            </span>
            <span className="ml-2 text-gray-500 dark:text-gray-400">out of 5</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{reviews.length} reviews total</p>
        </div>

        <div className="w-full sm:w-2/3">
          {ratingDistribution.map((item) => (
            <div key={item.rating} className="flex items-center mb-2">
              <div className="w-12 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {item.rating} stars
              </div>
              <div className="flex-grow mx-3">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-sm text-gray-600 dark:text-gray-400">
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Single review component
const ReviewCard: React.FC<{ 
  review: Review; 
  onRespondClick: (reviewId: string) => void;
}> = ({ review, onRespondClick }) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const commentIsTruncated = review.comment.length > 250;
  
  const displayedComment = showFullComment || !commentIsTruncated
    ? review.comment
    : `${review.comment.substring(0, 250)}...`;
    
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {review.customerAvatar ? (
            <img 
              src={review.customerAvatar} 
              alt={review.customerName} 
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center mr-3">
              {review.customerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">{review.customerName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon 
                key={i} 
                icon={faStar} 
                className={i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} 
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Booking Info */}
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
        <span>Service: {review.serviceType}</span>
        <span className="mx-2">•</span>
        <span>Date: {new Date(review.serviceDate).toLocaleDateString()}</span>
        <span className="mx-2">•</span>
        <span>Booking #{review.bookingId.substring(0, 8)}</span>
      </div>
      
      {/* Review Content */}
      <h4 className="font-medium text-lg text-gray-800 dark:text-white mb-2">{review.title}</h4>
      <p className="text-gray-700 dark:text-gray-300 mb-3">{displayedComment}</p>
      
      {commentIsTruncated && (
        <button 
          onClick={() => setShowFullComment(!showFullComment)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center"
        >
          {showFullComment ? 'Show less' : 'Read more'}
          <FontAwesomeIcon 
            icon={showFullComment ? faChevronUp : faChevronDown} 
            className="ml-1 text-xs"
          />
        </button>
      )}
      
      {/* Review Photos */}
      {review.attachments.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photos from customer</p>
          <div className="flex flex-wrap gap-2">
            {review.attachments.map((attachment) => (
              <img 
                key={attachment.id} 
                src={attachment.thumbnail} 
                alt="Review attachment" 
                className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-80"
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Customer Recommend */}
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${
          review.recommendProvider 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {review.recommendProvider 
            ? 'Would recommend to others' 
            : 'Would not recommend to others'}
        </span>
        <span className="ml-2">
          <FontAwesomeIcon 
            icon={faThumbsUp} 
            className={review.recommendProvider 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
            } 
          />
        </span>
      </div>
      
      {/* Provider Response */}
      {review.response ? (
        <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
          <div className="font-medium text-gray-800 dark:text-white mb-1">Your Response</div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{review.response.text}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Responded on {new Date(review.response.createdAt).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <button 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center text-sm font-medium"
            onClick={() => onRespondClick(review.id)}
          >
            <FontAwesomeIcon icon={faReply} className="mr-1" />
            Respond to this review
          </button>
        </div>
      )}
    </div>
  );
};

// Response Modal Component
interface ResponseModalProps {
  reviewId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewId: string, response: string) => void;
}

const ResponseModal: React.FC<ResponseModalProps> = ({ reviewId, isOpen, onClose, onSubmit }) => {
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return;
    
    setSubmitting(true);
    
    try {
      await onSubmit(reviewId, response);
      onClose();
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('There was a problem submitting your response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Respond to Review</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Your Response
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={4}
                placeholder="Write your response to this customer review..."
              ></textarea>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Your response will be public and visible to all users.
              </p>
            </div>
          </div>
          <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-800"
              disabled={submitting || !response.trim()}
            >
              {submitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Submitting...
                </>
              ) : 'Submit Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main component
const ProviderReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterResponded, setFilterResponded] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'rating_desc' | 'rating_asc'>('date_desc');
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    responded: 0
  });

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // In a real app, fetch from your API
        // Mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockReviews: Review[] = [
          {
            id: '1',
            customerId: 'c1',
            customerName: 'John Smith',
            customerAvatar: 'https://via.placeholder.com/150',
            bookingId: 'BK12345678',
            serviceType: 'Full House Move',
            serviceDate: '2025-03-10T14:00:00Z',
            rating: 5,
            title: 'Excellent service and professional team',
            comment: 'I was extremely pleased with the moving service. The team arrived on time, handled all items with care, and completed the move faster than expected. They were professional, courteous, and went above and beyond. Would definitely use their services again and recommend to friends and family.',
            recommendProvider: true,
            isPublic: true,
            createdAt: '2025-03-12T18:30:00Z',
            attachments: [
              { id: 'a1', url: 'https://via.placeholder.com/800', thumbnail: 'https://via.placeholder.com/150' },
              { id: 'a2', url: 'https://via.placeholder.com/800', thumbnail: 'https://via.placeholder.com/150' }
            ],
            response: {
              text: 'Thank you so much for your kind review! We strive to provide the best service possible, and we\'re thrilled you had a positive experience. We appreciate your recommendation and look forward to serving you again in the future.',
              createdAt: '2025-03-13T10:15:00Z'
            }
          },
          {
            id: '2',
            customerId: 'c2',
            customerName: 'Sarah Johnson',
            bookingId: 'BK87654321',
            serviceType: 'Office Relocation',
            serviceDate: '2025-03-05T09:00:00Z',
            rating: 4,
            title: 'Good service with minor issues',
            comment: 'Overall, the move went well. The team was friendly and efficient. There were a couple minor scratches on one desk, but nothing major. The process was quick and they set everything up in the new office as requested. Would use them again with some extra padding for office furniture.',
            recommendProvider: true,
            isPublic: true,
            createdAt: '2025-03-07T13:45:00Z',
            attachments: [],
          },
          {
            id: '3',
            customerId: 'c3',
            customerName: 'Michael Brown',
            customerAvatar: 'https://via.placeholder.com/150',
            bookingId: 'BK24681012',
            serviceType: 'Studio Apartment Move',
            serviceDate: '2025-02-28T10:00:00Z',
            rating: 2,
            title: 'Delayed and unprepared team',
            comment: 'The moving team arrived 2 hours late with no advance notice. They seemed unprepared for the job and took much longer than quoted. Some items were handled roughly. Very disappointed with the service, especially considering the price paid.',
            recommendProvider: false,
            isPublic: true,
            createdAt: '2025-03-01T17:20:00Z',
            attachments: [
              { id: 'a3', url: 'https://via.placeholder.com/800', thumbnail: 'https://via.placeholder.com/150' }
            ]
          },
          {
            id: '4',
            customerId: 'c4',
            customerName: 'Emma Wilson',
            bookingId: 'BK13579246',
            serviceType: 'Furniture Delivery',
            serviceDate: '2025-03-15T13:30:00Z',
            rating: 5,
            title: 'Perfect delivery experience',
            comment: 'The delivery team was amazing! They called ahead, arrived on time, and carefully brought in my new furniture. They even helped position everything exactly where I wanted it and took away all the packaging. Excellent service!',
            recommendProvider: true,
            isPublic: true,
            createdAt: '2025-03-15T17:05:00Z',
            attachments: [],
            response: {
              text: 'Thank you for your wonderful review, Emma! We\'re so happy to hear that our team provided you with excellent service. We appreciate your business and look forward to helping you again in the future.',
              createdAt: '2025-03-16T09:25:00Z'
            }
          },
          {
            id: '5',
            customerId: 'c5',
            customerName: 'David Lee',
            bookingId: 'BK97531086',
            serviceType: 'Piano Moving',
            serviceDate: '2025-03-08T11:00:00Z',
            rating: 3,
            title: 'Piano moved safely but communication was poor',
            comment: 'The team successfully moved my grand piano without any damage, which was my primary concern. However, communication before the move was lacking - had to call multiple times for confirmation and details. The team was also a bit rushed during the job.',
            recommendProvider: true,
            isPublic: true,
            createdAt: '2025-03-09T14:10:00Z',
            attachments: [],
          }
        ];
        
        setReviews(mockReviews);
        
        // Calculate stats
        const total = mockReviews.length;
        const average = mockReviews.reduce((sum, review) => sum + review.rating, 0) / total;
        const responded = mockReviews.filter(r => r.response).length;
        
        setStats({
          total,
          average,
          responded
        });
        
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);
  
  // Filter and sort reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === null || review.rating === filterRating;
    
    const matchesResponseFilter = 
      filterResponded === null || 
      (filterResponded === true && review.response) || 
      (filterResponded === false && !review.response);
    
    return matchesSearch && matchesRating && matchesResponseFilter;
  });
  
  // Sort reviews based on selected sort option
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'date_desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'date_asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'rating_desc':
        return b.rating - a.rating;
      case 'rating_asc':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const handleRespondClick = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setResponseModalOpen(true);
  };

  const handleSubmitResponse = async (reviewId: string, responseText: string) => {
    // In a real app, send this to your API
    console.log('Submitting response for review:', reviewId, responseText);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the reviews state with the new response
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          response: {
            text: responseText,
            createdAt: new Date().toISOString()
          }
        };
      }
      return review;
    }));
    
    setStats({
      ...stats,
      responded: stats.responded + 1
    });
  };

  // Calculate response rate
  const responseRate = stats.total > 0 ? (stats.responded / stats.total) * 100 : 0;
  
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Customer Reviews</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Average Rating</p>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.average.toFixed(1)}</span>
                <span className="text-yellow-400 ml-2">
                  <FontAwesomeIcon icon={faStar} />
                </span>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
              <FontAwesomeIcon icon={faStar} className="text-blue-500 dark:text-blue-400 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-lg">
              <FontAwesomeIcon icon={faThumbsUp} className="text-green-500 dark:text-green-400 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Response Rate</p>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{responseRate.toFixed(0)}%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  ({stats.responded}/{stats.total})
                </span>
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg">
              <FontAwesomeIcon icon={faReply} className="text-purple-500 dark:text-purple-400 text-xl" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Ratings Distribution */}
      <RatingStats reviews={reviews} />
      
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Rating Filter */}
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={filterRating === null ? '' : filterRating}
              onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          
          {/* Response Filter */}
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={filterResponded === null ? '' : filterResponded ? 'responded' : 'not_responded'}
              onChange={(e) => {
                if (e.target.value === '') setFilterResponded(null);
                else if (e.target.value === 'responded') setFilterResponded(true);
                else setFilterResponded(false);
              }}
            >
              <option value="">All Reviews</option>
              <option value="responded">Responded</option>
              <option value="not_responded">Not Responded</option>
            </select>
          </div>
          
          {/* Sort By */}
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="rating_desc">Highest Rating</option>
              <option value="rating_asc">Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-blue-600 dark:text-blue-400" />
        </div>
      ) : sortedReviews.length > 0 ? (
        <div>
          {sortedReviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onRespondClick={handleRespondClick} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 text-5xl mb-4">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">No reviews found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || filterRating || filterResponded !== null
              ? 'Try adjusting your filters to see more reviews'
              : 'You haven\'t received any customer reviews yet'}
          </p>
        </div>
      )}
      
      {/* Response Modal */}
      <ResponseModal
        reviewId={selectedReviewId || ''}
        isOpen={responseModalOpen}
        onClose={() => setResponseModalOpen(false)}
        onSubmit={handleSubmitResponse}
      />
      
      {/* Pagination for future implementation */}
      {sortedReviews.length > 0 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-1">
            <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">2</button>
            <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">3</button>
            <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
            <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">10</button>
            <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              Next
              <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProviderReviews;