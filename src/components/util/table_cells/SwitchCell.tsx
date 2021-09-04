import { Tooltip, SwitchComponent, Table } from "@dodobrat/react-ui-kit";

interface Props {
	cell: any;
}

const SwitchCell = (props: Props) => {
	const { cell, ...rest } = props;

	return (
		<Table.Cell {...rest}>
			<Tooltip sizing='xs' content={<strong>{`toggle`.toUpperCase()}</strong>} position='left-center'>
				<div>
					<SwitchComponent
						defaultChecked={cell.value}
						onChange={(e: any) => cell.column.action({ value: e.target.checked, entry: cell.row.original })}
						sizing='lg'
					/>
				</div>
			</Tooltip>
		</Table.Cell>
	);
};

export default SwitchCell;
