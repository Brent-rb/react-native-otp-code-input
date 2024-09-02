# react-native-code-input

A code input component for react native

## Installation

```sh
npm install react-native-otp-code-input
```

## Usage

```tsx
import { CodeInput } from 'react-native-otp-code-input'

const [code, setCode] = useState<string>('')

<CodeInput
	value={code}
	onValueChange={(code) => {
		console.log(`Code changed ${code}`)
		setCode(code)
	}}
	onFilled={(code) => {
		console.log(`Code filled ${code}`)
	}}
	length={6}
/>
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
