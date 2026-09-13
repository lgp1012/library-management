import { useState } from "react";
import AdminAuditLogsView from "../../components/admin/AdminAuditLogsView";
import AdminAuthorsView from "../../components/admin/AdminAuthorsView";
import AdminBorrowingRulesView from "../../components/admin/AdminBorrowingRulesView";
import AdminCategoriesView from "../../components/admin/AdminCategoriesView";
import AdminDashboardView from "../../components/admin/AdminDashboardView";
import AdminEmployeeView from "../../components/admin/AdminEmployeeView";
import AdminFineSettingsView from "../../components/admin/AdminFineSettingsView";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminPublishersView from "../../components/admin/AdminPublishersView";
import AdminShelvesView from "../../components/admin/AdminShelvesView";
import Footer from "../../components/Footer";
import {
  ADMIN_KPI_METRICS,
  ADMIN_PROFILE,
  INITIAL_AUDIT_LOGS,
  INITIAL_AUTHORS,
  INITIAL_BORROWING_RULES,
  INITIAL_CATEGORIES,
  INITIAL_DETAILED_SHELVES,
  INITIAL_EMPLOYEES,
  INITIAL_FINE_SETTINGS,
  INITIAL_PUBLISHERS,
} from "../../constants/adminMockData";
import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminPage = () => {
  // Navigation active tab state
  const [activeTab, setActiveTab] = useState("dashboard");

  // Global search state
  const [searchKeyword, setSearchKeyword] = useState("");

  // System States initialized from central mock data
  const [adminProfile] = useState(ADMIN_PROFILE);
  const [kpiMetrics] = useState(ADMIN_KPI_METRICS);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [borrowingRules, setBorrowingRules] = useState(INITIAL_BORROWING_RULES);
  const [fineSettings, setFineSettings] = useState(INITIAL_FINE_SETTINGS);
  const [categories] = useState(INITIAL_CATEGORIES);
  const [authors, setAuthors] = useState(INITIAL_AUTHORS);
  const [publishers, setPublishers] = useState(INITIAL_PUBLISHERS);
  const [shelves, setShelves] = useState(INITIAL_DETAILED_SHELVES);

  // Quick navigation handler from dashboard or header
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Edit rule direct trigger
  const handleEditRuleDirectly = (rule) => {
    setActiveTab("borrowing-rules");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {/* 1. Left Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        adminProfile={adminProfile}
      />

      {/* 2. Main Work Area (Top Header + Dynamic View Content + Footer) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <AdminHeader
          adminProfile={adminProfile}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />

        {/* Dynamic Main Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === "dashboard" && (
            <AdminDashboardView
              kpiMetrics={kpiMetrics}
              borrowingRules={borrowingRules}
              auditLogs={auditLogs}
              onNavigateTab={handleTabChange}
              onEditRule={handleEditRuleDirectly}
            />
          )}

          {activeTab === "employees" && (
            <AdminEmployeeView
              employees={employees}
              setEmployees={setEmployees}
            />
          )}

          {activeTab === "audit-logs" && (
            <AdminAuditLogsView auditLogs={auditLogs} />
          )}

          {activeTab === "borrowing-rules" && (
            <AdminBorrowingRulesView
              borrowingRules={borrowingRules}
              setBorrowingRules={setBorrowingRules}
            />
          )}

          {activeTab === "fine-settings" && (
            <AdminFineSettingsView
              fineSettings={fineSettings}
              setFineSettings={setFineSettings}
            />
          )}

          {activeTab === "categories" && (
            <AdminCategoriesView categories={categories} />
          )}

          {activeTab === "authors" && (
            <AdminAuthorsView authors={authors} setAuthors={setAuthors} />
          )}

          {activeTab === "publishers" && (
            <AdminPublishersView
              publishers={publishers}
              setPublishers={setPublishers}
            />
          )}

          {activeTab === "shelves" && (
            <AdminShelvesView shelves={shelves} setShelves={setShelves} />
          )}
        </main>

        {/* Bottom Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminPage;
