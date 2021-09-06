import { Helmet } from "react-helmet";
import { Heading } from "@dodobrat/react-ui-kit";
import ComingSoon from "../../../components/ui/ComingSoon";
import PageContent from "../../../components/ui/wrappers/PageContent";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import { useParams } from "react-router-dom";
import { Flex } from "@dodobrat/react-ui-kit";
import { useTranslation } from "react-i18next";

const ProductsViewPage = () => {
	const { id }: any = useParams();

	const { t } = useTranslation();

	return (
		<PageWrapper>
			<Helmet>
				<title>
					Temat | {t("common.product")} #{id}
				</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("common.product")} #{id}
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

export default ProductsViewPage;
