import { Badge, Table } from "@dodobrat/react-ui-kit";
import { useState } from "react";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { IconClipboardCheck, IconClipboard } from "../../components/ui/icons";
import { useEffect } from "react";

interface Props {
	cell: any;
}

const CopyCell = (props: Props) => {
	const { cell, ...rest } = props;

	const { copy } = useCopyToClipboard();

	const [isCopied, setIsCopied] = useState(false);

	const handleOnCellClick = () => {
		copy(cell.value);
		setIsCopied(true);
	};

	useEffect(() => {
		const handler = setTimeout(() => {
			setIsCopied(false);
		}, 2500);

		return () => {
			clearTimeout(handler);
		};
	}, [isCopied]);

	return (
		<Table.Cell {...rest}>
			<Badge sizing='lg' pigment='primary' onClick={handleOnCellClick}>
				{isCopied ? <IconClipboardCheck /> : <IconClipboard />} {cell.value}
			</Badge>
		</Table.Cell>
	);
};

export default CopyCell;
