import {
	Text,
	View,
	StyleSheet,
	TextInput,
	StatusBar,
	Alert,
	Switch,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { Pressable } from "@react-native-material/core";
import SettingsModal from "@/components/Modal";
import { useKeepAwake } from "expo-keep-awake";
import { useState, useEffect } from "react";
import * as db from "@/functions/database";
import Header from "@/components/Header";
import Clock from "@/components/Clock";
import {
	ClickOutsideProvider,
	useClickOutside,
} from "react-native-click-outside";

export default function Index() {
	useKeepAwake();

	const [showSettings, setShowSettings] = useState<boolean>(false);
	const closeSettingsRef = useClickOutside<View>(() => setShowSettings(false));

	const [clockColor, setClockColor] = useState<string>(
		db.get("clockColor") || "#fff",
	);
	const [settingsClockColor, setSettingsClockColor] = useState<string>(
		clockColor || "#fff",
	);

	const [backgroundColor, setBackgroundColor] = useState<string>(
		db.get("backgroundColor") || "#000",
	);
	const [settingsBackgroundColor, setSettingsBackgroundColor] =
		useState<string>(backgroundColor || "#000");

	const [showSeconds, setShowSeconds] = useState<boolean>(
		db.get("showSeconds") === "true" || false,
	);
	const [settingsShowSeconds, setSettingsShowSeconds] = useState<boolean>(
		showSeconds || false,
	);

	const [use12HFormat, setUse12HFormat] = useState<boolean>(
		db.get("use12HFormat") === "true" || false,
	);
	const [settingsUse12HFormat, setSettingsUse12HFormat] = useState<boolean>(
		use12HFormat || false,
	);

	const hexRegex = /^#([a-f0-9]{3}|[a-f0-9]{6})$/i;

	useEffect(() => {
		setSettingsClockColor(clockColor);
		setSettingsBackgroundColor(backgroundColor);
		setSettingsShowSeconds(showSeconds);
		setSettingsUse12HFormat(use12HFormat);
	}, [showSettings, clockColor, backgroundColor, showSeconds, use12HFormat]);

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: backgroundColor || "#000",
			alignItems: "center",
			justifyContent: "flex-start",
		},

		modalContent: {
			paddingVertical: 20,
			paddingHorizontal: 10,
		},

		inputTitle: {
			fontWeight: "bold",
			color: "#fff",
			marginBottom: 5,
			fontSize: 16,
			marginTop: 7.5,
		},

		textInput: {
			width: "100%",
			height: 40,
			borderColor: "#aaa",
			borderWidth: 1,
			borderRadius: 5,
			paddingHorizontal: 10,
			color: "#fff",
			marginBottom: 7.5,
		},

		inputContainer: {
			flexDirection: "row",
			alignItems: "center",
		},

		saveButton: {
			marginTop: 7.5,
			backgroundColor: "#1ed760",
			borderRadius: 12,
			padding: 12,
			alignItems: "center",
			justifyContent: "center",
		},

		mainContent: {
			flex: 1,
		},

		toggleContainer: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
	});

	return (
		<ClickOutsideProvider>
			<GestureHandlerRootView>
				<RootSiblingParent>
					<StatusBar hidden={true} />
					<View style={styles.container}>
						<Header onSettingsPress={() => setShowSettings(true)} />

						<View style={styles.mainContent}>
							<Clock
								showSeconds={showSeconds}
								use12HFormat={use12HFormat}
								clockColor={clockColor}
							/>
						</View>

						<SettingsModal
							isVisible={showSettings}
							onClose={() => setShowSettings(false)}
							closeSettingsRef={closeSettingsRef}
						>
							<View style={styles.modalContent}>
								<Text style={styles.inputTitle}>Background Color:</Text>
								<TextInput
									style={styles.textInput}
									value={settingsBackgroundColor}
									onChangeText={(content) => {
										setSettingsBackgroundColor(content);
									}}
									placeholder="#000"
									placeholderTextColor="#aaa"
								/>

								<Text style={styles.inputTitle}>Clock Color:</Text>
								<TextInput
									style={styles.textInput}
									value={settingsClockColor}
									onChangeText={(content) => {
										setSettingsClockColor(content);
									}}
									placeholder="#fff"
									placeholderTextColor="#aaa"
								/>

								<View style={styles.toggleContainer}>
									<Text style={styles.inputTitle}>Show 12H Format:</Text>
									<Switch
										value={settingsUse12HFormat}
										onValueChange={(value) => setSettingsUse12HFormat(value)}
									/>
								</View>

								<View style={styles.toggleContainer}>
									<Text style={styles.inputTitle}>Show Seconds:</Text>
									<Switch
										value={settingsShowSeconds}
										onValueChange={(value) => setSettingsShowSeconds(value)}
									/>
								</View>

								<Pressable
									style={styles.saveButton}
									onPress={() => {
										if (!hexRegex.test(settingsClockColor)) {
											Alert.alert(
												"Invalid Settings",
												"Clock Color must be a hexadecimal color.\nIt has been reset to #fff",
											);

											setSettingsClockColor("#fff");
											setSettingsClockColor("#fff");
											db.set("clockColor", "#fff");
										} else {
											setClockColor(settingsClockColor || "#fff");
											db.set("clockColor", settingsClockColor || "#fff");
										}

										if (!hexRegex.test(settingsBackgroundColor)) {
											Alert.alert(
												"Invalid Settings",
												"Background Color must be a hexadecimal color.\nIt has been reset to #000",
											);

											setSettingsBackgroundColor("#000");
											setBackgroundColor("#000");
											db.set("backgroundColor", "#000");
										} else {
											setBackgroundColor(settingsBackgroundColor || "#000");
											db.set(
												"backgroundColor",
												settingsBackgroundColor || "#000",
											);
										}

										setShowSeconds(settingsShowSeconds);
										db.set("showSeconds", String(settingsShowSeconds));

										setUse12HFormat(settingsUse12HFormat);
										db.set("use12HFormat", String(settingsUse12HFormat));

										setShowSettings(false);
									}}
								>
									<Text>Save</Text>
								</Pressable>
							</View>
						</SettingsModal>
					</View>
				</RootSiblingParent>
			</GestureHandlerRootView>
		</ClickOutsideProvider>
	);
}
