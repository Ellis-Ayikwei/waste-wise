# Pricing Factor Form Components

This directory contains the refactored components for the PricingFactorForm, broken down into smaller, more manageable pieces.

## Component Structure

### Core Components

- **BasicInfoFields.tsx** - Common fields for all pricing factors (name, description, category, is_active)
- **DistanceFields.tsx** - Fields specific to distance-based pricing
- **WeightFields.tsx** - Fields specific to weight-based pricing
- **TimeFields.tsx** - Fields specific to time-based pricing (peak hours, weekends, holidays)
- **WeatherFields.tsx** - Fields specific to weather-based pricing
- **VehicleTypeFields.tsx** - Fields specific to vehicle type pricing

### Usage

```tsx
import { BasicInfoFields, DistanceFields, WeightFields } from './components';

// In your form component
<BasicInfoFields formik={formik} selectedCategory={category} onCategoryChange={handleCategoryChange} />
<DistanceFields formik={formik} />
```

### Benefits of Refactoring

1. **Maintainability** - Each component is focused on a specific concern
2. **Reusability** - Components can be reused in other forms
3. **Testability** - Easier to write unit tests for individual components
4. **Readability** - Smaller, more focused components are easier to understand
5. **Performance** - Only the relevant fields are rendered based on category selection

### Adding New Field Components

To add a new field component:

1. Create a new file (e.g., `InsuranceFields.tsx`)
2. Follow the same pattern as existing components
3. Export it from `index.ts`
4. Add it to the main form's `renderCategoryFields` function

### Component Pattern

All field components follow this pattern:

```tsx
import React from 'react';
import { FormikProps } from 'formik';

interface ComponentNameProps {
    formik: FormikProps<any>;
}

const ComponentName: React.FC<ComponentNameProps> = ({ formik }) => {
    const renderErrorMessage = (error: any) => {
        if (typeof error === 'string') {
            return error;
        }
        return '';
    };

    return (
        // JSX for the specific fields
    );
};

export default ComponentName;
``` 