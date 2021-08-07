import { Badge, Table } from "@dodobrat/react-ui-kit";

interface Props {
	cell: any;
}

export const pickPigment = (status: string) => {
	const parsedStatus = status.trim().replace(" ", "").toLowerCase();

	switch (parsedStatus) {
		case "rejected":
		case "cancelled":
			return "danger";
		case "partial":
			return "warning";
		case "processing":
		case "created":
			return "info";
		case "received":
			return "success";
		default:
			return "secondary";
	}
};

const ShippingPlanStatusCell = (props: Props) => {
	const { cell, ...rest } = props;

	return (
		<Table.Cell {...rest}>
			<Badge pigment={pickPigment(cell.value)}>{cell.value}</Badge>
		</Table.Cell>
	);
};

export default ShippingPlanStatusCell;
