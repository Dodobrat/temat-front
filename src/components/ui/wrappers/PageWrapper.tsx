import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAdminLayout, useWindowResize } from "@dodobrat/react-ui-kit";

interface Props {
	children?: React.ReactNode;
}

const PageWrapper = ({ children, ...rest }: Props) => {
	const {
		sidebarValue: { setSidebarState },
		sidebarBreakpointValue: { sidebarBreakpointState },
	} = useAdminLayout();

	const { width } = useWindowResize();
	const history = useHistory();

	useEffect(() => {
		return history.listen(() => {
			window.scrollTo({ top: 0 });
			if (width <= sidebarBreakpointState) {
				setSidebarState(false);
			}
		});
	});

	return <article {...rest}>{children}</article>;
};

export default PageWrapper;
