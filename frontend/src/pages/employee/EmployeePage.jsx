import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar";
import EmployeeHeader from "../../components/employee/EmployeeHeader";
import EmployeeBookManagementView from "../../components/employee/EmployeeBookManagementView";
import EmployeeReadersView from "../../components/employee/EmployeeReadersView";
import EmployeeFinesView from "../../components/employee/EmployeeFinesView";
import EmployeeBorrowReturnView from "../../components/employee/EmployeeBorrowReturnView";
import Footer from "../../components/Footer";
import { EmployeeProvider } from "../../contexts/employeeContext.jsx";

const VALID_TABS = ["dashboard", "books", "shelves", "borrow-return", "fines", "readers"];

const EmployeePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTabFromUrl = searchParams.get("tab");

  const activeTab = (() => {
    if (currentTabFromUrl && VALID_TABS.includes(currentTabFromUrl)) {
      return currentTabFromUrl;
    }
    const savedTab = localStorage.getItem("employee_active_tab");
    if (savedTab && VALID_TABS.includes(savedTab)) {
      return savedTab;
    }
    return "dashboard";
  })();

  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (!currentTabFromUrl || !VALID_TABS.includes(currentTabFromUrl)) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
    localStorage.setItem("employee_active_tab", activeTab);
  }, [currentTabFromUrl, activeTab, setSearchParams]);

  const handleTabChange = (tabId) => {
    if (VALID_TABS.includes(tabId)) {
      setSearchParams({ tab: tabId });
      localStorage.setItem("employee_active_tab", tabId);
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
                <h2 className="text-xl font-bold mb-2">Dashboard (Coming Soon)</h2>
                <p>Welcome to Employee Portal.</p>
              </div>
            )}

            {activeTab === "books" && <EmployeeBookManagementView />}
            {activeTab === "readers" && <EmployeeReadersView />}
            {activeTab === "fines" && <EmployeeFinesView />}
            {activeTab === "borrow-return" && <EmployeeBorrowReturnView />}

            {/* Placedholders for other tabs */}
            {!["dashboard", "books", "readers", "fines", "borrow-return"].includes(activeTab) && (
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
