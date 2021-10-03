import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce, Tooltip, Flex, InputComponent } from "@dodobrat/react-ui-kit";

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
		<Flex wrap='nowrap' align='center'>
			<Flex.Col col='auto'>
				<IconSearch className='dui__icon' />
			</Flex.Col>
			<Flex.Col col='auto'>
				<InputComponent
					type='search'
					className='temat__table__search'
					placeholder={t("common.searchBy", { keyword: t("field.name") })}
					value={searchString}
					onChange={handleOnSearchChange}
					pigment={searchStringError ? "danger" : "primary"}
				/>
			</Flex.Col>
			<Flex.Col col='auto'>
				{searchStringError && (
					<Tooltip content={t("validation.minLength", { value: 2 })}>
						<div>
							<IconErrorCircle className='text--danger dui__icon' />
						</div>
					</Tooltip>
				)}
			</Flex.Col>
		</Flex>
	);
};

export default TableSearch;
