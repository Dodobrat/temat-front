import React, { createContext, useContext, useMemo, useState } from "react";

const OrdersContext = createContext(null);

interface OrdersProviderProps {
	initialData?: any;
	children?: React.ReactNode;
}

const OrdersProvider: React.FC<OrdersProviderProps> = ({ children, initialData }) => {
	const [currStep, setCurrStep] = useState(1);
	const [data, setData] = useState(initialData ?? null);

	const stepValue = useMemo(() => ({ currStep, setCurrStep }), [currStep, setCurrStep]);
	const dataValue = useMemo(() => ({ data, setData }), [data, setData]);

	return (
		<OrdersContext.Provider
			value={{
				stepValue,
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
