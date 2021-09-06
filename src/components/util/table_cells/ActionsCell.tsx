import { useState } from "react";
import { Button, Flex, Table, ZoomPortal } from "@dodobrat/react-ui-kit";
import { IconEdit, IconEye, IconTrash, IconUserManage } from "../../ui/icons";
import ActionConfirmation from "../ActionConfirmation";
import { Tooltip } from "@dodobrat/react-ui-kit";
import { useTranslation } from "react-i18next";

interface Props {
	cell: any;
	actions: any;
}

const selectActionPigment = (type: string) => {
	switch (type) {
		case "view":
			return "info";
		case "edit":
			return "warning";
		case "edit-users":
			return "success";
		case "delete":
			return "danger";
		case "restore":
			return "warning";
		default:
			return "secondary";
	}
};

const selectActionIcon = (type: string) => {
	switch (type) {
		case "view":
			return <IconEye />;
		case "edit":
			return <IconEdit />;
		case "edit-users":
			return <IconUserManage />;
		case "delete":
			return <IconTrash />;
		case "restore":
			return "warning";
		default:
			return "secondary";
	}
};

const ActionsCell = (props: Props) => {
	const { cell, actions, ...rest } = props;

	const { t } = useTranslation();

	const [confirmation, setConfirmation] = useState({ state: false, actionType: "delete", payload: null });

	const closeConfirmation = () => setConfirmation((prev) => ({ ...prev, state: false }));

	return (
		<>
			<Table.Cell {...rest}>
				<Flex wrap='nowrap' align='center' justify='flex-end'>
					{actions.map((action, idx) => (
						<Flex.Col col='auto' key={`${action.type}_${idx}`}>
							<Tooltip sizing='xs' content={<strong>{t(`action.${action.type.toLowerCase()}`).toUpperCase()}</strong>}>
								<Button
									equalDimensions
									pigment={selectActionPigment(action.type)}
									{...action?.props?.(cell.row.original)}
									onClick={
										action?.withConfirmation
											? () =>
													setConfirmation({
														state: true,
														actionType: action.type.toLowerCase(),
														payload: () => action?.action?.(cell.row.original),
													})
											: () => action?.action?.(cell.row.original)
									}>
									{selectActionIcon(action.type)}
								</Button>
							</Tooltip>
						</Flex.Col>
					))}
				</Flex>
			</Table.Cell>
			<ZoomPortal in={confirmation.state}>
				<ActionConfirmation onClose={closeConfirmation} payload={confirmation.payload} actionType={confirmation.actionType} />
			</ZoomPortal>
		</>
	);
};

export default ActionsCell;
