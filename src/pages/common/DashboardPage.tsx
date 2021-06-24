import React from "react";
import PageWrapper from "../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../components/ui/wrappers/PageHeader";
import { Heading } from "@dodobrat/react-ui-kit";

interface Props {}

const DashboardPage = (props: Props) => {
	return (
		<PageWrapper>
			<PageHeader>
				<Heading as='h6' className='mb--0'>
					Dashboard
				</Heading>
			</PageHeader>
		</PageWrapper>
	);
};

export default DashboardPage;
