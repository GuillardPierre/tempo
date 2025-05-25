import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

function ArrowBackSvg(props: SvgProps) {
	return (
		<Svg viewBox='0 0 24 24' width={30} height={30} {...props}>
			<Path d='M.88 14.09L4.75 18a1 1 0 001.42 0 1 1 0 000-1.42L2.61 13H23a1 1 0 001-1 1 1 0 00-1-1H2.55l3.62-3.62a1 1 0 000-1.38 1 1 0 00-1.42 0L.88 9.85a3 3 0 000 4.24z' />
		</Svg>
	);
}

export default ArrowBackSvg;
