import React from "react";
import cn from "classnames";

interface Props {
	className?: string;
	children?: React.ReactNode;
}

const PageContent = ({ children, className, ...rest }: Props) => {
	return (
		<article className={cn(className)} {...rest}>
			{children}
		</article>
	);
};

export default PageContent;
