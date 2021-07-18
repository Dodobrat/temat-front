import { Flex, FormControl } from "@dodobrat/react-ui-kit";
import { useOrdersContext } from "../../../../context/OrdersContext";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import WindowedSelect from "react-windowed-select";
import { Input } from "@dodobrat/react-ui-kit";

const selectProps = {
	className: "temat__select__container",
	classNamePrefix: "temat__select",
	menuPlacement: "auto",
	isSearchable: false,
};

const paymentOptions = [
	{ value: "paid", label: "Paid" },
	{ value: "nalojen", label: "Nalojen" },
];
const currencyOptions = [
	{ value: "BGN", label: "BGN - лв." },
	{ value: "EUR", label: "EUR - €" },
];

const OrderStepPayment = () => {
	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
	} = useOrdersContext();

	const handleValueUpdate = (key, val) => {
		setData((prev) => ({
			...prev,
			payment: {
				...prev.payment,
				[key]: val,
			},
		}));
	};

	return (
		<Flex>
			<Flex.Col col='12'>
				<FormControl label={t("orders.paymentMethod")} htmlFor='paymentMethod' className={cn("")} hintMsg={""}>
					<WindowedSelect
						{...selectProps}
						options={paymentOptions}
						value={data?.payment?.paymentMethod}
						onChange={(option) => handleValueUpdate("paymentMethod", option)}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='7'>
				<FormControl label={t("orders.amount")} htmlFor='amount' className={cn("")} hintMsg={""}>
					<Input
						type='number'
						name='amount'
						value={data?.payment?.amount ?? ""}
						onChange={({ target }) => handleValueUpdate("amount", target.value)}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='5'>
				<FormControl label={t("orders.currency")} htmlFor='currency' className={cn("")} hintMsg={""}>
					<WindowedSelect
						{...selectProps}
						options={currencyOptions}
						value={data?.payment?.currency}
						onChange={(option) => handleValueUpdate("currency", option)}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='12'>
				<FormControl label={t("orders.payee")} htmlFor='currency' className={cn("")} hintMsg={""}>
					<Input
						name='payee'
						value={data?.payment?.payee ?? ""}
						onChange={({ target }) => handleValueUpdate("payee", target.value)}
					/>
				</FormControl>
			</Flex.Col>
		</Flex>
	);
};

export default OrderStepPayment;
