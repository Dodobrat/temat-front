import { useConfig, SwitchGroup } from "@dodobrat/react-ui-kit";
import { IconSun, IconMoon } from "../../../components/ui/icons";
import { useTranslation } from "react-i18next";
import SettingsItem from "./SettingsItem";

const SettingsAppearance = () => {
	const {
		themeConfig: { dark, setDark },
	} = useConfig();

	const { t } = useTranslation();

	return (
		<>
			<SettingsItem title={t("settings.changeTheme")}>
				<SwitchGroup
					name='theme-switch'
					sizing='sm'
					onSwitch={({ option }) => setDark(option.value)}
					options={[
						{ label: <IconSun />, value: false },
						{ label: <IconMoon />, value: true },
					]}
					activeOption={dark}
				/>
			</SettingsItem>
		</>
	);
};

export default SettingsAppearance;
