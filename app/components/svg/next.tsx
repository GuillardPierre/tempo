import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const NextSvg = (props: SvgProps) => (
  <Svg
    width={12}
    height={13}
    viewBox="0 0 12 13"
    fill="none"
    {...props}
    {...props}
  >
    <Path
      d="M0.148688 12.708V10.404L10.9727 5.868V7.356L0.148688 2.82V0.491999L11.8607 5.46V7.74L0.148688 12.708Z"
      fill="white"
    />
  </Svg>
);
export default NextSvg;
