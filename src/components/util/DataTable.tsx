// @ts-nocheck
import React, { useEffect } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import {
	Table,
	Flex,
	Text,
	ButtonGroup,
	Button,
	SelectComponent,
	IconDoubleCaretLeft,
	IconCaretLeft,
	IconCaretRight,
	IconDoubleCaretRight,
} from "@dodobrat/react-ui-kit";

interface Props {
	columns: any[];
	data: any;
	fetchData: any;
	loading: boolean;
	serverPageCount: number;
	serverTotalResults: number;
}

const DataTable = ({ columns, data, fetchData, loading, serverPageCount, serverTotalResults }: Props) => {
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
		// Get the state from the instance
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
			pageCount: serverPageCount,
			autoResetPage: false,
			autoResetSortBy: false,
		},
		useSortBy,
		usePagination
	);

	useEffect(() => {
		fetchData({ pageIndex, pageSize, sortBy });
	}, [fetchData, pageIndex, pageSize, sortBy]);

	return (
		<>
			<Table {...getTableProps()} elevation='none'>
				<Table.Head>
					{headerGroups.map((headerGroup) => (
						<Table.Row {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<Table.HCell {...column.getHeaderProps(column.getSortByToggleProps())}>
									{column.render("Header")}
									<span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
								</Table.HCell>
							))}
						</Table.Row>
					))}
				</Table.Head>
				<Table.Body {...getTableBodyProps()}>
					{page.map((row, i) => {
						prepareRow(row);
						return (
							<Table.Row {...row.getRowProps()}>
								{row.cells.map((cell) => {
									return <Table.Cell {...cell.getCellProps()}>{cell.render("Cell")}</Table.Cell>;
								})}
							</Table.Row>
						);
					})}
				</Table.Body>
			</Table>
			<Flex align='center' className='py--2'>
				<Flex.Col col='auto'>
					<ButtonGroup pigment='default'>
						<Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
							<IconDoubleCaretLeft className='dui__icons' />
						</Button>
						<Button onClick={() => previousPage()} disabled={!canPreviousPage}>
							<IconCaretLeft className='dui__icons' />
						</Button>
						<Button onClick={() => nextPage()} disabled={!canNextPage}>
							<IconCaretRight className='dui__icons' />
						</Button>
						<Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
							<IconDoubleCaretRight className='dui__icons' />
						</Button>
					</ButtonGroup>
				</Flex.Col>
				<Flex.Col>
					<Text className='mb--0'>
						Page <Text as='strong'>{pageIndex + 1}</Text> of <Text as='strong'>{pageOptions.length}</Text>
					</Text>
				</Flex.Col>
				<Flex.Col col='auto'>
					<Text className='mb--0'>
						<Text as='strong'>{serverTotalResults}</Text> entries
					</Text>
				</Flex.Col>
				<Flex.Col col='auto'>
					<SelectComponent
						value={pageSize}
						onChange={(e) => {
							setPageSize(Number(e.target.value));
						}}>
						{[10, 20, 30, 40, 50, 100].map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								Show {pageSize}
							</option>
						))}
					</SelectComponent>
				</Flex.Col>
			</Flex>
		</>
	);
};

export default DataTable;
