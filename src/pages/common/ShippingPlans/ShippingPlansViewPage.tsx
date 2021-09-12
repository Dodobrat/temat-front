import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Heading } from "@dodobrat/react-ui-kit";
import ComingSoon from "../../../components/ui/ComingSoon";
import PageContent from "../../../components/ui/wrappers/PageContent";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import { Flex } from "@dodobrat/react-ui-kit";
import { useTranslation } from "react-i18next";

const ShippingPlansViewPage = () => {
	const { id }: any = useParams();

	const { t } = useTranslation();

	return (
		<PageWrapper>
			<Helmet>
				<title>
					{process.env.REACT_APP_NAME} | {t("common.shippingPlan")} #{id}
				</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("common.shippingPlan")} #{id}
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
