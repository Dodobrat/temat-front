import { useTranslation } from "react-i18next";
import WindowedSelect from "react-windowed-select";
import { useConfig, SwitchGroup } from "@dodobrat/react-ui-kit";

import { IconSun, IconMoon } from "../../../../components/ui/icons";
import SettingsItem from "../SettingsItem";
import SettingsWrapper from "../SettingsWrapper";
import { Bg, En } from "../../../../components/ui/flags";
import { Flex } from "@dodobrat/react-ui-kit";

//Add flags for better UX
const localeOptions = [
	{
		value: "en-US",
		label: (
			<Flex align='center'>
				<Flex.Col col='auto'>
					<En className='dui__icon' />
				</Flex.Col>
				<Flex.Col>English</Flex.Col>
			</Flex>
		),
	},
	{
		value: "bg-BG",
		label: (
			<Flex align='center'>
				<Flex.Col col='auto'>
					<Bg className='dui__icon' />
				</Flex.Col>
				<Flex.Col>Български</Flex.Col>
			</Flex>
		),
	},
];

const SettingsAppearance = () => {
	const {
		themeConfig: { dark, setDark },
	} = useConfig();

	const { t, i18n } = useTranslation();

	const isCurrentLocale: (lang: string) => boolean = (lang) => i18n.languages.includes(lang);

	return (
		<SettingsWrapper>
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
			<SettingsItem title={t("settings.changeLocale")} htmlFor='changeLocale'>
				<WindowedSelect
					inputId='changeLocale'
					className='temat__select__container'
					classNamePrefix='temat__select'
					menuPlacement='auto'
					isSearchable={false}
					isClearable={false}
					options={localeOptions}
					value={localeOptions.find((item) => isCurrentLocale(item.value))}
					onChange={(option) => i18n.changeLanguage(option.value)}
				/>
			</SettingsItem>
		</SettingsWrapper>
	);
};

export default SettingsAppearance;
