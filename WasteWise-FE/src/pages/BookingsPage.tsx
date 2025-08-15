import React from 'react';
import BookingsList from '../components/ServiceRequest/Booking/BookingsList';

const BookingsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <BookingsList />
        </div>
    );
};

export default BookingsPage;
