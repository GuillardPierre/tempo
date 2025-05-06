import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

function StopSvg(props: SvgProps) {
	return (
		<Svg
			width='25px'
			height='25px'
			viewBox='-0.5 0 25 25'
			fill='none'
			{...props}
		>
			<Path
				d='M17 3.42H7a4 4 0 00-4 4v10a4 4 0 004 4h10a4 4 0 004-4v-10a4 4 0 00-4-4z'
				stroke='#000'
				strokeWidth={2.5}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
}

export default StopSvg;
