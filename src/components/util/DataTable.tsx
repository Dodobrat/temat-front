import React, { useEffect } from "react";
import { useTable, usePagination, useSortBy, Row, HeaderGroup } from "react-table";
import { Table, Card, Flex, Text, Button } from "@dodobrat/react-ui-kit";
import { IconFirstPage, IconBackPage, IconNextPage, IconLastPage, IconArrowDown, IconArrowUp } from "../ui/icons";
import NoDataRow from "../ui/tables/NoDataRow";
import WindowedSelect from "react-windowed-select";
import CopyCell from "./table_cells/CopyCell";
import cn from "classnames";
import ProductDetailsCell from "./table_cells/ProductDetailsCell";
import WithImageCell from "./table_cells/WithImageCell";
import SwitchCell from "./table_cells/SwitchCell";
import ActionsCell from "./table_cells/ActionsCell";
import DateCell from "./table_cells/DateCell";
import AddressCell from "./table_cells/AddressCell";
import CompanyMolCell from "./table_cells/CompanyMolCell";
import ContactsCell from "./table_cells/ContactsCell";
import PermissionRolesCell from "./table_cells/PermissionRolesCell";
import OrderStatusCell from "./table_cells/OrderStatusCell";
import { AllElevationOptions } from "@dodobrat/react-ui-kit/build/helpers/global.types";
import ShippingPlanStatusCell from "./table_cells/ShippingPlanStatusCell";
import { useTranslation } from "react-i18next";
import { useWindowResize } from "@dodobrat/react-ui-kit";

interface Props {
	columns: any[];
	data: any[];
	actions: any[];
	fetchData: any;
	loading: boolean;
	serverPageCount: number;
	serverTotalResults: number;
	elevation?: AllElevationOptions;
	stackHeader?: boolean;
	className?: string;
}

const paginationBtnProps = {
	equalDimensions: true,
	flavor: "default",
	pigment: "default",
	as: Button,
};

//Using container to reset scroll when switching pages
const CONTAINER = document?.querySelector(".dui__admin__inner");

const DataTable = ({
	columns,
	data,
	actions,
	fetchData,
	loading,
	serverPageCount,
	serverTotalResults,
	elevation,
	stackHeader = true,
	className,
}: Props) => {
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
	}: any = useTable(
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
		} as any,
		useSortBy,
		usePagination
	);

	const { t } = useTranslation();
	const { width } = useWindowResize(250);

	useEffect(() => {
		fetchData({ pageIndex, pageSize, sortBy });
	}, [fetchData, pageIndex, pageSize, sortBy]);

	useEffect(() => {
		CONTAINER?.scrollTo(0, 0);
	}, [page, pageSize]);

	const Header = ({ headerGroup }) => {
		return (
			<Table.Row {...headerGroup.getHeaderGroupProps()}>
				{headerGroup.headers.map((column) => {
					if (width <= column?.breakpoint) {
						return null;
					}
					return (
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
					);
				})}
			</Table.Row>
		);
	};

	const Row = ({ row }) => {
		return (
			<Table.Row {...row.getRowProps()}>
				{row.cells.map((cell) => {
					if (width <= cell.column?.breakpoint) {
						return null;
					}
					switch (cell.column.type) {
						case "DateTime":
						case "Date": {
							return <DateCell cell={cell} style={{ ...cell.column?.style }} {...cell.getCellProps()} />;
						}
						case "CopyToClipboard": {
							return cell.value && <CopyCell cell={cell} style={{ ...cell.column?.style }} {...cell.getCellProps()} />;
						}
						case "OrderStatus": {
							return <OrderStatusCell cell={cell} style={{ ...cell.column?.style }} {...cell.getCellProps()} />;
						}
						case "ShippingPlanStatus": {
							return <ShippingPlanStatusCell cell={cell} style={{ ...cell.column?.style }} {...cell.getCellProps()} />;
						}
						case "ProductDetails": {
							return <ProductDetailsCell cell={cell} style={{ ...cell.column?.style }} {...cell.getCellProps()} />;
						}
						case "PermissionRoles": {
							return <PermissionRolesCell cell={cell} style={{ ...cell.column?.style }} {...cell.getCellProps()} />;
						}
						case "WithImage": {
							return <WithImageCell cell={cell} style={{ ...cell.column?.style }} {...cell.getCellProps()} />;
						}
						case "Switch": {
							return <SwitchCell cell={cell} style={{ ...cell.column?.style }} {...cell.getCellProps()} />;
						}
						case "Address": {
							return <AddressCell cell={cell} style={{ ...cell.column?.style }} {...cell.getCellProps()} />;
						}
						case "CompanyMol": {
							return <CompanyMolCell cell={cell} style={{ ...cell.column?.style }} {...cell.getCellProps()} />;
						}
						case "Contact": {
							return <ContactsCell cell={cell} style={{ ...cell.column?.style }} {...cell.getCellProps()} />;
						}
						case "Actions": {
							return (
								actions.length > 0 && (
									<ActionsCell cell={cell} style={{ ...cell.column?.style }} actions={actions} {...cell.getCellProps()} />
								)
							);
						}
						default: {
							return (
								<Table.Cell style={{ ...cell.column?.style }} {...cell.getCellProps()}>
									<span className={cn({ "text--opaque": !cell.value })}>{cell.value ?? t("common.na")}</span>
								</Table.Cell>
							);
						}
					}
				})}
			</Table.Row>
		);
	};

	return (
		<div className={cn("temat__card__stack", className)}>
			{stackHeader && (
				<Card elevation={elevation}>
					<Card.Body id='datatable__header' className='pb--0 pt--2 px--2'></Card.Body>
				</Card>
			)}

			<Table {...getTableProps()} elevation='none' className='px--3'>
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
			<Card elevation={elevation}>
				<Card.Body className='pb--2 pt--0 px--2'>
					<Flex align='center' disableNegativeSpace>
						<Flex.Col col={{ base: "12", sm: "auto" }}>
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
						<Flex.Col col={{ base: "12", sm: "reset" }}>
							<Text className='mb--0 ml--sm--2 text--center text--sm--left'>
								{t("table.page")} <Text as='strong'>{pageIndex + 1}</Text> {t("common.of").toLowerCase()}{" "}
								<Text as='strong'>{pageOptions.length}</Text>
							</Text>
						</Flex.Col>
						<Flex.Col col={{ base: "reset", sm: "auto" }}>
							<Text className='mb--0'>
								<Text as='strong'>{serverTotalResults}</Text> {t("table.entries").toLowerCase()}
							</Text>
						</Flex.Col>
						<Flex.Col col='auto'>
							<WindowedSelect
								className='temat__select__container temat__table__sizes__select'
								classNamePrefix='temat__select'
								menuPlacement='auto'
								inputId='tablePerPageId'
								isSearchable={false}
								options={[10, 20, 30, 40, 50, 100].map((pageSize) => ({
									value: pageSize,
									label: pageSize,
								}))}
								value={{ value: pageSize, label: pageSize }}
								onChange={(option) => {
									setPageSize(Number(option.value));
								}}
							/>
						</Flex.Col>
					</Flex>
				</Card.Body>
			</Card>
		</div>
	);
};

export default DataTable;
