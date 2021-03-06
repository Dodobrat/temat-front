import { Badge, Table } from "@dodobrat/react-ui-kit";

interface Props {
	cell: any;
}

export const pickPigment = (status: string) => {
	const parsedStatus = status.trim().replace(" ", "").toLowerCase();

	switch (parsedStatus) {
		case "cancelled":
			return "danger";
		case "onhold":
			return "warning";
		case "processing":
		case "created":
			return "info";
		case "shipped":
		case "received":
			return "success";
		default:
			return "secondary";
	}
};

const OrderStatusCell = (props: Props) => {
	const { cell, ...rest } = props;

	return (
		<Table.Cell {...rest}>
			<Badge pigment={pickPigment(cell.value)}>{cell.value}</Badge>
		</Table.Cell>
	);
};

export default OrderStatusCell;
