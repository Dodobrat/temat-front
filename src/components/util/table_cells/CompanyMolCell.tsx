import { Table } from "@dodobrat/react-ui-kit";

interface Props {
	cell: any;
}

const CompanyMolCell = (props: Props) => {
	const { cell, ...rest } = props;

	const rowValues = cell.row.original;

	return (
		<Table.Cell {...rest}>
			{rowValues?.molFirstName} {rowValues?.molLastName}
		</Table.Cell>
	);
};

export default CompanyMolCell;
