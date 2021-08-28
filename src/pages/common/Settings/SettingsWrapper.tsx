import React from "react";

interface Props {
	children?: React.ReactNode;
}

const SettingsWrapper = ({ children }: Props) => {
	return (
		<div className='d--grid' style={{ gap: "1rem" }}>
			{children}
		</div>
	);
};

export default SettingsWrapper;
