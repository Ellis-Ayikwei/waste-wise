import showMessage from './showMessage';

const renderErrorMessage = (error: any) => {
    console.log('the error1 .........', error);
    
    // Handle different error formats
    if (!error) {
        return 'An error occurred, please try again';
    }

    // If error is already a string, return it
    if (typeof error === 'string') {
        return error;
    }

    // Handle error.response.data format
    if (error.response?.data) {
        const errorData = error.response.data;
        
        // If it's a string, try to parse HTML or return as is
        if (typeof errorData === 'string') {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(errorData, 'text/html');
                const errorMess = doc.querySelector('body')?.innerText || errorData;
                return errorMess.split('\n')[1] || errorMess;
            } catch (e) {
                return errorData;
            }
        }
        
        // If it's an object with message property
        if (typeof errorData === 'object' && errorData.message) {
            return errorData.message;
        }
        
        // If it's an object with detail property (Django REST Framework)
        if (typeof errorData === 'object' && errorData.detail) {
            return errorData.detail;
        }
        
        // If it's an object with error property
        if (typeof errorData === 'object' && errorData.error) {
            return errorData.error;
        }
        
        // If it's an object with non_field_errors (Django form errors)
        if (typeof errorData === 'object' && errorData.non_field_errors) {
            return Array.isArray(errorData.non_field_errors) 
                ? errorData.non_field_errors.join(', ') 
                : errorData.non_field_errors;
        }
        
        // If it's an object with field-specific errors
        if (typeof errorData === 'object') {
            const fieldErrors = Object.entries(errorData)
                .filter(([key, value]) => value && typeof value === 'object')
                .map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return `${key}: ${value.join(', ')}`;
                    }
                    return `${key}: ${value}`;
                })
                .join(', ');
            
            if (fieldErrors) {
                return fieldErrors;
            }
        }
        
        // If it's an object, try to stringify it
        if (typeof errorData === 'object') {
            return JSON.stringify(errorData);
        }
        
        return errorData;
    }
    
    // Handle error.message format
    if (error.message) {
        return error.message;
    }
    
    // Handle error.detail format
    if (error.detail) {
        return error.detail;
    }
    
    // Handle error.error format
    if (error.error) {
        return error.error;
    }
    
    // If all else fails, return a generic message
    return 'An error occurred, please try again';
};

export default renderErrorMessage;