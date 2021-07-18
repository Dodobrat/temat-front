import React, { createContext, useContext, useMemo, useState } from "react";

const OrdersContext = createContext(null);

interface OrdersProviderProps {
	initialData?: any;
	children?: React.ReactNode;
}

const OrdersProvider: React.FC<OrdersProviderProps> = ({ children, initialData }) => {
	const [currStep, setCurrStep] = useState(1);
	const [toggledSummaryPanels, setToggledSummaryPanels] = useState({
		products: false,
		shipping: false,
		payment: false,
	});
	const [data, setData] = useState(
		initialData ?? {
			products: [],
			shipping: {},
			payment: {},
		}
	);

	const stepValue = useMemo(() => ({ currStep, setCurrStep }), [currStep, setCurrStep]);
	const panelsValue = useMemo(() => ({ toggledSummaryPanels, setToggledSummaryPanels }), [toggledSummaryPanels, setToggledSummaryPanels]);
	const dataValue = useMemo(() => ({ data, setData }), [data, setData]);

	return (
		<OrdersContext.Provider
			value={{
				stepValue,
				panelsValue,
				dataValue,
			}}>
			{children}
		</OrdersContext.Provider>
	);
};

export const useOrdersContext = () => {
	const context = useContext(OrdersContext);

	if (context === undefined) {
		throw new Error("useOrdersContext must be used within a OrdersProvider");
	}

	return context;
};

export default OrdersProvider;
