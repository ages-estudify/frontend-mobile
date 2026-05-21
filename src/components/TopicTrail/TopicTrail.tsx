import { TopicLabel } from "@/components/TopicLabel";
import { TopicNode, type TopicColorKey, type TopicIconKey } from "@/components/TopicNode";
import React, { Fragment, useMemo } from "react";
import { ScrollView, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export interface TopicTrailItem {
  id: string;
  stageNumber: number;
  name: string;
  progressPercentage: number;
  iconKey: TopicIconKey;
  colorKey: TopicColorKey;
}

export interface TopicTrailProps {
  topics: TopicTrailItem[];
  onTopicPress: (topicId: string) => void;
}

export type TrailSide = "left" | "right";

export const TRAIL_CONTAINER_WIDTH = 340;
export const TRAIL_NODE_SIZE = 68;
export const TRAIL_LABEL_WIDTH = 140;
export const TRAIL_LABEL_GAP = 10;
export const TRAIL_HORIZONTAL_AMPLITUDE = 70;
export const TRAIL_VERTICAL_SPACING = 150;
export const TRAIL_TOP_PADDING = 48;
export const TRAIL_BOTTOM_PADDING = 48;
const TRAIL_STROKE_COLOR = "#3E2B5C";
const TRAIL_STROKE_WIDTH = 6;

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

export function getNodePosition(
  index: number,
  totalCount: number,
  containerWidth: number = TRAIL_CONTAINER_WIDTH
): NodeLayout {
  const centerX = containerWidth / 2;
  const side = getNodeSide(index);
  const visualIndexFromTop = Math.max(0, totalCount - 1 - index);
  const y = TRAIL_TOP_PADDING + visualIndexFromTop * TRAIL_VERTICAL_SPACING + TRAIL_NODE_SIZE / 2;
  const x =
    side === "right" ? centerX + TRAIL_HORIZONTAL_AMPLITUDE : centerX - TRAIL_HORIZONTAL_AMPLITUDE;
  return { x, y, side };
}

export function buildSCurvePath(positions: { x: number; y: number }[]): string {
  if (positions.length === 0) return "";

  const sorted = [...positions].sort((a, b) => a.y - b.y);
  let d = `M ${sorted[0].x} ${sorted[0].y}`;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }

  return d;
}

export function getTrailHeight(totalCount: number): number {
  const slots = Math.max(1, totalCount);
  return TRAIL_TOP_PADDING + TRAIL_BOTTOM_PADDING + slots * TRAIL_VERTICAL_SPACING;
}

export function TopicTrail({ topics, onTopicPress }: TopicTrailProps) {
  const totalCount = topics.length;
  const totalHeight = useMemo(() => getTrailHeight(totalCount), [totalCount]);

  const positions = useMemo(
    () => topics.map((_, i) => getNodePosition(i, totalCount)),
    [topics, totalCount]
  );

  const pathD = useMemo(() => buildSCurvePath(positions), [positions]);

  return (
    <ScrollView
      testID="topic-trail-scroll"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center", paddingVertical: 16 }}
    >
      <View
        testID="topic-trail-container"
        style={{ width: TRAIL_CONTAINER_WIDTH, height: totalHeight }}
      >
        <Svg
          testID="topic-trail-svg"
          width={TRAIL_CONTAINER_WIDTH}
          height={totalHeight}
          style={{ position: "absolute", top: 0, left: 0 }}
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
          const nodeLeft = x - TRAIL_NODE_SIZE / 2;
          const nodeTop = y - TRAIL_NODE_SIZE / 2;
          const labelLeft =
            labelSide === "left"
              ? nodeLeft - TRAIL_LABEL_WIDTH - TRAIL_LABEL_GAP
              : nodeLeft + TRAIL_NODE_SIZE + TRAIL_LABEL_GAP;
          const labelTop = y - 36;

          return (
            <Fragment key={topic.id}>
              <View
                testID={`topic-trail-node-${topic.id}`}
                accessibilityHint={side}
                style={{
                  position: "absolute",
                  left: nodeLeft,
                  top: nodeTop,
                }}
              >
                <TopicNode
                  iconKey={topic.iconKey}
                  colorKey={topic.colorKey}
                  onPress={() => onTopicPress(topic.id)}
                  accessibilityLabel={topic.name}
                />
              </View>

              <View
                testID={`topic-trail-label-${topic.id}`}
                accessibilityHint={labelSide}
                style={{
                  position: "absolute",
                  left: labelLeft,
                  top: labelTop,
                  width: TRAIL_LABEL_WIDTH,
                }}
                pointerEvents="none"
              >
                <TopicLabel
                  stageNumber={topic.stageNumber}
                  topicName={topic.name}
                  progressPercentage={topic.progressPercentage}
                />
              </View>
            </Fragment>
          );
        })}
      </View>
    </ScrollView>
  );
}
