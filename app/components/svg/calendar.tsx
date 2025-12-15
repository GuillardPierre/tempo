import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const CalendarSvg = (props: SvgProps) => (
  <Svg
    width={31}
    height={34}
    viewBox="0 0 31 34"
    fill="none"
    {...props}
  >
    <Path
      d="M15.5 18.5H23.625V26.625H15.5V18.5ZM26.875 3.875H25.25V0.625H22V3.875H9V0.625H5.75V3.875H4.125C2.3375 3.875 0.875 5.3375 0.875 7.125V29.875C0.875 31.6625 2.3375 33.125 4.125 33.125H26.875C28.6625 33.125 30.125 31.6625 30.125 29.875V7.125C30.125 5.3375 28.6625 3.875 26.875 3.875ZM26.875 7.125V10.375H4.125V7.125H26.875ZM4.125 29.875V13.625H26.875V29.875H4.125Z"
      fill={props.fill || "white"}
    />
  </Svg>
);
export default CalendarSvg;
