import { useState } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { CodeInput } from 'react-native-code-input'

export default function App() {
	const [code, setCode] = useState<string>('')
	const [length, setLength] = useState<number>(6)

	return (
		<View style={styles.container}>
			<View style={styles.box}>
				<Text>Current Length: {length}</Text>
				<View style={styles.row}>
					<Button
						title="-"
						onPress={() => {
							setLength(length - 1)
						}}
					/>
					<Button
						title="+"
						onPress={() => {
							setLength(length + 1)
						}}
					/>
				</View>
				<CodeInput
					value={code}
					onValueChange={(code) => {
						console.log(`Code changed ${code}`)
						setCode(code)
					}}
					onFilled={(code) => {
						console.log(`Code filled ${code}`)
					}}
					length={length}
					autoFocus
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#cdb4db',
	},

	box: {
		width: 680,
		backgroundColor: '#ffc8dd',
		alignItems: 'center',
		borderRadius: 6,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
		padding: 16,
	},

	row: {
		flexDirection: 'row',
		gap: 4,
		marginTop: 8,
		marginBottom: 8,
	},

	button: {
		width: 20,
		height: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
})
