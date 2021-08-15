import { Drawer, Card, Button, Text, Flex, Badge } from "@dodobrat/react-ui-kit";
import { IconClose } from "../../../components/ui/icons";
import cn from "classnames";
import { parseDate } from "../../../helpers/dateHelpers";
import { parseRoles } from "../../../helpers/helpers";

interface Props {
	onClose: () => void;
	[key: string]: any;
}

const viewKeyProps = {
	col: { base: "12", sm: "3" },
	className: "d--flex justify--flex-end",
};
const viewValueProps = {
	col: { base: "12", sm: "9" },
};

const PermissionsViewDrawer = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	return (
		<Drawer isOpen onClose={onClose} position='right' sizing='xl' animation='none' {...rest}>
			<Card elevation='none'>
				<Card.Header
					actions={
						<Button equalDimensions pigment='default' onClick={onClose}>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>Permission</Text>
				</Card.Header>
				<Card.Body>
					<Flex spacingY={{ base: "sm", sm: "lg" }}>
						<Flex.Col {...viewKeyProps}>
							<Badge pigment='secondary'>Name</Badge>
						</Flex.Col>
						<Flex.Col {...viewValueProps}>
							<Text className='mb--0 ellipsis'>{payload?.name}</Text>
						</Flex.Col>
						<Flex.Col {...viewKeyProps}>
							<Badge pigment='secondary'>Description</Badge>
						</Flex.Col>
						<Flex.Col {...viewValueProps}>
							<Text className='mb--0'>{payload?.description}</Text>
						</Flex.Col>
						<Flex.Col {...viewKeyProps}>
							<Badge pigment='secondary'>Roles</Badge>
						</Flex.Col>
						<Flex.Col {...viewValueProps}>
							{parseRoles(payload?.roles).map((role) => (
								<Badge key={role.value} pigment='warning' className='mr--2'>
									{role.label}
								</Badge>
							))}
						</Flex.Col>
						<Flex.Col {...viewKeyProps}>
							<Badge pigment='secondary'>Status</Badge>
						</Flex.Col>
						<Flex.Col {...viewValueProps}>
							<Text
								as='strong'
								className={cn({
									"text--success": !!payload?.active,
									"text--danger": !payload?.active,
								})}>
								{!!payload?.active ? "Active" : "Inactive"}
							</Text>
						</Flex.Col>
						<Flex.Col {...viewKeyProps}>
							<Badge pigment='secondary'>Created</Badge>
						</Flex.Col>
						<Flex.Col {...viewValueProps}>
							<Text className='mb--0'>{parseDate(payload?.dateCreated, true)}</Text>
						</Flex.Col>
					</Flex>
				</Card.Body>
			</Card>
		</Drawer>
	);
};

export default PermissionsViewDrawer;
