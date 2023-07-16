# react-text-scaler

This is a React component for text scalling accessibility.

## Usage

```tsx
import { TextScaler } from 'react-text-scaler'

const MyComponent = () => {
    const pathname = // useLocation...

    return <TextScaler target="main" pathname={pathname} />
}
```

## Properties

| Property            | Meaning                                                        |
| ------------------- | -------------------------------------------------------------- |
| pathname (required) | The current dynamically obtained pathname used for font sizing |
| target (required)   | The scaling target element by tag, className or id             |
| sliderColor         | Sets the color of the slider                                   |
| sliderBorderColor   | Sets the border color of the slider                            |
| handleColor         | Sets the color of the handle                                   |
| handleBorderColor   | Sets the border color of the handle                            |
