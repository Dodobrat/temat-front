import React from "react";
import { SwitchComponent, Table } from "@dodobrat/react-ui-kit";

interface Props {
	cell: any;
}

const SwitchCell = (props: Props) => {
	const { cell, ...rest } = props;

	return (
		<Table.Cell {...rest}>
			<SwitchComponent
				defaultChecked={cell.value}
				onChange={(e: any) => cell.column.action({ value: e.target.checked, entry: cell.row.original })}
				sizing='lg'
			/>
		</Table.Cell>
	);
};

export default SwitchCell;
