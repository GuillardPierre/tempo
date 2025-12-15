import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const CloseSvg   = (props: SvgProps) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 28 28"
    fill="none"
    {...props}
  >
    <Path
      d="M26 2L2 26M2 2L26 26"
      stroke={props.stroke || props.color || "#F5F2FF"}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default CloseSvg ;
