import React from "react";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";
import { Heading, Text } from "@dodobrat/react-ui-kit";
import { Helmet } from "react-helmet";

const DashboardPage = () => {
	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | Dashboard</title>
			</Helmet>
			<PageHeader>
				<Heading as='h6' className='mb--0'>
					Dashboard
				</Heading>
			</PageHeader>
			<PageContent>
				<Text>Page Content</Text>
			</PageContent>
		</PageWrapper>
	);
};

export default DashboardPage;
