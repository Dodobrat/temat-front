import React from "react";
import cn from "classnames";

interface Props {
	className?: string;
	children?: React.ReactNode;
}

const PageHeader = ({ children, className, ...rest }: Props) => {
	return (
		<header className={cn("py--2", className)} {...rest}>
			{children}
		</header>
	);
};

export default PageHeader;
