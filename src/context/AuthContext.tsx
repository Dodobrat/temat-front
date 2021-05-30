import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

interface AuthProviderProps {
	children?: React.ReactNode;
}

const validToken = () => {
	if (localStorage[`${process.env.REACT_APP_TOKEN_KEY}`]) {
		return JSON.parse(localStorage[`${process.env.REACT_APP_TOKEN_KEY}`]);
	}
	return null;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [token, setToken] = useState<string | null>(validToken());
	const [user, setUser] = useState<Object | null>(null);

	const resetToken = () => setToken(null);

	const tokenValue = useMemo(() => ({ token, setToken }), [token, setToken]);
	const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);

	return (
		<AuthContext.Provider
			value={{
				tokenValue,
				userValue,
				resetToken,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within a AuthContextProvider");
	}

	return context;
};

export default AuthProvider;
