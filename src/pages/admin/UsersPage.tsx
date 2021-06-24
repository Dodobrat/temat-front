import React from "react";
import PageWrapper from "../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../components/ui/wrappers/PageHeader";
import PageContent from "../../components/ui/wrappers/PageContent";
import { Heading, Text } from "@dodobrat/react-ui-kit";

const UsersPage = () => {
	return (
		<PageWrapper>
			<PageHeader>
				<Heading as='h6' className='mb--0'>
					Users
				</Heading>
			</PageHeader>
			<PageContent>
				<Text>Page Content</Text>
			</PageContent>
		</PageWrapper>
	);
};

export default UsersPage;
