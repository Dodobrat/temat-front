import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Heading } from "@dodobrat/react-ui-kit";
import ComingSoon from "../../../components/ui/ComingSoon";
import PageContent from "../../../components/ui/wrappers/PageContent";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import { Flex } from "@dodobrat/react-ui-kit";

const ShippingPlansViewPage = () => {
	const { id }: any = useParams();

	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | Shipping Plan #{id}</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							Shipping Plan #{id}
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

export default ShippingPlansViewPage;
