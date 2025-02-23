import * as React from "react";
import Svg, { Line, SvgProps } from "react-native-svg";
const MenuSvg = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 52 52"
    fill="none"
    {...props}
  >
    <Line
      x1={11.5}
      y1={16.5}
      x2={40.5}
      y2={16.5}
      stroke="white"
      strokeWidth={3}
      strokeLinecap="round"
    />
    <Line
      x1={11.5}
      y1={26.5}
      x2={40.5}
      y2={26.5}
      stroke="white"
      strokeWidth={3}
      strokeLinecap="round"
    />
    <Line
      x1={11.5}
      y1={36.5}
      x2={40.5}
      y2={36.5}
      stroke="white"
      strokeWidth={3}
      strokeLinecap="round"
    />
  </Svg>
);
export default MenuSvg;
