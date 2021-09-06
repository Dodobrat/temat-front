import { useTranslation } from "react-i18next";
import { Drawer, Card, Button, Text, Flex, Badge } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { IconClose } from "../../../components/ui/icons";
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

	const { t } = useTranslation();

	return (
		<Drawer isOpen onClose={onClose} position='right' sizing='xl' animation='none' {...rest}>
			<Card elevation='none'>
				<Card.Header
					actions={
						<Button equalDimensions pigment='default' onClick={onClose}>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{t("common.permission")}</Text>
				</Card.Header>
				<Card.Body>
					<Flex spacingY={{ base: "sm", sm: "lg" }}>
						<Flex.Col {...viewKeyProps}>
							<Badge pigment='secondary'>{t("field.name")}</Badge>
						</Flex.Col>
						<Flex.Col {...viewValueProps}>
							<Text className='mb--0 ellipsis'>{payload?.name}</Text>
						</Flex.Col>
						<Flex.Col {...viewKeyProps}>
							<Badge pigment='secondary'>{t("field.description")}</Badge>
						</Flex.Col>
						<Flex.Col {...viewValueProps}>
							<Text className='mb--0'>{payload?.description}</Text>
						</Flex.Col>
						<Flex.Col {...viewKeyProps}>
							<Badge pigment='secondary'>{t("field.role", { count: 0 })}</Badge>
						</Flex.Col>
						<Flex.Col {...viewValueProps}>
							{parseRoles(payload?.roles).map((role) => (
								<Badge key={role.value} pigment='warning' className='mr--2'>
									{role.label}
								</Badge>
							))}
						</Flex.Col>
						<Flex.Col {...viewKeyProps}>
							<Badge pigment='secondary'>{t("field.status")}</Badge>
						</Flex.Col>
						<Flex.Col {...viewValueProps}>
							<Text
								as='strong'
								className={cn({
									"text--success": !!payload?.active,
									"text--danger": !payload?.active,
								})}>
								{!!payload?.active ? t("common.active") : t("common.inactive")}
							</Text>
						</Flex.Col>
						<Flex.Col {...viewKeyProps}>
							<Badge pigment='secondary'>{t("common.created")}</Badge>
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
