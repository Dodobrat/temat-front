import { Flex, Text } from "@dodobrat/react-ui-kit";

interface Props {
	title: string;
	hint?: string;
	children: React.ReactNode;
	[key: string]: any;
}

const SettingsItem = (props: Props) => {
	const { title, hint, children, ...rest } = props;

	return (
		<Flex spacingY={null} spacingX={null} {...rest}>
			<Flex.Col col={{ base: "12", sm: "10", md: "8", xl: "6" }} offset={{ base: null, sm: "1", md: "2", lg: "3" }}>
				<Flex align='flex-start' spacingX='md'>
					<Flex.Col col={{ base: "12", sm: "4", lg: "3" }}>
						<Text className='text--sm--right mb--1'>{title}</Text>
						{hint && <Text className='text--sm--right mb--1 text--opaque'>{hint}</Text>}
					</Flex.Col>
					<Flex.Col col={{ base: "12", sm: "8", lg: "6" }}>{children}</Flex.Col>
				</Flex>
			</Flex.Col>
		</Flex>
	);
};

export default SettingsItem;
