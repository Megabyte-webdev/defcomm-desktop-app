import React, { createContext, useContext, useReducer } from "react";
import DashboardReducer from "../reducers/DashboardReducer";
import { dashboardOptions, utilOptions, dashboardTabs } from "../utils/constants";

// Create the context
export const DashboardContext = createContext();

// Provider component
export const DashboardContextProvider = ({ children }) => {
  const options = [...dashboardOptions, ...utilOptions, ...dashboardTabs];
  const [state, dispatch] = useReducer(DashboardReducer, options[0]);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};
