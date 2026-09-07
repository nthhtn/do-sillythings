import React from 'react';
import { PulseLoader } from 'react-spinners';

export default function Loader({ color = '#3f51b5' }) {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '60px 0' }}>
			<PulseLoader color={color} size={15} />
		</div>
	);
}
