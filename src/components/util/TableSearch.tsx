import { useDebounce } from "@dodobrat/react-ui-kit";
import { Tooltip } from "@dodobrat/react-ui-kit";
import { Input } from "@dodobrat/react-ui-kit";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconErrorCircle, IconSearch } from "../ui/icons";

const TableSearch = ({ onSearch }) => {
	const { t } = useTranslation();

	const [searchString, setSearchString] = useState("");
	const [searchStringError, setSearchStringError] = useState(false);

	const debouncedSearchString = useDebounce(!searchStringError ? searchString : "", 500);

	const handleOnSearchChange = (e: any) => {
		const stringValue = e.target.value;
		setSearchString(stringValue);

		if (stringValue.length === 1) {
			setSearchStringError(true);
		} else {
			setSearchStringError(false);
		}
	};

	useEffect(() => {
		onSearch?.(debouncedSearchString);
	}, [onSearch, debouncedSearchString]);

	return (
		<Input
			type='search'
			className='temat__table__search'
			placeholder={t("common.searchBy", { keyword: t("field.name") })}
			value={searchString}
			onChange={handleOnSearchChange}
			pigment={searchStringError ? "danger" : "primary"}
			preffix={<IconSearch className='dui__icon' />}
			suffix={
				searchStringError && (
					<Tooltip content={t("validation.minLength", { value: 2 })}>
						<div>
							<IconErrorCircle className='text--danger dui__icon' />
						</div>
					</Tooltip>
				)
			}
		/>
	);
};

export default TableSearch;
