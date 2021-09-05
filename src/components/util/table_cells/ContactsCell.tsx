import { Table } from "@dodobrat/react-ui-kit";
import { IconMail, IconPhone } from "../../ui/icons";

interface Props {
	cell: any;
}

const ContactsCell = (props: Props) => {
	const { cell, ...rest } = props;

	const rowValues = cell.row.original;

	return (
		<Table.Cell {...rest}>
			{rowValues?.phone && (
				<a href={`tel:${rowValues?.phone}`} className='bgtext--default d--block temat__table__contact'>
					<IconPhone className='mr--1' /> {rowValues?.phone}
				</a>
			)}
			{rowValues?.receiverPhone && (
				<a
					href={`tel:${rowValues?.receiverPhoneCode}${rowValues?.receiverPhone}`}
					className='bgtext--default d--block temat__table__contact'>
					<IconPhone className='mr--1' /> {rowValues?.receiverPhoneCode}
					{rowValues?.receiverPhone}
				</a>
			)}
			{rowValues?.email && (
				<a href={`mailto:${rowValues?.email}`} className='bgtext--default d--block temat__table__contact'>
					<IconMail className='mr--1' /> {rowValues?.email}
				</a>
			)}
		</Table.Cell>
	);
};

export default ContactsCell;
