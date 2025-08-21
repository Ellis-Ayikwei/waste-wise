"""
Paystack Payment Service
Handles all Paystack payment operations for the Wasgo platform
"""

import json
import hmac
import hashlib
import requests
from decimal import Decimal
from typing import Dict, Optional, Any, List
from django.conf import settings
from django.utils import timezone
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class PaystackService:
    """
    Service class for handling Paystack payment operations
    """
    
    def __init__(self):
        self.secret_key = getattr(settings, 'PAYSTACK_SECRET_KEY', '')
        self.public_key = getattr(settings, 'PAYSTACK_PUBLIC_KEY', '')
        self.base_url = 'https://api.paystack.co'
        self.headers = {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json',
        }
        
        if not self.secret_key:
            logger.warning("Paystack secret key not configured")
    
    def _make_request(self, method: str, endpoint: str, data: Dict = None) -> Dict:
        """
        Make HTTP request to Paystack API
        """
        url = f"{self.base_url}{endpoint}"
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=self.headers, params=data)
            elif method == 'POST':
                response = requests.post(url, headers=self.headers, json=data)
            elif method == 'PUT':
                response = requests.put(url, headers=self.headers, json=data)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Paystack API request failed: {str(e)}")
            raise Exception(f"Payment service error: {str(e)}")
    
    def verify_webhook_signature(self, payload: str, signature: str) -> bool:
        """
        Verify Paystack webhook signature
        """
        computed_signature = hmac.new(
            self.secret_key.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha512
        ).hexdigest()
        
        return computed_signature == signature
    
    def initialize_transaction(
        self,
        email: str,
        amount: Decimal,
        reference: str = None,
        callback_url: str = None,
        metadata: Dict = None,
        channels: List[str] = None
    ) -> Dict:
        """
        Initialize a payment transaction
        
        Args:
            email: Customer email
            amount: Amount in Naira (will be converted to kobo)
            reference: Unique transaction reference
            callback_url: URL to redirect after payment
            metadata: Additional transaction metadata
            channels: Payment channels to allow ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
        
        Returns:
            Dict containing authorization_url and access_code
        """
        try:
            # Convert amount to kobo (smallest currency unit)
            amount_in_kobo = int(amount * 100)
            
            data = {
                'email': email,
                'amount': amount_in_kobo,
            }
            
            if reference:
                data['reference'] = reference
            
            if callback_url:
                data['callback_url'] = callback_url
            
            if metadata:
                data['metadata'] = metadata
            
            if channels:
                data['channels'] = channels
            
            response = self._make_request('POST', '/transaction/initialize', data)
            
            if response.get('status'):
                logger.info(f"Transaction initialized: {response['data'].get('reference')}")
                return response['data']
            else:
                raise Exception(response.get('message', 'Failed to initialize transaction'))
                
        except Exception as e:
            logger.error(f"Error initializing transaction: {str(e)}")
            raise
    
    def verify_transaction(self, reference: str) -> Dict:
        """
        Verify a transaction status
        
        Args:
            reference: Transaction reference
        
        Returns:
            Dict containing transaction details
        """
        try:
            response = self._make_request('GET', f'/transaction/verify/{reference}')
            
            if response.get('status'):
                logger.info(f"Transaction verified: {reference}")
                return response['data']
            else:
                raise Exception(response.get('message', 'Failed to verify transaction'))
                
        except Exception as e:
            logger.error(f"Error verifying transaction {reference}: {str(e)}")
            raise
    
    def create_customer(
        self,
        email: str,
        first_name: str = None,
        last_name: str = None,
        phone: str = None,
        metadata: Dict = None
    ) -> Dict:
        """
        Create a customer on Paystack
        
        Args:
            email: Customer email
            first_name: Customer first name
            last_name: Customer last name
            phone: Customer phone number
            metadata: Additional customer metadata
        
        Returns:
            Dict containing customer details
        """
        try:
            data = {'email': email}
            
            if first_name:
                data['first_name'] = first_name
            
            if last_name:
                data['last_name'] = last_name
            
            if phone:
                data['phone'] = phone
            
            if metadata:
                data['metadata'] = metadata
            
            response = self._make_request('POST', '/customer', data)
            
            if response.get('status'):
                logger.info(f"Customer created: {email}")
                return response['data']
            else:
                raise Exception(response.get('message', 'Failed to create customer'))
                
        except Exception as e:
            logger.error(f"Error creating customer {email}: {str(e)}")
            raise
    
    def get_customer(self, email_or_code: str) -> Dict:
        """
        Get customer details
        
        Args:
            email_or_code: Customer email or customer code
        
        Returns:
            Dict containing customer details
        """
        try:
            response = self._make_request('GET', f'/customer/{email_or_code}')
            
            if response.get('status'):
                return response['data']
            else:
                raise Exception(response.get('message', 'Customer not found'))
                
        except Exception as e:
            logger.error(f"Error getting customer {email_or_code}: {str(e)}")
            raise
    
    def charge_authorization(
        self,
        authorization_code: str,
        email: str,
        amount: Decimal,
        reference: str = None,
        metadata: Dict = None
    ) -> Dict:
        """
        Charge a customer using saved authorization
        
        Args:
            authorization_code: Authorization code from previous transaction
            email: Customer email
            amount: Amount in Naira
            reference: Unique transaction reference
            metadata: Additional transaction metadata
        
        Returns:
            Dict containing transaction details
        """
        try:
            amount_in_kobo = int(amount * 100)
            
            data = {
                'authorization_code': authorization_code,
                'email': email,
                'amount': amount_in_kobo,
            }
            
            if reference:
                data['reference'] = reference
            
            if metadata:
                data['metadata'] = metadata
            
            response = self._make_request('POST', '/transaction/charge_authorization', data)
            
            if response.get('status'):
                logger.info(f"Authorization charged successfully: {reference}")
                return response['data']
            else:
                raise Exception(response.get('message', 'Failed to charge authorization'))
                
        except Exception as e:
            logger.error(f"Error charging authorization: {str(e)}")
            raise
    
    def create_refund(
        self,
        transaction_reference: str,
        amount: Optional[Decimal] = None,
        currency: str = 'NGN',
        customer_note: str = None,
        merchant_note: str = None
    ) -> Dict:
        """
        Create a refund for a transaction
        
        Args:
            transaction_reference: Reference of transaction to refund
            amount: Amount to refund (None for full refund)
            currency: Currency code
            customer_note: Note to customer
            merchant_note: Internal note
        
        Returns:
            Dict containing refund details
        """
        try:
            data = {'transaction': transaction_reference}
            
            if amount:
                data['amount'] = int(amount * 100)  # Convert to kobo
            
            if currency:
                data['currency'] = currency
            
            if customer_note:
                data['customer_note'] = customer_note
            
            if merchant_note:
                data['merchant_note'] = merchant_note
            
            response = self._make_request('POST', '/refund', data)
            
            if response.get('status'):
                logger.info(f"Refund created for transaction: {transaction_reference}")
                return response['data']
            else:
                raise Exception(response.get('message', 'Failed to create refund'))
                
        except Exception as e:
            logger.error(f"Error creating refund for {transaction_reference}: {str(e)}")
            raise
    
    def create_subscription_plan(
        self,
        name: str,
        amount: Decimal,
        interval: str,
        description: str = None,
        currency: str = 'NGN',
        invoice_limit: int = None
    ) -> Dict:
        """
        Create a subscription plan
        
        Args:
            name: Plan name
            amount: Amount per interval
            interval: Billing interval (hourly, daily, weekly, monthly, annually)
            description: Plan description
            currency: Currency code
            invoice_limit: Number of invoices to generate
        
        Returns:
            Dict containing plan details
        """
        try:
            data = {
                'name': name,
                'amount': int(amount * 100),  # Convert to kobo
                'interval': interval,
            }
            
            if description:
                data['description'] = description
            
            if currency:
                data['currency'] = currency
            
            if invoice_limit:
                data['invoice_limit'] = invoice_limit
            
            response = self._make_request('POST', '/plan', data)
            
            if response.get('status'):
                logger.info(f"Subscription plan created: {name}")
                return response['data']
            else:
                raise Exception(response.get('message', 'Failed to create plan'))
                
        except Exception as e:
            logger.error(f"Error creating subscription plan {name}: {str(e)}")
            raise
    
    def create_subscription(
        self,
        customer: str,
        plan: str,
        authorization: str = None,
        start_date: datetime = None
    ) -> Dict:
        """
        Create a subscription for a customer
        
        Args:
            customer: Customer email or code
            plan: Plan code
            authorization: Authorization code (for recurring charge)
            start_date: Subscription start date
        
        Returns:
            Dict containing subscription details
        """
        try:
            data = {
                'customer': customer,
                'plan': plan,
            }
            
            if authorization:
                data['authorization'] = authorization
            
            if start_date:
                data['start_date'] = start_date.isoformat()
            
            response = self._make_request('POST', '/subscription', data)
            
            if response.get('status'):
                logger.info(f"Subscription created for customer: {customer}")
                return response['data']
            else:
                raise Exception(response.get('message', 'Failed to create subscription'))
                
        except Exception as e:
            logger.error(f"Error creating subscription for {customer}: {str(e)}")
            raise
    
    def list_banks(self, country: str = 'nigeria') -> List[Dict]:
        """
        Get list of banks for account verification
        
        Args:
            country: Country to get banks for
        
        Returns:
            List of bank dictionaries
        """
        try:
            response = self._make_request('GET', f'/bank?country={country}')
            
            if response.get('status'):
                return response['data']
            else:
                raise Exception(response.get('message', 'Failed to get banks'))
                
        except Exception as e:
            logger.error(f"Error getting banks: {str(e)}")
            raise
    
    def resolve_account_number(
        self,
        account_number: str,
        bank_code: str
    ) -> Dict:
        """
        Resolve/verify a bank account number
        
        Args:
            account_number: Account number to verify
            bank_code: Bank code
        
        Returns:
            Dict containing account details
        """
        try:
            params = {
                'account_number': account_number,
                'bank_code': bank_code
            }
            
            response = self._make_request('GET', '/bank/resolve', params)
            
            if response.get('status'):
                logger.info(f"Account resolved: {account_number}")
                return response['data']
            else:
                raise Exception(response.get('message', 'Failed to resolve account'))
                
        except Exception as e:
            logger.error(f"Error resolving account {account_number}: {str(e)}")
            raise
    
    def create_transfer_recipient(
        self,
        name: str,
        account_number: str,
        bank_code: str,
        currency: str = 'NGN',
        description: str = None,
        metadata: Dict = None
    ) -> Dict:
        """
        Create a transfer recipient for payouts
        
        Args:
            name: Recipient name
            account_number: Recipient account number
            bank_code: Recipient bank code
            currency: Currency code
            description: Recipient description
            metadata: Additional metadata
        
        Returns:
            Dict containing recipient details
        """
        try:
            data = {
                'type': 'nuban',  # Nigerian bank account
                'name': name,
                'account_number': account_number,
                'bank_code': bank_code,
                'currency': currency,
            }
            
            if description:
                data['description'] = description
            
            if metadata:
                data['metadata'] = metadata
            
            response = self._make_request('POST', '/transferrecipient', data)
            
            if response.get('status'):
                logger.info(f"Transfer recipient created: {name}")
                return response['data']
            else:
                raise Exception(response.get('message', 'Failed to create recipient'))
                
        except Exception as e:
            logger.error(f"Error creating transfer recipient {name}: {str(e)}")
            raise
    
    def initiate_transfer(
        self,
        amount: Decimal,
        recipient: str,
        reason: str = None,
        reference: str = None
    ) -> Dict:
        """
        Initiate a transfer to a recipient
        
        Args:
            amount: Amount to transfer
            recipient: Recipient code
            reason: Transfer reason
            reference: Unique transfer reference
        
        Returns:
            Dict containing transfer details
        """
        try:
            data = {
                'source': 'balance',
                'amount': int(amount * 100),  # Convert to kobo
                'recipient': recipient,
            }
            
            if reason:
                data['reason'] = reason
            
            if reference:
                data['reference'] = reference
            
            response = self._make_request('POST', '/transfer', data)
            
            if response.get('status'):
                logger.info(f"Transfer initiated to recipient: {recipient}")
                return response['data']
            else:
                raise Exception(response.get('message', 'Failed to initiate transfer'))
                
        except Exception as e:
            logger.error(f"Error initiating transfer to {recipient}: {str(e)}")
            raise
    
    def get_balance(self) -> Dict:
        """
        Get account balance
        
        Returns:
            Dict containing balance information
        """
        try:
            response = self._make_request('GET', '/balance')
            
            if response.get('status'):
                return response['data']
            else:
                raise Exception(response.get('message', 'Failed to get balance'))
                
        except Exception as e:
            logger.error(f"Error getting balance: {str(e)}")
            raise