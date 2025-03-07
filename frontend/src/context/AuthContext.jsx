import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			return { user: action.payload };
		case "LOGOUT":
			return { user: null };
		default:
			return state;
	}
};

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, { user: null });

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));

		if (user) {
			dispatch({ type: "LOGIN", payload: user });
		}
	}, []);

	// Update localStorage when the user logs in or out
	useEffect(() => {
		if (state.user) {
			localStorage.setItem("user", JSON.stringify(state.user));
		} else {
			localStorage.removeItem("user");
		}
	}, [state.user]);

	console.log("Auth context state:", state);

	return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>;
};
