import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

function MinusIcon(props: SvgProps) {
  return (
    <Svg
      width={46}
      height={46}
      viewBox="0 0 46 46"
      fill="none"
      {...props}
    >
      <Path
        d="M34.5 25.91h-23c-.508 0-.996-.255-1.355-.708-.36-.453-.562-1.067-.562-1.708 0-.64.202-1.254.562-1.707.36-.453.847-.707 1.355-.707h23c.508 0 .996.254 1.355.707.36.453.562 1.067.562 1.707 0 .641-.202 1.255-.562 1.708-.36.453-.847.707-1.355.707z"
        fill="#fff"
      />
    </Svg>
  )
}

export default MinusIcon
