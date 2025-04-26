import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

function BurgerMenuSvg(props: SvgProps) {
	return (
		<Svg width='30px' height='30px' viewBox='0 0 24 24' fill='none' {...props}>
			<Path
				d='M13 5a1 1 0 10-2 0 1 1 0 002 0zM13 12a1 1 0 10-2 0 1 1 0 002 0zM13 19a1 1 0 10-2 0 1 1 0 002 0z'
				stroke='#000'
				strokeWidth={2}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</Svg>
	);
}

export default BurgerMenuSvg;
