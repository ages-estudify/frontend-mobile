import {
  buildSCurvePath,
  getLabelLeft,
  getNodePosition,
  getNodeSide,
  getOppositeSide,
  getTrailHeight,
  MAX_TRAIL_SCALE,
  MAX_TRAIL_WIDTH,
  MIN_TRAIL_WIDTH,
  resolveTrailLayout,
  TRAIL_HORIZONTAL_AMPLITUDE,
  TRAIL_LABEL_GAP,
  TRAIL_LABEL_WIDTH,
  TRAIL_NODE_SIZE,
} from "./TopicTrail";

describe("resolveTrailLayout", () => {
  it("clamps narrow screens up to the minimum width", () => {
    expect(resolveTrailLayout(280).containerWidth).toBe(MIN_TRAIL_WIDTH);
    expect(resolveTrailLayout(0).containerWidth).toBe(MIN_TRAIL_WIDTH);
  });

  it("uses the device width between the bounds on phones", () => {
    expect(resolveTrailLayout(360).containerWidth).toBe(360);
    expect(resolveTrailLayout(414).containerWidth).toBe(414);
  });

  it("keeps the scale at 1 and the label at its default on phone widths", () => {
    for (const w of [320, 360, 375, 414, 440]) {
      const layout = resolveTrailLayout(w);
      expect(layout.scale).toBe(1);
      expect(layout.nodeSize).toBe(TRAIL_NODE_SIZE);
      expect(layout.labelWidth).toBe(TRAIL_LABEL_WIDTH);
    }
  });

  it("scales up on tablet widths, capped at MAX_TRAIL_SCALE", () => {
    expect(resolveTrailLayout(768).scale).toBe(MAX_TRAIL_SCALE);
    expect(resolveTrailLayout(1280).scale).toBe(MAX_TRAIL_SCALE);

    const mid = resolveTrailLayout(550);
    expect(mid.scale).toBeGreaterThan(1);
    expect(mid.scale).toBeLessThan(MAX_TRAIL_SCALE);
  });

  it("grows node, amplitude and label proportionally to the scale on tablets", () => {
    const tablet = resolveTrailLayout(768);
    expect(tablet.scale).toBe(MAX_TRAIL_SCALE);
    expect(tablet.nodeSize).toBeCloseTo(TRAIL_NODE_SIZE * MAX_TRAIL_SCALE, 5);
    expect(tablet.amplitude).toBeCloseTo(TRAIL_HORIZONTAL_AMPLITUDE * MAX_TRAIL_SCALE, 5);
    expect(tablet.labelWidth).toBeGreaterThan(TRAIL_LABEL_WIDTH);
    expect(tablet.containerWidth).toBeGreaterThan(MAX_TRAIL_WIDTH);
  });

  it("never lets the scaled content overflow half the container", () => {
    for (const w of [200, 300, 360, 550, 660, 768, 1280]) {
      const { containerWidth, labelWidth, amplitude, nodeSize } = resolveTrailLayout(w);
      const halfContent = labelWidth + amplitude - nodeSize / 2;
      expect(halfContent).toBeLessThanOrEqual(containerWidth / 2);
    }
  });
});

describe("trail geometry stays inside the container", () => {
  const widths = [320, 360, 375, 414, 550, 660, 768];
  const totalCount = 8;

  for (const windowWidth of widths) {
    it(`keeps every node and label within bounds at ${windowWidth}px`, () => {
      const { containerWidth, labelWidth, amplitude, nodeSize, labelGap } =
        resolveTrailLayout(windowWidth);

      for (let i = 0; i < totalCount; i++) {
        const { x, side } = getNodePosition(i, totalCount, {
          containerWidth,
          amplitude,
          nodeSize,
        });
        const nodeLeft = x - nodeSize / 2;
        const nodeRight = nodeLeft + nodeSize;

        expect(nodeLeft).toBeGreaterThanOrEqual(0);
        expect(nodeRight).toBeLessThanOrEqual(containerWidth);

        const labelSide = getOppositeSide(side);
        const labelLeft = getLabelLeft(nodeLeft, labelSide, labelWidth, nodeSize, labelGap);
        expect(labelLeft).toBeGreaterThanOrEqual(0);
        expect(labelLeft + labelWidth).toBeLessThanOrEqual(containerWidth);
      }
    });
  }
});

describe("node sides still alternate", () => {
  it("places even nodes on the right and odd nodes on the left", () => {
    expect(getNodeSide(0)).toBe("right");
    expect(getNodeSide(1)).toBe("left");
    expect(getOppositeSide("right")).toBe("left");
  });
});

describe("trail path and default sizing", () => {
  it("returns an empty path when there are no positions", () => {
    expect(buildSCurvePath([])).toBe("");
  });

  it("builds an S-curve path from the topmost position downward", () => {
    const d = buildSCurvePath([
      { x: 10, y: 100 },
      { x: 50, y: 0 },
    ]);
    expect(d.startsWith("M 50 0")).toBe(true);
    expect(d).toContain("C");
  });

  it("computes a node position using the default geometry", () => {
    const pos = getNodePosition(0, 1);
    expect(pos.side).toBe("right");
    expect(pos.x).toBe(225);
    expect(pos.y).toBe(54);
  });

  it("computes the label left using the default node size, width and gap", () => {
    expect(getLabelLeft(100, "right")).toBe(100 + TRAIL_NODE_SIZE + TRAIL_LABEL_GAP);
    expect(getLabelLeft(100, "left")).toBe(100 - TRAIL_LABEL_WIDTH - TRAIL_LABEL_GAP);
  });

  it("uses the default vertical spacing when computing trail height", () => {
    expect(getTrailHeight(0)).toBeGreaterThan(0);
    expect(getTrailHeight(3)).toBeGreaterThan(getTrailHeight(1));
  });
});
