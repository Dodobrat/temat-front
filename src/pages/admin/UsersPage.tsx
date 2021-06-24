import React from "react";
import PageWrapper from "../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../components/ui/wrappers/PageHeader";
import { Heading } from "@dodobrat/react-ui-kit";

interface Props {}

const UsersPage = (props: Props) => {
	return (
		<PageWrapper>
			<PageHeader>
				<Heading as='h6' className='mb--0'>
					Users
				</Heading>
			</PageHeader>
		</PageWrapper>
	);
};

export default UsersPage;
