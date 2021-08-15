import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Heading, Flex } from "@dodobrat/react-ui-kit";
import ComingSoon from "../../../components/ui/ComingSoon";
import PageContent from "../../../components/ui/wrappers/PageContent";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";

const CompaniesViewPage = () => {
	const { id }: any = useParams();

	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | Company #{id}</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							Company #{id}
						</Heading>
					</Flex.Col>
				</Flex>
			</PageHeader>
			<PageContent>
				<ComingSoon />
			</PageContent>
		</PageWrapper>
	);
};

export default CompaniesViewPage;
