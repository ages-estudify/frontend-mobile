const React = require("react");
const { View } = require("react-native");

function SvgMock() {
  return React.createElement(View, { testID: "svg-mock" });
}

module.exports = SvgMock;
