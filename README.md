# react-text-scaler

[![Release Status](https://img.shields.io/github/release/su-pull/react-text-scaler.svg)](https://github.com/su-pull/react-text-scaler/releases/latest)
[![Minzip Size](https://img.shields.io/bundlephobia/minzip/react-text-scaler)](https://bundlephobia.com/package/react-text-scaler)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This is React component, for text scaling support mini and big text size readability.

## Installation

```sh
npm install react-text-scaler
```

## Usage

```tsx
import { TextScaler } from 'react-text-scaler'

const MyComponent = () => {
  return <TextScaler scaleRange={20} stickSize={10} />
}
```

## Instructions

Renders the Based on font size of body the main element's texts.  
Font size is Absolute values are supported.

## Properties

| Property              | Property Meaning                             |
| --------------------- | -------------------------------------------- |
| scaleRange (required) | The scale range for px size                  |
| stickSize (required)  | The stick width for number                   |
| className             | Set the className of the TextScaler cmponent |

## License

The MIT License.
