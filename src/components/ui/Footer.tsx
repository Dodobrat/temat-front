import React from "react";

interface FooterProps {
	children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children, ...props }) => {
	return (
		<div {...props} className='py--4'>
			&copy; {process.env.REACT_APP_NAME} | {new Date().getFullYear()}
		</div>
	);
};

export default Footer;
