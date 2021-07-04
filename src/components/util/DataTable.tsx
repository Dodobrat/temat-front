// @ts-nocheck
import React, { useEffect } from "react";
import { useTable, usePagination, useSortBy, Row, HeaderGroup } from "react-table";
import { Table, Card, Flex, Text, Badge, Button, Select, SwitchComponent } from "@dodobrat/react-ui-kit";
import {
	IconUserManage,
	IconEdit,
	IconTrash,
	IconEye,
	IconFirstPage,
	IconBackPage,
	IconNextPage,
	IconLastPage,
	IconArrowDown,
	IconArrowUp,
} from "../ui/icons/index";
import { parseDate } from "../../helpers/dateHelpers";
import NoDataRow from "../ui/tables/NoDataRow";

interface Props {
	columns: any[];
	data: any[];
	actions: any[];
	fetchData: any;
	loading: boolean;
	serverPageCount: number;
	serverTotalResults: number;
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

const paginationBtnProps = {
	equalDimensions: true,
	flavor: "default",
	pigment: "default",
	as: Button,
};

const DataTable = ({ columns, data, actions, fetchData, loading, serverPageCount, serverTotalResults }: Props) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize, sortBy },
	} = useTable(
		{
			columns,
			data,
			initialState: {
				pageIndex: 0,
				pageSize: 10,
				sortBy: [],
			},
			manualPagination: true,
			manualSortBy: true,
			pageCount: serverPageCount + 1,
			autoResetPage: false,
			autoResetSortBy: false,
		},
		useSortBy,
		usePagination
	);

	useEffect(() => {
		fetchData({ pageIndex, pageSize, sortBy });
	}, [fetchData, pageIndex, pageSize, sortBy]);

	const Header = ({ headerGroup }) => {
		return (
			<Table.Row {...headerGroup.getHeaderGroupProps()}>
				{headerGroup.headers.map((column) => (
					<Table.HCell {...column.getHeaderProps(column.getSortByToggleProps())}>
						<Flex wrap='nowrap'>
							<Flex.Col style={{ textAlign: column.type === "Actions" ? "right" : "left" }}>
								{column.render("Header")}
							</Flex.Col>
							{!column.disableSortBy && (
								<Flex.Col col='auto'>
									{column.isSorted ? column.isSortedDesc ? <IconArrowDown /> : <IconArrowUp /> : ""}
								</Flex.Col>
							)}
						</Flex>
					</Table.HCell>
				))}
			</Table.Row>
		);
	};

	const Row = ({ row }) => {
		return (
			<Table.Row {...row.getRowProps()}>
				{row.cells.map((cell) => {
					if (cell.column.type === "DateTime" || cell.column.type === "Date") {
						return (
							<Table.Cell {...cell.getCellProps()}>
								<Badge pigment='secondary' className='mx--auto'>
									{parseDate(cell.value, cell.column.type === "DateTime")}
								</Badge>
							</Table.Cell>
						);
					}
					if (cell.column.type === "Switch") {
						return (
							<Table.Cell {...cell.getCellProps()}>
								<SwitchComponent
									defaultChecked={cell.value}
									onChange={(e: any) => cell.column.action({ value: e.target.checked, entry: cell.row.original })}
									sizing='lg'
								/>
							</Table.Cell>
						);
					}
					if (actions.length > 0 && cell.column.type === "Actions") {
						return (
							<Table.Cell {...cell.getCellProps()}>
								<Flex wrap='nowrap' align='center' justify='flex-end'>
									{actions.map((action, idx) => (
										<Flex.Col col='auto' key={`${action.type}_${idx}`}>
											<Button
												equalDimensions
												pigment={selectActionPigment(action.type)}
												onClick={() => action.action(cell.row.original)}>
												{selectActionIcon(action.type)}
											</Button>
										</Flex.Col>
									))}
								</Flex>
							</Table.Cell>
						);
					}
					return <Table.Cell {...cell.getCellProps()}>{cell.render("Cell")}</Table.Cell>;
				})}
			</Table.Row>
		);
	};

	return (
		<div className='temat__card__stack'>
			<Card>
				<Card.Body id='datatable__header' className='pb--0 pt--2 px--2'></Card.Body>
			</Card>
			<Table {...getTableProps()} elevation='none'>
				<Table.Head>
					{headerGroups.map((headerGroup: HeaderGroup<object>, idx: React.Key) => (
						<Header key={idx} headerGroup={headerGroup} />
					))}
				</Table.Head>
				<Table.Body {...getTableBodyProps()}>
					{data.length === 0 && <NoDataRow />}
					{page.map((row: Row<object>) => {
						prepareRow(row);
						return <Row key={row.id} row={row} />;
					})}
				</Table.Body>
			</Table>
			<Card>
				<Card.Body className='pb--2 pt--0 px--2'>
					<Flex align='center' disableNegativeSpace>
						<Flex.Col col='auto'>
							<Flex disableNegativeSpace>
								<Flex.Col onClick={() => gotoPage(0)} disabled={!canPreviousPage} {...paginationBtnProps}>
									<IconFirstPage />
								</Flex.Col>
								<Flex.Col onClick={() => previousPage()} disabled={!canPreviousPage} {...paginationBtnProps}>
									<IconBackPage />
								</Flex.Col>
								<Flex.Col onClick={() => nextPage()} disabled={!canNextPage} {...paginationBtnProps}>
									<IconNextPage />
								</Flex.Col>
								<Flex.Col onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} {...paginationBtnProps}>
									<IconLastPage />
								</Flex.Col>
							</Flex>
						</Flex.Col>
						<Flex.Col>
							<Text className='mb--0 ml--2'>
								Page <Text as='strong'>{pageIndex + 1}</Text> of <Text as='strong'>{pageOptions.length}</Text>
							</Text>
						</Flex.Col>
						<Flex.Col col='auto'>
							<Text className='mb--0'>
								<Text as='strong'>{serverTotalResults}</Text> entries
							</Text>
						</Flex.Col>
						<Flex.Col col='auto'>
							<Select
								className='temat__table__sizes__select'
								value={pageSize}
								onChange={(e: { target: { value: any } }) => {
									setPageSize(Number(e.target.value));
								}}>
								{[10, 20, 30, 40, 50, 100].map((pageSize) => (
									<option key={pageSize} value={pageSize}>
										Show {pageSize}
									</option>
								))}
							</Select>
						</Flex.Col>
					</Flex>
				</Card.Body>
			</Card>
		</div>
	);
};

export default DataTable;
