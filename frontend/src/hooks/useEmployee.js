import { useContext } from "react";
import EmployeeContext from "../contexts/employeeContext";

export const useEmployee = () => {
  const context = useContext(EmployeeContext);

  if (context === undefined) {
    throw new Error("useEmployee must be used within an EmployeeProvider");
  }

  return context;
};
