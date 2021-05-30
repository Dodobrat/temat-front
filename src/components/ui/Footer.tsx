import React from "react";

interface FooterProps {
	children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children, ...props }) => {
	return <div {...props}>&copy; Temat Group {new Date().getFullYear()}</div>;
};

export default Footer;
