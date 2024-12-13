import { Dispatch } from "react";
import { UnknownAction } from "@reduxjs/toolkit";

let dispatchFunction: Dispatch<UnknownAction> | null = null;

export const injectDispatch = (dispatch: Dispatch<UnknownAction>) => {
	dispatchFunction = dispatch;
};

export const getInjectedDispatch = (): Dispatch<UnknownAction> | null => {
	return dispatchFunction;
};
