export interface PaymentMethod {
    id: string;
    user: string;
    payment_type: 'card' | 'bank' | 'wallet';
    is_default: boolean;
    last_used: string | null;
    is_active: boolean;
    stripe_payment_method_id: string | null;
    stripe_customer_id: string | null;
    card_last_four: string | null;
    card_brand: string | null;
    card_expiry: string | null;
    card_country: string | null;
    bank_name: string | null;
    account_last_four: string | null;
    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: string;
    request: string;
    payment_method: string | null;
    amount: string;
    currency: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
    payment_type: 'deposit' | 'full_payment' | 'final_payment' | 'additional_fee' | 'refund';
    stripe_payment_intent_id: string | null;
    stripe_charge_id: string | null;
    stripe_refund_id: string | null;
    transaction_id: string | null;
    completed_at: string | null;
    failed_at: string | null;
    refunded_at: string | null;
    description: string;
    refund_reason: string;
    failure_reason: string;
    metadata: any;
    created_at: string;
    updated_at: string;
    // Computed fields for display
    customerName?: string;
    providerName?: string;
    bookingId?: string;
}

export interface Transaction {
    id: string;
    bookingId: string;
    customerId: string;
    customerName: string;
    providerId: string;
    providerName: string;
    type: 'payment' | 'refund' | 'payout' | 'fee';
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    paymentMethod: string;
    date: string;
    description: string;
    // Store original payment data for admin functions
    originalPayment?: Payment;
}

export interface RevenueStats {
    totalRevenue: number;
    platformFees: number;
    providerPayouts: number;
    netIncome: number;
    pendingPayments: number;
    refundsIssued: number;
    transactionCount: number;
    averageBookingValue: number;
    revenueByMonth: { [key: string]: number };
    revenueByPaymentMethod: { [key: string]: number };
}
