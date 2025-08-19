# Scroll to Top on Route Change - Solution

## Problem
When navigating between different pages in the React Router application, the page doesn't automatically scroll to the top. This is a common issue with React Router v6, which doesn't include automatic scroll restoration by default.

## Solution Implemented

### 1. Global Solution (Recommended)
Created a `ScrollToTopOnRouteChange` component that automatically scrolls to the top whenever the route changes.

**File:** `src/components/ScrollToTopOnRouteChange.tsx`
```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopOnRouteChange = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top when pathname changes
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; // This component doesn't render anything
};

export default ScrollToTopOnRouteChange;
```

**Integration:** Added to `src/App.tsx` to work globally across all routes.

### 2. Component-Level Solution (Optional)
Created a custom hook `useScrollToTop` that can be used in individual components if needed.

**File:** `src/hooks/useScrollToTop.tsx`
```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top when pathname changes
        window.scrollTo(0, 0);
    }, [pathname]);
};

export default useScrollToTop;
```

**Usage in components:**
```tsx
import useScrollToTop from '../../hooks/useScrollToTop';

const MyComponent = () => {
    useScrollToTop(); // Add this line to ensure scroll to top
    
    // ... rest of component
};
```

## How It Works

1. **Route Change Detection:** The component/hook uses `useLocation()` from React Router to detect when the pathname changes.

2. **Automatic Scroll:** When a route change is detected, `window.scrollTo(0, 0)` is called to scroll the page to the top.

3. **Global Coverage:** By adding the component to `App.tsx`, it works for all route changes throughout the application.

## Benefits

- ✅ **Automatic:** No manual intervention required
- ✅ **Global:** Works for all routes automatically
- ✅ **Lightweight:** Minimal performance impact
- ✅ **Flexible:** Can be used at component level if needed
- ✅ **Reliable:** Uses React Router's built-in location tracking

## Testing

To test the solution:
1. Navigate to any page with content that requires scrolling
2. Scroll down on the page
3. Navigate to a different page using the navigation menu
4. The new page should automatically start from the top

## Alternative Solutions

If you need more advanced scroll behavior, consider:

1. **Smooth Scrolling:** Use `window.scrollTo({ top: 0, behavior: 'smooth' })`
2. **Scroll Restoration:** Implement custom scroll position restoration
3. **React Router Scroll Restoration:** Use a third-party library like `react-router-scroll-restoration`

## Files Modified

- `src/components/ScrollToTopOnRouteChange.tsx` (new)
- `src/hooks/useScrollToTop.tsx` (new)
- `src/App.tsx` (modified)
- `src/pages/customer/SmartBins.tsx` (modified - added hook usage as example)
