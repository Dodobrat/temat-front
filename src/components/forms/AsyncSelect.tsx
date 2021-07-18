import cn from "classnames";
import {
	AsyncPaginate,
	// wrapMenuList
} from "react-select-async-paginate";
import { useStateWithPromise } from "../../hooks/useStateWithPromise";
import { errorToast } from "../../helpers/toastEmitter";

// import { WindowedMenuList } from "react-windowed-select";

// const WindowedList = wrapMenuList(WindowedMenuList);

interface Props {
	useFetch: any;
	valueKey?: string;
	labelKey?: string;
	querySpecs?: any;
	[key: string]: any;
}

const AsyncSelect = (props: Props) => {
	const { useFetch, valueKey = "id", labelKey = "name", querySpecs = {}, querySpecialKey, className, ...rest } = props;

	const [queryParams, setQueryParams] = useStateWithPromise({
		filters: {
			withColumns: "false",
			page: 0,
			perPage: 20,
			searchString: "",
		},
	});

	const { refetch } = useFetch({
		specs: {
			...queryParams,
			...querySpecs,
		},
		queryConfig: {
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => errorToast(err),
		},
		specialKey: ["select", queryParams, querySpecialKey],
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
		const fetchedData = await data;

		const responseData = await fetchedData?.data?.reduce(
			(final: any, item: any) => [
				...final,
				{
					value: item[valueKey],
					label: item[labelKey],
					data: item,
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
		<AsyncPaginate
			className={cn(
				"temat__select__container",
				// 'async-select',
				className
			)}
			classNamePrefix='temat__select'
			debounceTimeout={300}
			// components={{ MenuList: WindowedList as any }}
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
