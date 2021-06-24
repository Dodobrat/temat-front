import React from "react";
import PageWrapper from "../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../components/ui/wrappers/PageHeader";
import { Heading, Text } from "@dodobrat/react-ui-kit";
import PageContent from "../../components/ui/wrappers/PageContent";

const DashboardPage = () => {
	return (
		<PageWrapper>
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
