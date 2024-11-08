import { useState, useEffect } from "react";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import { StyleSheet, Dimensions, Text, View } from "react-native";

function clamp(val: number, min: number, max: number) {
	return Math.min(Math.max(val, min), max);
}

const { width, height } = Dimensions.get("screen");
const AnimatedView = Animated.View;

interface Props {
	showSeconds: boolean;
	use12HFormat: boolean;
	clockColor: string;
}

export default function Clock({
	showSeconds,
	use12HFormat,
	clockColor,
}: Props) {
	const translationX = useSharedValue(0);
	const translationY = useSharedValue(0);
	const prevTranslationX = useSharedValue(0);
	const prevTranslationY = useSharedValue(0);

	const scale = useSharedValue(1);
	const startScale = useSharedValue(0);

	const angle = useSharedValue(0);
	const startAngle = useSharedValue(0);

	const animatedStyles = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translationX.value },
			{ translateY: translationY.value },
			{ rotate: `${angle.value}rad` },
			{ scale: scale.value },
		],
	}));

	const pan = Gesture.Pan()
		.minDistance(1)
		.onStart(() => {
			prevTranslationX.value = translationX.value;
			prevTranslationY.value = translationY.value;
		})
		.onUpdate((event) => {
			const maxTranslateX = width;
			const maxTranslateY = height;

			translationX.value = clamp(
				prevTranslationX.value + event.translationX,
				-maxTranslateX,
				maxTranslateX,
			);
			translationY.value = clamp(
				prevTranslationY.value + event.translationY,
				-maxTranslateY,
				maxTranslateY,
			);
		})
		.runOnJS(true);

	const pinch = Gesture.Pinch()
		.onStart(() => {
			startScale.value = scale.value;
		})
		.onUpdate((event) => {
			scale.value = clamp(
				startScale.value * event.scale,
				0.5,
				Math.min(width, height),
			);
		})
		.runOnJS(true);

	const rotation = Gesture.Rotation()
		.onStart(() => {
			startAngle.value = angle.value;
		})
		.onUpdate((event) => {
			angle.value = startAngle.value + event.rotation;
		});

	const allGestures = Gesture.Simultaneous(pinch, rotation, pan);

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
			// backgroundColor: "#ff0000",
		},

		text: {
			textAlign: "center",
			color: clockColor,
			fontSize: 30,
		},
	});

	return (
		<GestureDetector gesture={allGestures}>
			<AnimatedView style={[animatedStyles, styles.box]}>
				<Text style={styles.text}>{time}</Text>
			</AnimatedView>
		</GestureDetector>
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
