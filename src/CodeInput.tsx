import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	Animated,
	StyleSheet,
	Text,
	TextInput,
	View,
	type TextInputProps,
	type TextStyle,
	type ViewStyle,
} from 'react-native'

export type CodeBoxProps = {
	value: string
	length: number
	isFocused: boolean

	onPress: () => void
	cellStyle?: ViewStyle
	focusedCellStyle?: ViewStyle
	textStyle?: TextStyle
	focusedTextStyle?: TextStyle
	cursorStyle?: ViewStyle
}

const CodeBox: React.FC<CodeBoxProps> = ({
	value,
	length,
	isFocused,
	onPress,

	cellStyle,
	focusedCellStyle,
	textStyle,
	focusedTextStyle,
	cursorStyle,
}) => {
	const blinkingAnimation = useMemo(() => new Animated.Value(1), [])
	const cursorIndex = Math.min(length - 1, value.length)

	useEffect(() => {
		if (!isFocused) {
			return
		}

		const anim = Animated.loop(
			Animated.sequence([
				Animated.timing(blinkingAnimation, {
					toValue: 0,
					duration: 500,
					useNativeDriver: true,
				}),
				Animated.timing(blinkingAnimation, {
					toValue: 1,
					duration: 500,
					useNativeDriver: true,
				}),
			])
		)

		anim.start()

		return () => {
			anim.stop()
		}
	}, [blinkingAnimation, isFocused])

	const Cells = useMemo(() => {
		const letters = []

		for (let i = 0; i < length; i++) {
			if (i < value.length) {
				letters.push(value.charAt(i))
			} else {
				letters.push('')
			}
		}

		return letters.map((value, index) => {
			const isActiveBox = isFocused && index === cursorIndex
			return (
				<View
					style={[
						styles.cellStyle,
						cellStyle,
						isActiveBox ? styles.focusedCellStyle : undefined,
						isActiveBox ? focusedCellStyle : undefined,
					]}
					onPointerUp={onPress}
					key={index}
				>
					<Text
						style={[
							styles.textStyle,
							textStyle,
							isActiveBox ? styles.focusedTextStyle : undefined,
							isActiveBox ? focusedTextStyle : undefined,
						]}
						key={index}
					>
						{value}
					</Text>
					{isActiveBox && (
						<Animated.View
							style={[
								{
									opacity: blinkingAnimation,
									backgroundColor:
										focusedTextStyle?.color ??
										textStyle?.color ??
										styles.focusedTextStyle.color ??
										styles.textStyle.color,
								},
								styles.cursor,
								cursorStyle,
							]}
						/>
					)}
				</View>
			)
		})
	}, [
		value,
		isFocused,
		length,
		blinkingAnimation,
		cellStyle,
		cursorIndex,
		focusedCellStyle,
		focusedTextStyle,
		cursorStyle,
		textStyle,
		onPress,
	])

	return <View style={[styles.cellContainer]}>{Cells}</View>
}

export type CodeInputProps = {
	autoFocus?: boolean
	autoBlur?: boolean

	value?: string
	onValueChange?: (code: string) => void
	onFilled?: (code: string) => void

	cellStyle?: ViewStyle
	focusedCellStyle?: ViewStyle
	textStyle?: TextStyle
	focusedTextStyle?: TextStyle
	cursorStyle?: ViewStyle

	keyboardType?: TextInputProps['keyboardType']
	textContentType?: TextInputProps['textContentType']

	length?: number
}

const CodeInput: React.FC<CodeInputProps> = ({
	autoBlur = true,
	autoFocus = false,
	value = '',
	onValueChange,
	onFilled,
	length = 6,

	cellStyle,
	focusedCellStyle,
	textStyle,
	focusedTextStyle,

	keyboardType = 'numeric',
	textContentType = 'oneTimeCode',
}) => {
	const textInputRef = useRef<TextInput>(null)

	const [isFocused, setIsFocused] = useState(autoFocus)
	const height = cellStyle?.height ?? styles.cellStyle.height
	const fontSize = textStyle?.fontSize ?? styles.textStyle.fontSize

	const fakeFocus = useCallback(() => {
		textInputRef.current?.focus()
	}, [textInputRef])

	const onTextChanged = useCallback(
		(newValue: string) => {
			onValueChange?.(newValue)
			if (newValue.length === length) {
				onFilled?.(newValue)
				if (autoBlur) {
					textInputRef.current?.blur()
				}
			}
		},
		[length, autoBlur, onValueChange, onFilled]
	)

	const onFocus = useCallback(() => {
		setIsFocused(true)
	}, [setIsFocused])

	const onBlur = useCallback(() => {
		setIsFocused(false)
	}, [setIsFocused])

	return (
		<View style={styles.root}>
			<TextInput
				ref={textInputRef}
				style={[{ height, fontSize }, styles.fakeInput]}
				value={value}
				onChangeText={onTextChanged}
				onFocus={onFocus}
				onBlur={onBlur}
				enterKeyHint="done"
				importantForAutofill="yes"
				textContentType={textContentType}
				keyboardType={keyboardType}
				maxLength={length}
				autoFocus={autoFocus}
			/>
			<CodeBox
				value={value}
				length={length}
				isFocused={isFocused}
				onPress={fakeFocus}
				cellStyle={cellStyle}
				focusedCellStyle={focusedCellStyle}
				textStyle={textStyle}
				focusedTextStyle={focusedTextStyle}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		position: 'relative',
	},

	fakeInput: {
		position: 'absolute',
		opacity: 0,
		left: 0,
		right: 0,
		paddingLeft: 16,
		paddingRight: 16,
		letterSpacing: 40,
	},

	cellContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		gap: 4,
	},

	cellStyle: {
		height: 36,
		width: 36,
		borderRadius: 8,
		padding: 4,
		flexDirection: 'row',

		alignItems: 'center',
		justifyContent: 'center',

		borderWidth: 2,
		backgroundColor: 'white',
		borderColor: '#777777',
	},

	focusedCellStyle: {
		borderWidth: 2,
		borderColor: 'white',
		backgroundColor: 'black',
	},

	textStyle: {
		fontSize: 24,
		color: 'black',
	},

	focusedTextStyle: {
		fontWeight: 'bold',
		color: 'white',
	},

	cursor: {
		height: 18,
		width: 3,
		marginLeft: 3,
		borderRadius: 2,
	},
})

export { CodeInput }
