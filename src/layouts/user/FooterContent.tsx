import React from "react";
import { AdminLayout } from "@dodobrat/react-ui-kit";
import PageFooter from "../../components/ui/wrappers/PageFooter";

const FooterContent = () => {
	return (
		<AdminLayout.Footer className='mt--4'>
			<PageFooter />
		</AdminLayout.Footer>
	);
};

FooterContent.displayName = "AdminLayoutFooter";

export default FooterContent;
