import React from "react";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";
import { Heading, Text } from "@dodobrat/react-ui-kit";
import { Helmet } from "react-helmet";

const UsersPage = () => {
	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | Users</title>
			</Helmet>
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
