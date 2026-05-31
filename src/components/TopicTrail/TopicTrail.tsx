import { TopicLabel } from "@/components/TopicLabel";
import { TopicNode, type TopicIconKey } from "@/components/TopicNode";
import React, { Fragment, useMemo } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export interface TopicTrailItem {
  id: string;
  stageNumber: number;
  name: string;
  progressPercentage: number;
  iconKey: TopicIconKey;
  iconUrl?: string;
}

export interface TopicTrailProps {
  topics: TopicTrailItem[];
  onTopicPress: (topicId: string) => void;
}

export type TrailSide = "left" | "right";

export const TRAIL_CONTAINER_WIDTH = 380;
export const TRAIL_NODE_SIZE = 60;
export const TRAIL_LABEL_WIDTH = 140;
export const TRAIL_LABEL_GAP = 10;
export const TRAIL_HORIZONTAL_AMPLITUDE = 35;
export const TRAIL_VERTICAL_SPACING = 130;
export const TRAIL_TOP_PADDING = 24;
export const TRAIL_BOTTOM_PADDING = 32;
export const MIN_TRAIL_WIDTH = 300;
export const MAX_TRAIL_WIDTH = 440;
export const TABLET_SCALE_BASE = 440;
export const MAX_TRAIL_SCALE = 1.5;
const TRAIL_STROKE_COLOR = "#D9D9D9";
const TRAIL_STROKE_WIDTH = 8;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export interface TrailLayout {
  scale: number;
  containerWidth: number;
  nodeSize: number;
  amplitude: number;
  verticalSpacing: number;
  labelGap: number;
  labelWidth: number;
}

export function resolveTrailLayout(windowWidth: number): TrailLayout {
  const scale = clamp(windowWidth / TABLET_SCALE_BASE, 1, MAX_TRAIL_SCALE);
  const nodeSize = TRAIL_NODE_SIZE * scale;
  const amplitude = TRAIL_HORIZONTAL_AMPLITUDE * scale;
  const verticalSpacing = TRAIL_VERTICAL_SPACING * scale;
  const labelGap = TRAIL_LABEL_GAP * scale;
  const containerWidth = clamp(windowWidth, MIN_TRAIL_WIDTH, MAX_TRAIL_WIDTH * scale);
  const maxLabelWidth = containerWidth / 2 + amplitude - nodeSize / 2 - labelGap;
  const labelWidth = Math.min(TRAIL_LABEL_WIDTH * scale, maxLabelWidth);
  return { scale, containerWidth, nodeSize, amplitude, verticalSpacing, labelGap, labelWidth };
}

export function getNodeSide(index: number): TrailSide {
  return index % 2 === 0 ? "right" : "left";
}

export function getOppositeSide(side: TrailSide): TrailSide {
  return side === "right" ? "left" : "right";
}

export interface NodeLayout {
  x: number;
  y: number;
  side: TrailSide;
}

export interface TrailGeometry {
  containerWidth: number;
  amplitude: number;
  nodeSize: number;
  verticalSpacing: number;
}

export function getNodePosition(
  index: number,
  totalCount: number,
  geometry: Partial<TrailGeometry> = {}
): NodeLayout {
  const {
    containerWidth = TRAIL_CONTAINER_WIDTH,
    amplitude = TRAIL_HORIZONTAL_AMPLITUDE,
    nodeSize = TRAIL_NODE_SIZE,
    verticalSpacing = TRAIL_VERTICAL_SPACING,
  } = geometry;
  const centerX = containerWidth / 2;
  const side = getNodeSide(index);
  const visualIndexFromTop = Math.max(0, totalCount - 1 - index);
  const y = TRAIL_TOP_PADDING + visualIndexFromTop * verticalSpacing + nodeSize / 2;
  const x = side === "right" ? centerX + amplitude : centerX - amplitude;
  return { x, y, side };
}

export function getLabelLeft(
  nodeLeft: number,
  labelSide: TrailSide,
  labelWidth: number = TRAIL_LABEL_WIDTH,
  nodeSize: number = TRAIL_NODE_SIZE,
  gap: number = TRAIL_LABEL_GAP
): number {
  return labelSide === "left" ? nodeLeft - labelWidth - gap : nodeLeft + nodeSize + gap;
}

export function buildSCurvePath(positions: { x: number; y: number }[]): string {
  if (positions.length === 0) return "";

  const sorted = [...positions].sort((a, b) => a.y - b.y);
  let d = `M ${sorted[0].x} ${sorted[0].y}`;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const dy = curr.y - prev.y;
    const c1y = prev.y + dy * 0.75;
    const c2y = curr.y - dy * 0.75;
    d += ` C ${prev.x} ${c1y}, ${curr.x} ${c2y}, ${curr.x} ${curr.y}`;
  }

  return d;
}

export function getTrailHeight(
  totalCount: number,
  verticalSpacing: number = TRAIL_VERTICAL_SPACING
): number {
  const slots = Math.max(1, totalCount);
  return TRAIL_TOP_PADDING + TRAIL_BOTTOM_PADDING + slots * verticalSpacing;
}

export function TopicTrail({ topics, onTopicPress }: TopicTrailProps) {
  const { width: windowWidth } = useWindowDimensions();
  const { scale, containerWidth, nodeSize, amplitude, verticalSpacing, labelGap, labelWidth } =
    useMemo(() => resolveTrailLayout(windowWidth), [windowWidth]);

  const totalCount = topics.length;
  const totalHeight = useMemo(
    () => getTrailHeight(totalCount, verticalSpacing),
    [totalCount, verticalSpacing]
  );

  const positions = useMemo(
    () =>
      topics.map((_, i) =>
        getNodePosition(i, totalCount, { containerWidth, amplitude, nodeSize, verticalSpacing })
      ),
    [topics, totalCount, containerWidth, amplitude, nodeSize, verticalSpacing]
  );

  const pathD = useMemo(() => buildSCurvePath(positions), [positions]);

  return (
    <ScrollView
      testID="topic-trail-scroll"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center", paddingVertical: 16 }}
    >
      <View testID="topic-trail-container" style={{ width: containerWidth, height: totalHeight }}>
        <Svg
          testID="topic-trail-svg"
          pointerEvents="none"
          width={containerWidth}
          height={totalHeight}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
        >
          <Path
            testID="topic-trail-path"
            d={pathD}
            stroke={TRAIL_STROKE_COLOR}
            strokeWidth={TRAIL_STROKE_WIDTH}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>

        {topics.map((topic, i) => {
          const { x, y, side } = positions[i];
          const labelSide = getOppositeSide(side);
          const nodeLeft = x - nodeSize / 2;
          const nodeTop = y - nodeSize / 2;
          const labelLeft = getLabelLeft(nodeLeft, labelSide, labelWidth, nodeSize, labelGap);
          const labelTop = y - 36 * scale;

          return (
            <Fragment key={topic.id}>
              <View
                testID={`topic-trail-label-${topic.id}`}
                accessibilityHint={labelSide}
                style={{
                  position: "absolute",
                  left: labelLeft,
                  top: labelTop,
                  width: labelWidth,
                }}
                pointerEvents="none"
              >
                <TopicLabel
                  stageNumber={topic.stageNumber}
                  topicName={topic.name}
                  progressPercentage={topic.progressPercentage}
                  scale={scale}
                />
              </View>

              <View
                testID={`topic-trail-node-${topic.id}`}
                accessibilityHint={side}
                style={{
                  position: "absolute",
                  left: nodeLeft,
                  top: nodeTop,
                  zIndex: 2,
                  elevation: 6,
                }}
              >
                <TopicNode
                  iconKey={topic.iconKey}
                  iconUrl={topic.iconUrl}
                  progressPercentage={topic.progressPercentage}
                  onPress={() => onTopicPress(topic.id)}
                  accessibilityLabel={topic.name}
                  scale={scale}
                />
              </View>
            </Fragment>
          );
        })}
      </View>
    </ScrollView>
  );
}
