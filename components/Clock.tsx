import { useState, useEffect } from "react";
import Animated, { type AnimatedStyle } from "react-native-reanimated";
import { StyleSheet, Text } from "react-native";

const AnimatedView = Animated.View;

interface Props {
	showSeconds: boolean;
	use12HFormat: boolean;
	clockColor: string;
	animatedStyles: AnimatedStyle;
}

export default function Clock({
	showSeconds,
	use12HFormat,
	clockColor,
	animatedStyles,
}: Props) {
	const [time, setTime] = useState("");

	useEffect(() => {
		setTime(getFormattedTime(showSeconds, use12HFormat));

		const interval = setInterval(() => {
			setTime(getFormattedTime(showSeconds, use12HFormat));
		}, 500);

		return () => clearInterval(interval);
	}, [showSeconds, use12HFormat]);

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
		},
		box: {
			width: 180,
			height: 60,
			display: "flex",
			justifyContent: "center",
		},

		text: {
			textAlign: "center",
			color: clockColor,
			fontSize: 30,
		},
	});

	return (
		<AnimatedView style={[animatedStyles, styles.box]}>
			<Text style={styles.text}>{time}</Text>
		</AnimatedView>
	);
}

function getFormattedTime(showSeconds: boolean, use12HourFormat: boolean) {
	const now = new Date();

	let hours = now.getHours();
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const seconds = showSeconds ? String(now.getSeconds()).padStart(2, "0") : "";

	let formattedTime: string;

	if (use12HourFormat) {
		const ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12 || 12;
		formattedTime = `${String(hours).padStart(2, "0")}:${minutes}`;
		if (showSeconds) {
			formattedTime += `:${seconds}`;
		}
		formattedTime += ` ${ampm}`;
	} else {
		formattedTime = `${String(hours).padStart(2, "0")}:${minutes}`;
		if (showSeconds) {
			formattedTime += `:${seconds}`;
		}
	}

	return formattedTime;
}
