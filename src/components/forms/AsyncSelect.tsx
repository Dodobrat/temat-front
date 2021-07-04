import { withAsyncPaginate } from "react-select-async-paginate";
import WindowedSelect from "react-windowed-select";
import cn from "classnames";
import { useStateWithPromise } from "../../hooks/useStateWithPromise";

const WindowedAsyncPaginate = withAsyncPaginate(WindowedSelect);

interface Props {
	useFetch: any;
	valueKey?: string;
	labelKey?: string;
	[key: string]: any;
}

const AsyncSelect = (props: Props) => {
	const { useFetch, valueKey = "id", labelKey = "name", className, ...rest } = props;

	const [queryParams, setQueryParams] = useStateWithPromise({
		filters: {
			withColumns: "false",
			page: 0,
			perPage: 20,
			searchString: "",
		},
	});

	const { refetch } = useFetch({
		specs: queryParams,
		queryConfig: {
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => console.log(err),
		},
		specialKey: ["select", queryParams],
	});

	const updateQueryPage = async ({ page, searchString }) => {
		return setQueryParams((prev) => ({
			filters: {
				...prev.filters,
				page,
				searchString,
			},
		}));
	};

	const loadOptions = async (search: string, page: number) => {
		if (search.length < 3 && search.length !== 0) {
			return {
				options: [{ value: "min_char", label: "Min 3 characters", isDisabled: true }],
				hasMore: false,
				additional: {
					page: page + 1,
				},
			};
		}
		const { data } = await refetch();
		// queryClient.getQueryData([queryMainKey, ["select", queryParams]]);
		const fetchedData = await data;

		const responseData = await fetchedData?.data?.reduce(
			(final: any, item: any) => [
				...final,
				{
					value: item[valueKey],
					label: item[labelKey],
				},
			],
			[]
		);

		const { currentPage, lastPage } = await fetchedData?.meta;
		const nextPage = currentPage + 1;

		return {
			options: responseData ?? [],
			hasMore: nextPage <= lastPage,
			additional: {
				page: page + 1,
			},
		};
	};

	return (
		<WindowedAsyncPaginate
			className={cn("temat__select__container", className)}
			classNamePrefix='temat__select'
			debounceTimeout={300}
			loadOptions={async (search, _, { page }) => {
				await updateQueryPage({ page, searchString: search });
				const result = await loadOptions(search, page);

				return result;
			}}
			{...rest}
			additional={{
				page: 0,
			}}
		/>
	);
};

export default AsyncSelect;
