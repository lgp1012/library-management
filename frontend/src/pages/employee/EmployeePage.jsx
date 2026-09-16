import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmployeeBookManagementView from "../../components/employee/EmployeeBookManagementView";
import EmployeeBorrowReturnView from "../../components/employee/EmployeeBorrowReturnView";
import EmployeeFinesView from "../../components/employee/EmployeeFinesView";
import EmployeeHeader from "../../components/employee/EmployeeHeader";
import EmployeeReadersView from "../../components/employee/EmployeeReadersView";
import EmployeeShelvesView from "../../components/employee/EmployeeShelvesView";
import EmployeeReservationsView from "../../components/employee/EmployeeReservationsView";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar";
import Footer from "../../components/Footer";
import { EmployeeProvider } from "../../contexts/employeeContext.jsx";

const VALID_TABS = new Set([
  "dashboard",
  "books",
  "shelves",
  "borrow-return",
  "reservations",
  "fines",
  "readers",
]);

const EmployeePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTabFromUrl = searchParams.get("tab");

  const activeTab = (() => {
    if (currentTabFromUrl && VALID_TABS.has(currentTabFromUrl)) {
      return currentTabFromUrl;
    }
    const savedTab = sessionStorage.getItem("employee_active_tab");
    if (savedTab && VALID_TABS.has(savedTab)) {
      return savedTab;
    }
    return "dashboard";
  })();

  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (!currentTabFromUrl || !VALID_TABS.has(currentTabFromUrl)) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
    sessionStorage.setItem("employee_active_tab", activeTab);
  }, [currentTabFromUrl, activeTab, setSearchParams]);

  const handleTabChange = (tabId) => {
    if (VALID_TABS.has(tabId)) {
      setSearchParams({ tab: tabId });
      sessionStorage.setItem("employee_active_tab", tabId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <EmployeeProvider>
      <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
        <EmployeeSidebar activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <EmployeeHeader
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {activeTab === "dashboard" && (
              <div className="p-8 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-2">
                  Dashboard (Coming Soon)
                </h2>
                <p>Welcome to Employee Portal.</p>
              </div>
            )}

            {activeTab === "books" && <EmployeeBookManagementView />}
            {activeTab === "shelves" && <EmployeeShelvesView />}
            {activeTab === "readers" && <EmployeeReadersView />}
            {activeTab === "fines" && <EmployeeFinesView />}
            {activeTab === "borrow-return" && <EmployeeBorrowReturnView />}
            {activeTab === "reservations" && <EmployeeReservationsView />}

            {/* Placedholders for other tabs */}
            {![
              "dashboard",
              "books",
              "shelves",
              "readers",
              "fines",
              "borrow-return",
              "reservations"
            ].includes(activeTab) && (
              <div className="p-8 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-2">
                  {activeTab.toUpperCase()} (Coming Soon)
                </h2>
                <p>This module is under construction.</p>
              </div>
            )}
          </main>

          <Footer />
        </div>
      </div>
    </EmployeeProvider>
  );
};

export default EmployeePage;
