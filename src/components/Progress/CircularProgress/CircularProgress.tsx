import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { progressColors } from "../../../constants/progressColors";

interface Props {
  percentage?: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({ percentage = 0, label, size = 82, strokeWidth = 10 }: Props) {
  const safePercentage = Math.min(Math.max(Number(percentage) || 0, 0), 100);

  const outerRingStrokeWidth = 14;
  const outerPadding = 6;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  const canvasSize = size + outerPadding * 2;
  const center = canvasSize / 2;

  const outerRingRadius = radius + outerPadding - 1;

  return (
    <View className="items-center">
      <View
        style={{
          width: canvasSize,
          height: canvasSize,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg width={canvasSize} height={canvasSize}>
          <G rotation={-90} origin={`${center}, ${center}`}>
            {/* anel cinza externo bem sutil */}
            <Circle
              cx={center}
              cy={center}
              r={outerRingRadius}
              stroke={progressColors.circularOuterRing}
              strokeWidth={outerRingStrokeWidth}
              fill="none"
            />

            {/* trilha */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={progressColors.progressTrack}
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* progresso */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={progressColors.simuladoProgress}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
            />
          </G>
        </Svg>

        <View
          style={{
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text allowFontScaling={false} className="font-inter-semi text-[18px] text-greenPrimary">
            {Math.round(safePercentage)}%
          </Text>
        </View>
      </View>

      {label ? (
        <Text
          allowFontScaling={false}
          className="mt-[10px] font-inter-semi text-[16px] text-greenPrimary"
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
}
