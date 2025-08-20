import React from 'react';
import { Star } from 'lucide-react';
import { Provider } from '../../types';
import { formatDate } from '../../utils';
import { StarRating } from '../../StarRating';


interface ReviewsTabProps {
  provider: Provider;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ provider }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
        <Star className="w-5 h-5 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
      </div>
      <div className="p-6">
        {provider.reviews && provider.reviews.length > 0 ? (
          <div className="space-y-6">
            {provider.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">{review.customerName}</div>
                  <div className="text-sm text-gray-500">{formatDate(review.date)}</div>
                </div>
                <StarRating rating={review.rating} />
                <p className="mt-2 text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No reviews found for this provider.
          </div>
        )}
      </div>
    </div>
  );
}; 