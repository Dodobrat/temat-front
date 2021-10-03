import { Helmet } from "react-helmet";
import { Heading, Flex, Tabs } from "@dodobrat/react-ui-kit";
import { useTranslation } from "react-i18next";

import { useAuthContext } from "../../../context/AuthContext";

import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";

import SettingsAppearance from "./settings_panels/SettingsAppearance";
import SettingsProfile from "./settings_panels/SettingsProfile";
import SettingsCompanyDetails from "./settings_panels/SettingsCompanyDetails";

const RolesPage = () => {
	const { t } = useTranslation();

	const { userCan } = useAuthContext();

	return (
		<PageWrapper>
			<Helmet>
				<title>
					{process.env.REACT_APP_NAME} | {t("common.settings")}
				</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("common.settings")}
						</Heading>
					</Flex.Col>
				</Flex>
			</PageHeader>
			<PageContent>
				<Tabs activeTab={0}>
					<Tabs.Panel tab={t("settings.appearance")}>
						<SettingsAppearance />
					</Tabs.Panel>
					<Tabs.Panel tab={t("settings.profile")}>
						<SettingsProfile />
					</Tabs.Panel>
					{userCan("companyUpdateTheir") && (
						<Tabs.Panel tab={t("settings.companyDetails")}>
							<SettingsCompanyDetails />
						</Tabs.Panel>
					)}
				</Tabs>
			</PageContent>
		</PageWrapper>
	);
};

export default RolesPage;
