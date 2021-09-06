import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip, Badge, Table } from "@dodobrat/react-ui-kit";

import { useCopyToClipboard } from "../../../hooks/useCopyToClipboard";

import { IconClipboardCheck, IconClipboard } from "../../ui/icons";

interface Props {
	cell: any;
}

const CopyCell = (props: Props) => {
	const { cell, ...rest } = props;

	const { t } = useTranslation();
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
			<Tooltip sizing='xs' content={<strong>{t("common.copyToClipboard").toUpperCase()}</strong>}>
				<Badge sizing='lg' pigment='primary' onClick={handleOnCellClick}>
					{isCopied ? <IconClipboardCheck /> : <IconClipboard />} {cell.value}
				</Badge>
			</Tooltip>
		</Table.Cell>
	);
};

export default CopyCell;
