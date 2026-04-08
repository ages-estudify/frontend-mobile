const React = require("react");
const { View, Text } = require("react-native");

const mockPush = jest.fn();

function Tabs({ children }) {
  return React.createElement(View, { testID: "bottom-tabs" }, children);
}

function TabsScreen({ name, options }) {
  return React.createElement(
    Text,
    {
      testID: `tab-label-${name}`,
      accessibilityLabel: options?.tabBarAccessibilityLabel,
    },
    options?.title ?? name
  );
}

Tabs.Screen = TabsScreen;

module.exports = {
  Tabs,
  useRouter: () => ({ push: mockPush }),
  __mockPush: mockPush,
};
