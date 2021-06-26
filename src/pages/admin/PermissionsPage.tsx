import React, { useCallback, useMemo, useState } from "react";
import PageWrapper from "../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../components/ui/wrappers/PageHeader";
import PageContent from "../../components/ui/wrappers/PageContent";
import { Heading, Flex, Button } from "@dodobrat/react-ui-kit";
import { Helmet } from "react-helmet";
import { usePermissions } from "../../actions/fetchHooks";
import { useEffect } from "react";
import DataTable from "../../components/util/DataTable";

const UsersPage = () => {
	const [queryParams, setQueryParams] = useState({
		sortBy: [],
		filters: {
			page: 0,
			perPage: 10,
		},
	});

	const { data, refetch, isFetching, isStale } = usePermissions({
		specs: queryParams,
		queryConfig: {
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => console.log(err),
		},
		specialKey: queryParams,
	});

	const fetchedData = useMemo(() => data ?? null, [data]);

	const columns = useMemo(() => {
		if (fetchedData) {
			return [
				{ Header: "Name", accessor: "name" },
				{ Header: "roleId", accessor: "roleId" },
				{ Header: "Actions", accessor: "actions" },
			];

			// return data.columns.map((item: any) => {
			// 	if (item.accessor === "actions") {
			// 		return {
			// 			Header: item.title,
			// 			disableSortBy: item.disableSortBy,
			// 			type: "actions",
			// 		};
			// 	} else {
			// 		return {
			// 			Header: item.title,
			// 			accessor: item.accessor,
			// 			disableSortBy: item.disableSortBy,
			// 		};
			// 	}
			// });
		}
		return [];
	}, [fetchedData]);

	// const currentPage = fetchedData?.meta?.currentPage;
	// const currentPerPage = fetchedData?.meta?.perPage;

	const fetchData = useCallback(({ pageSize, pageIndex, sortBy }) => {
		setQueryParams((prev) => ({
			...prev,
			sortBy,
			filters: {
				page: pageIndex,
				perPage: pageSize,
			},
		}));
	}, []);

	useEffect(() => {
		if (isStale) {
			refetch();
		}
	}, [queryParams, refetch, isStale]);

	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | Permissions</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							Permissions
						</Heading>
					</Flex.Col>
					<Flex.Col col='auto'>
						<Button>Filters</Button>
					</Flex.Col>
				</Flex>
			</PageHeader>
			<PageContent>
				<DataTable
					columns={columns}
					data={fetchedData?.data ?? []}
					fetchData={fetchData}
					loading={isFetching}
					serverPageCount={fetchedData?.meta?.lastPage}
					serverTotalResults={fetchedData?.meta?.total}
				/>
			</PageContent>
		</PageWrapper>
	);
};

export default UsersPage;
