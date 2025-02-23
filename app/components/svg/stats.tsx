import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const StatsSvg = (props: SvgProps) => (
  <Svg
    width={24}
    height={31}
    viewBox="0 0 24 31"
    fill="none"
    {...props}
    {...props}
  >
    <Path
      d="M12 28.6667V12M22 28.6667V2M2 28.6667V22"
      stroke="#F5F2FF"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default StatsSvg;
