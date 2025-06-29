import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

function PreviousDateSvg(props: SvgProps) {
	return (
		<Svg
			fill='#fff'
			height='800px'
			width='800px'
			viewBox='0 0 512 512'
			{...props}
		>
			<Path d='M168.837 256L388.418 36.418c8.331-8.331 8.331-21.839 0-30.17-8.331-8.331-21.839-8.331-30.17 0L123.582 240.915c-8.331 8.331-8.331 21.839 0 30.17l234.667 234.667c8.331 8.331 21.839 8.331 30.17 0 8.331-8.331 8.331-21.839 0-30.17L168.837 256z' />
		</Svg>
	);
}

export default PreviousDateSvg;
