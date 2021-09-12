import { Flex, Text } from "@dodobrat/react-ui-kit";

interface Props {
	title?: string;
	htmlFor?: string;
	children: React.ReactNode;
	[key: string]: any;
}

const SettingsItem = (props: Props) => {
	const { title, hint, children, htmlFor, ...rest } = props;

	return (
		<Flex spacingY={null} spacingX={null} {...rest}>
			<Flex.Col col={{ base: "12", sm: "10", md: "8", xl: "6" }} offset={{ base: null, sm: "1", md: "2", lg: "3" }}>
				<Flex align='flex-start' spacingX='md' spacingY={null}>
					<Flex.Col col={{ base: "12", sm: "4", lg: "3" }}>
						<Text as='label' htmlFor={htmlFor} className='d--block text--sm--right mb--0 ml--1 ml--sm--0'>
							{title}
						</Text>
					</Flex.Col>
					<Flex.Col col={{ base: "12", sm: "8", lg: "6" }}>{children}</Flex.Col>
				</Flex>
			</Flex.Col>
		</Flex>
	);
};

export default SettingsItem;
