import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ShippingPlansContext = createContext(null);

interface ShippingPlansProviderProps {
	initialData?: any;
	children?: React.ReactNode;
}

const ShippingPlansProvider: React.FC<ShippingPlansProviderProps> = ({ children, initialData }) => {
	const [data, setData] = useState(
		initialData ?? {
			companyId: null,
			products: [],
			dateExpected: null,
			extraInfo: "",
		}
	);

	useEffect(() => {
		if (initialData) {
			setData(initialData);
		}
	}, [initialData]);

	const dataValue = useMemo(() => ({ data, setData }), [data, setData]);

	return (
		<ShippingPlansContext.Provider
			value={{
				dataValue,
			}}>
			{children}
		</ShippingPlansContext.Provider>
	);
};

export const useShippingPlansContext = () => {
	const context = useContext(ShippingPlansContext);

	if (context === undefined) {
		throw new Error("useShippingPlansContext must be used within a ShippingPlansProvider");
	}

	return context;
};

export default ShippingPlansProvider;
