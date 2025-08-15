// Geocoding Service for address lookup functionality
// Extracted from requestUserDetailForm.tsx

import axiosInstance from "./axiosInstance";

export interface AddressOption {
    line1: string;
    line2?: string;
    city: string;
    county?: string;
    postcode: string;
    organisation_name?: string;
    building_number?: string;
    building_name?: string;
    thoroughfare?: string;
    displayText: string;
    place_id?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface PostcodeValidationResult {
    isValid: boolean;
    message?: string;
}

export interface AddressSearchResult {
    addresses: AddressOption[];
    error?: string;
}

export interface ComprehensivePostcodeValidation {
    isValid: boolean;
    message?: string;
    postcode?: string;
    formatted_postcode?: string;
    area?: string;
    district?: string;
    sector?: string;
    unit?: string;
}

class GeocodingService {
    private baseUrl = 'http://localhost:8000';

    /**
     * Generate session token for Google Places API billing optimization
     */
    private generateSessionToken(): string {
        return 'session_' + Math.random().toString(36).substr(2, 20);
    }

    /**
     * Format postcode to standard UK format
     */
    formatPostcode(postcode: string): string {
        const clean = postcode.replace(/\s+/g, '').toUpperCase();
        if (clean.length > 3) {
            return clean.slice(0, -3) + ' ' + clean.slice(-3);
        }
        return clean;
    }

    /**
     * Validate UK postcode format
     */
    async validatePostcode(postcode: string): Promise<PostcodeValidationResult> {
        try {
            const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();

            // Basic UK postcode validation
            const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
            if (!ukPostcodeRegex.test(cleanPostcode)) {
                return { isValid: false, message: 'Please enter a valid UK postcode' };
            }

            return { isValid: true };
        } catch (error) {
            console.error('Error validating postcode:', error);
            return { isValid: false, message: 'Error validating postcode' };
        }
    }

    /**
     * Search for postcode suggestions as user types
     */
    async searchPostcodeSuggestions(query: string): Promise<string[]> {
        if (query.length < 2) {
            return [];
        }

        try {
            const response = await axiosInstance.get(`/geocoding/postcode-suggestions/?q=${encodeURIComponent(query)}`);
            
            if (response.status === 200) {
                const data = response.data;
                return data.suggestions || [];
            }
            
            return [];
        } catch (error) {
            console.error('Error searching postcodes:', error);
            return [];
        }
    }

    /**
     * Comprehensive postcode validation using backend API
     */
    async validatePostcodeComprehensive(postcode: string): Promise<ComprehensivePostcodeValidation> {
        try {
            const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
            console.log(`🔍 Validating postcode comprehensively: ${cleanPostcode}`);

            const response = await axiosInstance.get(`/locations/validate-postcode-comprehensive/${cleanPostcode}/`);
            
            if (response.status === 200) {
                const data = response.data;
                console.log('✅ Comprehensive postcode validation response:', data);
                return data;
            }
            
            return { isValid: false, message: 'Failed to validate postcode' };
        } catch (error) {
            console.error('Error validating postcode comprehensively:', error);
            return { isValid: false, message: 'Error validating postcode' };
        }
    }

    /**
     * Fetch addresses for a specific postcode using backend API
     */
    async fetchAddressesForPostcode(postcode: string): Promise<AddressSearchResult> {
        try {
            console.log(`🔍 Fetching addresses for postcode: ${postcode}`);

            const response = await axiosInstance.get(`/geocoding/postcode-addresses-demo/?postcode=${encodeURIComponent(postcode)}`);

            if (response.status === 200) {
                const data = response.data;
                console.log('🏠 Backend API Response:', data);

                if (data.addresses && data.addresses.length > 0) {
                    // Transform backend response to AddressOption format
                    const addresses: AddressOption[] = data.addresses.map((addr: any) => ({
                        line1: addr.main_text || addr.formatted_address?.split(',')[0] || '',
                        line2: '',
                        city: addr.secondary_text?.split(',')[0] || 'London',
                        county: '',
                        postcode: postcode,
                        organisation_name: '',
                        displayText: addr.formatted_address || `${addr.main_text}, ${addr.secondary_text}`,
                        place_id: addr.place_id, // Preserve place_id for place details lookup
                    }));

                    console.log(`✅ Successfully loaded ${addresses.length} addresses for postcode: ${postcode}`);
                    return { addresses };
                }
            }

            console.warn('No addresses found via backend API');
            return { 
                addresses: [], 
                error: 'No addresses found for this postcode. You can enter your address manually.' 
            };
        } catch (error) {
            console.error('Error fetching addresses from backend:', error);
            return { 
                addresses: [], 
                error: 'Error loading addresses from backend. You can enter your address manually.' 
            };
        }
    }

    /**
     * Fetch comprehensive addresses for a specific postcode using backend API
     */
    async fetchAddressesComprehensive(postcode: string): Promise<AddressSearchResult> {
        try {
            console.log(`🔍 Fetching comprehensive addresses for postcode: ${postcode}`);

            const response = await axiosInstance.get(`/locations/postcode-addresses-comprehensive/${encodeURIComponent(postcode)}/`);

            if (response.status === 200) {
                const data = response.data;
                console.log('🏠 Comprehensive Backend API Response:', data);

                if (data.addresses && data.addresses.length > 0) {
                    // Transform backend response to AddressOption format based on new structure
                    const addresses: AddressOption[] = data.addresses.map((addr: any) => {
                        // Handle the new Google Maps API response structure
                        const addressLine1 = addr.address_line_1 || addr.main_text || addr.formatted_address?.split(',')[0] || '';
                        const addressLine2 = addr.address_line_2 || '';
                        const city = addr.city_town || addr.secondary_text?.split(',')[0] || 'London';
                        const county = addr.county || '';
                        const displayText = addr.formatted_address || `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ''}, ${city}`;

                        return {
                            line1: addressLine1,
                            line2: addressLine2,
                            city: city,
                            county: county,
                            postcode: addr.postcode || postcode,
                            organisation_name: addr.name || '',
                            displayText: displayText,
                            place_id: addr.place_id, // Preserve place_id for place details lookup
                            coordinates: addr.coordinates, // Include coordinates if available
                        };
                    });

                    console.log(`✅ Successfully loaded ${addresses.length} comprehensive addresses for postcode: ${postcode}`);
                    console.log('🏠 Transformed addresses:', addresses);
                    return { addresses };
                }
            }

            console.warn('No comprehensive addresses found via backend API');
            return { 
                addresses: [], 
                error: 'No addresses found for this postcode. You can enter your address manually.' 
            };
        } catch (error) {
            console.error('Error fetching comprehensive addresses from backend:', error);
            return { 
                addresses: [], 
                error: 'Error loading addresses from backend. You can enter your address manually.' 
            };
        }
    }

    /**
     * Get detailed address information using Google Place Details API via backend
     */
    async getPlaceDetails(placeId: string): Promise<AddressOption | null> {
        try {
            const sessionToken = this.generateSessionToken();
            console.log(`🔍 Getting place details for place_id: ${placeId} with session: ${sessionToken}`);

            const response = await axiosInstance.get(`/geocoding/google-place-details/?place_id=${encodeURIComponent(placeId)}&sessiontoken=${encodeURIComponent(sessionToken)}`);

            if (response.status === 200) {
                const data = response.data;
                console.log('🏠 Place Details Response:', data);

                if (data.result) {
                    const result = data.result;
                    const addressComponents = result.address_components || [];

                    // Extract address components
                    const getComponent = (type: string) => {
                        const component = addressComponents.find((comp: any) => comp.types.includes(type));
                        return component?.long_name || '';
                    };

                    // Build structured address
                    const streetNumber = getComponent('street_number');
                    const route = getComponent('route');
                    const line1 = `${streetNumber} ${route}`.trim();

                    const addressOption: AddressOption = {
                        line1: line1 || getComponent('premise') || result.formatted_address?.split(',')[0] || '',
                        line2: getComponent('subpremise') || getComponent('floor') || '',
                        city: getComponent('postal_town') || getComponent('locality') || getComponent('administrative_area_level_2') || '',
                        county: getComponent('administrative_area_level_1') || '',
                        postcode: getComponent('postal_code'),
                        organisation_name: getComponent('establishment') || getComponent('point_of_interest') || '',
                        building_name: getComponent('premise'),
                        building_number: streetNumber,
                        thoroughfare: route,
                        displayText: result.formatted_address || '',
                    };

                    console.log('✅ Structured Address Details:', addressOption);
                    return addressOption;
                }
            }

            console.warn('Failed to get place details');
            return null;
        } catch (error) {
            console.error('Error getting place details:', error);
            return null;
        }
    }

    /**
     * Complete postcode validation and address fetching workflow
     */
    async validateAndSearchPostcode(postcode: string): Promise<AddressSearchResult> {
        if (!postcode.trim()) {
            return { addresses: [] };
        }

        const formattedPostcode = this.formatPostcode(postcode);
        console.log(`🔍 Validating and searching postcode: ${formattedPostcode}`);

        try {
            // Validate postcode format
            const validation = await this.validatePostcode(formattedPostcode);

            if (!validation.isValid) {
                return { 
                    addresses: [], 
                    error: validation.message || 'Invalid postcode format' 
                };
            }

            // Fetch addresses from backend
            const result = await this.fetchAddressesForPostcode(formattedPostcode);
            
            if (result.addresses.length > 0) {
                console.log(`✅ Successfully loaded ${result.addresses.length} addresses for postcode: ${formattedPostcode}`);
            } else {
                console.log(`⚠️ No addresses found for postcode: ${formattedPostcode}`);
            }

            return result;
        } catch (error: any) {
            console.error('Error validating postcode or fetching addresses:', error);
            return { 
                addresses: [], 
                error: 'Error loading addresses from backend. You can enter your address manually.' 
            };
        }
    }

    /**
     * Complete comprehensive postcode validation and address fetching workflow
     */
    async validateAndSearchPostcodeComprehensive(postcode: string): Promise<AddressSearchResult> {
        if (!postcode.trim()) {
            return { addresses: [] };
        }

        const formattedPostcode = this.formatPostcode(postcode);
        console.log(`🔍 Validating and searching postcode comprehensively: ${formattedPostcode}`);

        try {
            // Use the new comprehensive validation endpoint that returns addresses directly
            const response = await axiosInstance.get(`/locations/validate-postcode-comprehensive/${encodeURIComponent(formattedPostcode)}/`);
            
            if (response.status === 200) {
                const data = response.data;
                console.log('🏠 Comprehensive validation response:', data);

                if (data.is_valid && data.addresses && data.addresses.length > 0) {
                    // Transform backend response to AddressOption format based on new structure
                    const addresses: AddressOption[] = data.addresses.map((addr: any) => {
                        // Handle the new Google Maps API response structure
                        const addressLine1 = addr.address_line_1 || addr.main_text || addr.formatted_address?.split(',')[0] || '';
                        const addressLine2 = addr.address_line_2 || '';
                        const city = addr.city_town || addr.secondary_text?.split(',')[0] || 'London';
                        const county = addr.county || '';
                        const displayText = addr.formatted_address || `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ''}, ${city}`;

                        return {
                            line1: addressLine1,
                            line2: addressLine2,
                            city: city,
                            county: county,
                            postcode: addr.postcode || formattedPostcode,
                            organisation_name: addr.name || '',
                            displayText: displayText,
                            place_id: addr.place_id, // Preserve place_id for place details lookup
                            coordinates: addr.coordinates, // Include coordinates if available
                        };
                    });

                    console.log(`✅ Successfully loaded ${addresses.length} addresses for postcode: ${formattedPostcode}`);
                    console.log('🏠 Transformed addresses:', addresses);
                    return { addresses };
                } else {
                    return { 
                        addresses: [], 
                        error: data.message || 'No addresses found for this postcode. You can enter your address manually.' 
                    };
                }
            } else {
                return { 
                    addresses: [], 
                    error: 'Failed to validate postcode. You can enter your address manually.' 
                };
            }
        } catch (error: any) {
            console.error('Error validating postcode or fetching addresses:', error);
            return { 
                addresses: [], 
                error: 'Error loading addresses from backend. You can enter your address manually.' 
            };
        }
    }

    /**
     * Enhanced address selection with place details lookup
     */
    async selectAddressWithDetails(address: AddressOption): Promise<AddressOption> {
        console.log(`🎯 Address selected:`, address);

        let finalAddress = address;

        // If we have a place_id, get detailed address information
        if (address.place_id) {
            console.log(`🔍 Fetching detailed address information for place_id: ${address.place_id}`);

            const detailedAddress = await this.getPlaceDetails(address.place_id);
            if (detailedAddress) {
                // Merge with original address, prioritizing detailed information
                finalAddress = {
                    ...address,
                    ...detailedAddress,
                    displayText: detailedAddress.displayText || address.displayText,
                    place_id: address.place_id, // Keep original place_id
                };

                console.log(`✅ Enhanced address with detailed information:`, finalAddress);
            } else {
                console.warn(`⚠️ Could not get detailed address, using original:`, address);
            }
        }

        // Enhanced console logging when address is selected
        console.log('\n🏠 Final Selected Address Details:');
        console.log(`   - Address: ${finalAddress.displayText}`);
        console.log(`   - Line 1: ${finalAddress.line1}`);
        if (finalAddress.line2) console.log(`   - Line 2: ${finalAddress.line2}`);
        console.log(`   - City: ${finalAddress.city}`);
        console.log(`   - Postcode: ${finalAddress.postcode}`);
        if (finalAddress.county) console.log(`   - County: ${finalAddress.county}`);
        if (finalAddress.organisation_name) console.log(`   - Organisation: ${finalAddress.organisation_name}`);
        console.log(`   - Source: ${finalAddress.place_id ? 'Google Place Details API' : 'Google Places Autocomplete'}`);
        console.log(''); // Empty line for readability

        return finalAddress;
    }
}

// Export singleton instance
const geocodingService = new GeocodingService();
export default geocodingService; 