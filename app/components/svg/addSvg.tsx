import * as React from 'react';
import Svg, { Rect, Path, SvgProps } from 'react-native-svg';

const AddSvg = (props: SvgProps) => (
	<Svg width={16} height={16} viewBox='0 0 16 16' fill='none' {...props}>
		<Path
			d='M6.53425 15.72V9.224H0.19825V6.408H6.53425V0.104H9.47825V6.408H15.8143V9.224H9.47825V15.72H6.53425Z'
			fill='white'
		/>
	</Svg>
);
export default AddSvg;
