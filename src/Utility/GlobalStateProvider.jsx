import { createContext, useContext, useState } from "react";

// 1. Create Context
const GlobalStateContext = createContext();

// 2. Create Provider Component
export const GlobalStateProvider = ({ children }) => {
  const [count, setCount] = useState(""); // Example global state
  return (
    <GlobalStateContext.Provider value={[ count, setCount ]}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// 3. Create Custom Hook for easy access
export const useGlobalState = () => useContext(GlobalStateContext);
