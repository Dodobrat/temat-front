import React from "react";
import PageWrapper from "../../components/ui/wrappers/PageWrapper";
import PageContent from "../../components/ui/wrappers/PageContent";
import { Heading } from "@dodobrat/react-ui-kit";
import { Helmet } from "react-helmet";

const NotFoundPage = () => {
	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | Not Found</title>
			</Helmet>
			<PageContent>
				<Heading>404</Heading>
				<Heading>Not Found</Heading>
			</PageContent>
		</PageWrapper>
	);
};

export default NotFoundPage;
