import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import setAuthHeader from "../helpers/setAuthHeader";

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
	const queryClient = useQueryClient();

	const [token, setToken] = useState<string | null>(validToken());
	const [user, setUser] = useState<Object | null>(null);
	const [userPermissions, setUserPermissions] = useState(null);

	const tokenValue = useMemo(() => ({ token, setToken }), [token, setToken]);
	const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
	const userPermissionsValue = useMemo(() => ({ userPermissions, setUserPermissions }), [userPermissions, setUserPermissions]);

	const userCan: (permissionCondition: string | string[]) => boolean = (permissionCondition) => {
		if (Array.isArray(permissionCondition)) {
			let isPermitted = false;

			for (const permission of userPermissionsValue.userPermissions) {
				for (const permissionItem of permissionCondition) {
					if (permission.name === permissionItem && !!permission.active) {
						isPermitted = true;
					}
				}
			}

			return isPermitted;
		}
		return userPermissionsValue.userPermissions.some(
			(permission: any) => permission.name === permissionCondition && !!permission.active
		);
	};

	const logout = () => {
		localStorage.removeItem(process.env.REACT_APP_TOKEN_KEY);
		tokenValue.setToken(null);
		userValue.setUser(null);
		userPermissionsValue.setUserPermissions(null);
		queryClient.clear();
	};

	useEffect(() => {
		setAuthHeader(tokenValue.token);
	}, [tokenValue.token]);

	return (
		<AuthContext.Provider
			value={{
				tokenValue,
				userValue,
				userPermissionsValue,
				userCan,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuthContext must be used within a AuthProvider");
	}

	return context;
};

export default AuthProvider;
