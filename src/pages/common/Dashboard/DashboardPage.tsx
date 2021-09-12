import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";
import { Heading, Card } from "@dodobrat/react-ui-kit";
import { Helmet } from "react-helmet";
import { useOrderStatistics } from "../../../actions/fetchHooks";
import { errorToast } from "../../../helpers/toastEmitter";
import { useAuthContext } from "../../../context/AuthContext";
import ComingSoon from "../../../components/ui/ComingSoon";
import { Flex } from "@dodobrat/react-ui-kit";
import { useTranslation } from "react-i18next";

const DashboardPage = () => {
	const { t } = useTranslation();

	const {
		userValue: { user },
	} = useAuthContext();

	const { data: statsData } = useOrderStatistics({
		specs: {
			companyId: user.companyId,
			filters: {
				start: "2021-05-20",
			},
		},
		queryConfig: {
			enabled: user.roleName !== "ADMIN",
			onError: (err: any) => errorToast(err),
		},
	});

	console.log(statsData);

	return (
		<PageWrapper>
			<Helmet>
				<title>
					{process.env.REACT_APP_NAME} | {t("common.dashboard")}
				</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("common.dashboard")}
						</Heading>
					</Flex.Col>
				</Flex>
			</PageHeader>
			<PageContent>
				<Card>
					<Card.Header>{t("common.statistic", { count: 0 })}</Card.Header>
					<Card.Body>
						<ComingSoon elevation='none' />
					</Card.Body>
				</Card>
			</PageContent>
		</PageWrapper>
	);
};

export default DashboardPage;
