import showMessage from './showMessage';

const renderErrorMessage = (error: any) => {
    console.log('the error1 .........', error);
    const parser = new DOMParser();
    const errorData = error.response?.data || 'An error occurred, please try again';
    const doc = parser.parseFromString(errorData, 'text/html');
    const errorMess = doc.querySelector('body')?.innerText || 'An error occurred';
    const errorMessage = error.response?.data.message ?? (errorMess.split('\n')[1] || errorMess);
    return errorMessage;
};

export default renderErrorMessage;