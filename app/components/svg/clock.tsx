import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

function ClockSvg(props: SvgProps) {
	return (
		<Svg
			data-name='Layer 1'
			viewBox='0 0 24 24'
			width={20}
			height={20}
			{...props}
		>
			<Path d='M13 2.051V1a1 1 0 00-2 0v1.051a10.98 10.98 0 00-7.319 18.125A3.024 3.024 0 002 23a1 1 0 002 0 1.2 1.2 0 011.11-1.229.932.932 0 00.2-.062 10.924 10.924 0 0013.39 0 1.033 1.033 0 00.182.064A1.2 1.2 0 0120 23a1 1 0 002 0 3.024 3.024 0 00-1.681-2.824A10.98 10.98 0 0013 2.051zM3 13a9 9 0 119 9 9.011 9.011 0 01-9-9zM19.215 0a1 1 0 000 2A2.59 2.59 0 0122 4.5a1 1 0 002 0A4.6 4.6 0 0019.215 0zM2 4.5A2.59 2.59 0 014.785 2a1 1 0 000-2A4.6 4.6 0 000 4.5a1 1 0 002 0z' />
			<Path d='M13 11.586V7a1 1 0 00-2 0v5a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414z' />
		</Svg>
	);
}

export default ClockSvg;
