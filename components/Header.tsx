import { Stack, IconButton } from "@react-native-material/core";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import type { FormattedLyric } from "@stef-0012/synclyrics";
import { View, Text, StyleSheet } from "react-native";
import type React from "react";

type Props = {
	onSettingsPress: () => void;
};

export default function Header({
	onSettingsPress,
}: Props) {
	return (
		<View
			style={styles.header}
		>
			<View style={styles.headerLeft} />

			<Stack>
				<IconButton
					icon={() => (
						<MaterialIcons name="settings" color={"#999"} size={40} />
					)}
					onPress={onSettingsPress}
				/>
			</Stack>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
		backgroundColor: "transparent",
		zIndex: 1000,
	},

	headerLeft: {
		flexDirection: "column",
	},

	text: {
		fontFamily: "Arimo-Nerd-Font",
		color: "#fff",
	},

	settings: {
		width: 30,
		height: 30,
		marginRight: 10,
	},

	settingsIcon: {
		width: "100%",
		height: "100%",
	},
});
