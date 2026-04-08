/* Plain JS mock — evita factory jest.mock + NativeWind no mesmo arquivo. */
const React = require("react");
const { Text } = require("react-native");

function Redirect({ href }) {
  return React.createElement(Text, { testID: "redirect-href" }, href);
}

module.exports = { Redirect };
