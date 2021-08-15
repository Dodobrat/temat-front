import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";
import { Heading, Card } from "@dodobrat/react-ui-kit";
import { Helmet } from "react-helmet";
import { useOrderStatistics } from "../../../actions/fetchHooks";
import { errorToast } from "../../../helpers/toastEmitter";
import { useAuthContext } from "../../../context/AuthContext";
import ComingSoon from "../../../components/ui/ComingSoon";

const DashboardPage = () => {
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
				<title>Temat | Dashboard</title>
			</Helmet>
			<PageHeader>
				<Heading as='h6' className='mb--0'>
					Dashboard
				</Heading>
			</PageHeader>
			<PageContent>
				<Card>
					<Card.Header>Statistics</Card.Header>
					<Card.Body>
						<ComingSoon elevation='none' />
					</Card.Body>
				</Card>
			</PageContent>
		</PageWrapper>
	);
};

export default DashboardPage;
