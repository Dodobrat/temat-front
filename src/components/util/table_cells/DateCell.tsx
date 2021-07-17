import { Badge, Table } from "@dodobrat/react-ui-kit";
import { parseDate } from "../../../helpers/dateHelpers";

interface Props {
	cell: any;
}

const DateCell = (props: Props) => {
	const { cell, ...rest } = props;

	return (
		<Table.Cell {...rest}>
			<Badge pigment='secondary'>{parseDate(cell.value, cell.column.type === "DateTime")}</Badge>
		</Table.Cell>
	);
};

export default DateCell;
