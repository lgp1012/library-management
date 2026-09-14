import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import AdminSidebar from "../../components/admin/AdminSidebar";
import Footer from "../../components/Footer";
import { AdminProvider } from "../../contexts/adminContext.jsx";

const VALID_TABS = [
  "dashboard",
  "employees",
  "audit-logs",
  "borrowing-rules",
  "fine-settings",
  "categories",
  "authors",
  "publishers",
  "shelves",
];

const AdminPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read tab parameter from URL
  const currentTabFromUrl = searchParams.get("tab");

  // Determine active tab: URL query param -> sessionStorage -> default to "dashboard"
  const activeTab = (() => {
    if (currentTabFromUrl && VALID_TABS.includes(currentTabFromUrl)) {
      return currentTabFromUrl;
    }
    const savedTab = sessionStorage.getItem("admin_active_tab");
    if (savedTab && VALID_TABS.includes(savedTab)) {
      return savedTab;
    }
    return "dashboard";
  })();

  const [searchKeyword, setSearchKeyword] = useState("");

  // Keep URL and sessionStorage synchronized
  useEffect(() => {
    if (!currentTabFromUrl || !VALID_TABS.includes(currentTabFromUrl)) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
    sessionStorage.setItem("admin_active_tab", activeTab);
  }, [currentTabFromUrl, activeTab, setSearchParams]);

  // Quick navigation handler from sidebar, dashboard, or header
  const handleTabChange = (tabId) => {
    if (VALID_TABS.includes(tabId)) {
      setSearchParams({ tab: tabId });
      sessionStorage.setItem("admin_active_tab", tabId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Edit rule direct trigger
  const handleEditRuleDirectly = () => {
    handleTabChange("borrowing-rules");
  };

  return (
    <AdminProvider>
      <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
        {/* 1. Left Sidebar Navigation */}
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* 2. Main Work Area (Top Header + Dynamic View Content + Footer) */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Header */}
          <AdminHeader
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />

          {/* Dynamic Main Content Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {activeTab === "dashboard" && (
              <AdminDashboardView
                onNavigateTab={handleTabChange}
                onEditRule={handleEditRuleDirectly}
              />
            )}

            {activeTab === "employees" && <AdminEmployeeView />}

            {activeTab === "audit-logs" && <AdminAuditLogsView />}

            {activeTab === "borrowing-rules" && <AdminBorrowingRulesView />}

            {activeTab === "fine-settings" && <AdminFineSettingsView />}

            {activeTab === "categories" && <AdminCategoriesView />}

            {activeTab === "authors" && <AdminAuthorsView />}

            {activeTab === "publishers" && <AdminPublishersView />}

            {activeTab === "shelves" && <AdminShelvesView />}
          </main>

          {/* Bottom Footer */}
          <Footer />
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminPage;
