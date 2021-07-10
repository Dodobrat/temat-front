import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";
import { Helmet } from "react-helmet";
import { Heading, Flex, Tabs } from "@dodobrat/react-ui-kit";
import { useTranslation } from "react-i18next";
import SettingsAppearance from "./SettingsAppearance";

const RolesPage = () => {
	const { t } = useTranslation();

	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | Settings</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("pages.settings")}
						</Heading>
					</Flex.Col>
				</Flex>
			</PageHeader>
			<PageContent>
				<Tabs activeTab={0}>
					<Tabs.Panel tab={t("settings.appearance")}>
						<SettingsAppearance />
					</Tabs.Panel>
				</Tabs>
			</PageContent>
		</PageWrapper>
	);
};

export default RolesPage;
