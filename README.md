# react-text-scaler

[![Release Status](https://img.shields.io/github/release/su-pull/react-text-scaler.svg)](https://github.com/su-pull/react-text-scaler/releases/latest)
[![Minzip Size](https://img.shields.io/bundlephobia/minzip/react-text-scaler)](https://bundlephobia.com/package/react-text-scaler)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This is React WEB component, for text scaling support accessibility.

It's scale an existing pixel, em and rem are not supported and reading body font-size of style, set as default size, that's why please set body to font-size in style.

## Installation

```sh
npm install react-text-scaler
```

## Usage

```tsx
import { TextScaler } from 'react-text-scaler'

const MyComponent = () => {
  return <TextScaler size={12} />
}
```

## Properties

| Property          | Property Meaning                                                                     |
| ----------------- | ------------------------------------------------------------------------------------ |
| target (required) | The scaling target element by tag, className or id                                   |
| size (required)   | The scale range for pixel size                                                       |
| pathname          | The dynamic pathname to static render when placing at layout level                   |
| className         | Set the className of the TextScaler cmponent as positioning and component text color |
| classBox          | Set the className of a box size and border and box-shadow                            |
| classSlider       | Set the className of the custmize a slider size and slider bacground color           |

## License

The MIT License.
