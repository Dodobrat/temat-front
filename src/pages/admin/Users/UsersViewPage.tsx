import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Heading } from "@dodobrat/react-ui-kit";
import ComingSoon from "../../../components/ui/ComingSoon";
import PageContent from "../../../components/ui/wrappers/PageContent";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";

const UsersViewPage = () => {
	const { id }: any = useParams();

	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | User #{id}</title>
			</Helmet>
			<PageHeader>
				<Heading as='h6' className='mb--0'>
					User #{id}
				</Heading>
			</PageHeader>
			<PageContent>
				<ComingSoon />
			</PageContent>
		</PageWrapper>
	);
};

export default UsersViewPage;
