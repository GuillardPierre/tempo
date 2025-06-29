import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

function NextDateSvg(props: SvgProps) {
	return (
		<Svg
			fill='#fff'
			height='800px'
			width='800px'
			viewBox='0 0 512 512'
			{...props}
		>
			<Path d='M388.418 240.915L153.752 6.248c-8.331-8.331-21.839-8.331-30.17 0-8.331 8.331-8.331 21.839 0 30.17L343.163 256 123.582 475.582c-8.331 8.331-8.331 21.839 0 30.17 8.331 8.331 21.839 8.331 30.17 0l234.667-234.667c8.33-8.331 8.33-21.839-.001-30.17z' />
		</Svg>
	);
}

export default NextDateSvg;
