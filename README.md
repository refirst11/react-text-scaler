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

| Property          | Meaning                                                     |
| ----------------- | ----------------------------------------------------------- |
| target (required) | The scaling target element by tag, className or id          |
| pathname          | The dynamic pathname to render when placing at layout level |
| className         | Set the className of the TextScaler cmponent                |
| sliderColor       | Set the color of the slider                                 |
| sliderBorderColor | Set the border color of the slider                          |
| handleColor       | Set the color of the handle                                 |
| handleBorderColor | Set the border color of the handle                          |
