# react-text-scaler

[![Release Status](https://img.shields.io/github/release/su-pull/react-text-scaler.svg)](https://github.com/su-pull/react-text-scaler/releases/latest)
[![Minzip Size](https://img.shields.io/bundlephobia/minzip/react-text-scaler)](https://bundlephobia.com/package/react-text-scaler)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This is a React component for text scalling accessibility.

## Installation

```sh
npm install react-text-scaler
```

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
| top               | where the slider appears, default true                      |
| className         | Set the className of the TextScaler cmponent                |
| sliderColor       | Set the color of the slider                                 |
| sliderBorderColor | Set the border color of the slider                          |
| handleColor       | Set the color of the handle                                 |
| handleBorderColor | Set the border color of the handle                          |

## License

MIT License
