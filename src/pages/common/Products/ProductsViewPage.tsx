import { Helmet } from "react-helmet";
import { Heading } from "@dodobrat/react-ui-kit";
import ComingSoon from "../../../components/ui/ComingSoon";
import PageContent from "../../../components/ui/wrappers/PageContent";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import { useParams } from "react-router-dom";

const ProductsViewPage = () => {
	const { id }: any = useParams();

	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | Product #{id}</title>
			</Helmet>
			<PageHeader>
				<Heading as='h6' className='mb--0'>
					Product #{id}
				</Heading>
			</PageHeader>
			<PageContent>
				<ComingSoon />
			</PageContent>
		</PageWrapper>
	);
};

export default ProductsViewPage;
