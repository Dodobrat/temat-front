import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Heading } from "@dodobrat/react-ui-kit";

import PageWrapper from "../../components/ui/wrappers/PageWrapper";
import PageContent from "../../components/ui/wrappers/PageContent";

const NotFoundPage = () => {
	const { t } = useTranslation();

	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | {t("common.notFound")}</title>
			</Helmet>
			<PageContent>
				<Heading>404</Heading>
				<Heading>{t("common.notFound")}</Heading>
			</PageContent>
		</PageWrapper>
	);
};

export default NotFoundPage;
