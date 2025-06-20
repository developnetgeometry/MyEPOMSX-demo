import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import Overview from "@/pages/Overview";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import ClientPage from "@/pages/admin/setup/client/ClientPage";
import ClientDetailPage from "@/pages/admin/setup/client/ClientDetailPage";
// import CompanyPage from "@/pages/admin/setup/CompanyPage";
// import CompanyDetailPage from "@/pages/admin/setup/CompanyDetailPage";
import ProjectPage from "@/pages/admin/setup/project/ProjectPage";
import ProjectDetailPage from "@/pages/admin/setup/project/ProjectDetailPage";
import SensorPage from "@/pages/admin/setup/sensor/SensorPage";
import SensorDetailPage from "@/pages/admin/setup/sensor/SensorDetailPage";
// import VendorPage from "@/pages/admin/setup/VendorPage";
// import VendorDetailPage from "@/pages/admin/setup/VendorDetailPage";
import WorkCenterPage from "@/pages/admin/setup/work-center/WorkCenterPage";
import WorkCenterDetailPage from "@/pages/admin/setup/work-center/WorkCenterDetailPage";
import UserManagementPage from "@/pages/admin/setup/user-management";
import LookupManagementPage from "@/pages/admin/setup/lookup-management";

// Settings Pages
import AssetClassPage from "@/pages/admin/settings/AssetClassPage";
import AssetClassDetailPage from "@/pages/admin/settings/AssetClassDetailPage";
import AssetTagPage from "@/pages/admin/settings/AssetTagPage";
import AssetTagDetailPage from "@/pages/admin/settings/AssetTagDetailPage";
import CorrosionGroupPage from "@/pages/admin/settings/CorrosionGroupPage";
import CorrosionGroupDetailPage from "@/pages/admin/settings/CorrosionGroupDetailPage";
import DataCategoryPage from "@/pages/admin/settings/DataCategoryPage";
import DataCategoryDetailPage from "@/pages/admin/settings/DataCategoryDetailPage";
import DisciplinePage from "@/pages/admin/settings/DisciplinePage";
import DisciplineDetailPage from "@/pages/admin/settings/DisciplineDetailPage";
import FrequencySetupPage from "@/pages/admin/settings/FrequencySetupPage";
import FrequencySetupDetailPage from "@/pages/admin/settings/FrequencySetupDetailPage";
import MaintenanceTypePage from "@/pages/admin/settings/MaintenanceTypePage";
import MaintenanceTypeDetailPage from "@/pages/admin/settings/MaintenanceTypeDetailPage";
// import UserManagementPage from "@/pages/admin/settings/UserManagementPage";
import AverageUARSPage from "@/pages/admin/settings/AverageUARSPage";
import AverageUARSDetailPage from "@/pages/admin/settings/AverageUARSDetailPage";

// Manage Pages
import AssetAddPage from "@/pages/manage/AssetAddPage";
import AssetDetailPage from "@/pages/manage/AssetDetailPage";
import AssetDetailsPage from "@/pages/manage/AssetDetailsPage";
import AssetHierarchyPage from "@/pages/manage/AssetHierarchyPage";
import AssetRegisterDetailPage from "@/pages/manage/AssetRegisterDetailPage";
import AssetRegisterPage from "@/pages/manage/AssetRegisterPage";
import AssetsPage from "@/pages/manage/AssetsPage";
import BomAssemblyPage from "@/pages/manage/BomAssemblyPage";
import FacilitiesPage from "@/pages/manage/FacilitiesPage";
import FacilityDetailPage from "@/pages/manage/FacilityDetailPage";
import InventoryPage from "@/pages/manage/InventoryPage";
import InventoryDetailPage from "@/pages/manage/InventoryDetailPage";
import InventoryItemDetailPage from "@/pages/manage/InventoryItemDetailPage";
import CreatePurchaseOrderPage from "@/pages/purchasing/PurchaseOrderPage";
import ItemsMasterPage from "@/pages/manage/ItemsMasterPage";
import ItemsMasterDetailPage from "@/pages/manage/ItemsMasterDetailPage";
import MaterialPage from "@/pages/manage/MaterialPage";
import MaterialDetailPage from "@/pages/manage/MaterialDetailPage";
import PackagePage from "@/pages/manage/PackagePage";
import PackageDetailPage from "@/pages/manage/PackageDetailPage";
import PartsInventoryPage from "@/pages/manage/PartsInventoryPage";
import PartsInventoryDetailPage from "@/pages/manage/PartsInventoryDetailPage";
import SystemPage from "@/pages/manage/SystemPage";
import SystemDetailPage from "@/pages/manage/SystemDetailPage";

// Maintain Pages
import PMSchedulePage from "@/pages/maintain/pm-schedule/PMSchedulePage";
import PMScheduleDetailPage from "@/pages/maintain/pm-schedule/PMScheduleDetailPage";
import CreatePMSchedulePage from "@/pages/maintain/pm-schedule/CreatePMSchedulePage";
import TaskLibraryPage from "@/pages/maintain/task-detail/TaskLibraryPage";
import TaskLibraryDetailPage from "@/pages/maintain/task-detail/TaskLibraryDetailPage";

// Work Orders Pages
import WOHistoryPage from "@/pages/work-orders/work-order-history/WOHistoryPage";
import WOHistoryDetailPage from "@/pages/work-orders/work-order-history/WOHistoryDetailPage";
import WorkOrderDetailPage from "@/pages/work-orders/work-order-list/WorkOrderListDetailPage";
import WorkOrderListPage from "@/pages/work-orders/work-order-list/WorkOrderListPage";
import WorkRequestPage from "@/pages/work-orders/work-request/WorkRequestPage";
import WorkRequestDetailPage from "@/pages/work-orders/work-request/WorkRequestDetailPage";

// Measure Pages
import AssetPerformancePage from "@/pages/measure/AssetPerformancePage";
import CostAnalysisPage from "@/pages/measure/CostAnalysisPage";
import KPIDashboardPage from "@/pages/measure/KPIDashboardPage";
import WorkAnalyticsPage from "@/pages/measure/WorkAnalyticsPage";

// Monitor Pages
import AssetIntegrityDetailPage from "@/pages/monitor/AssetIntegrityDetailPage";
import CorrosionStudiesPage from "@/pages/monitor/CorrosionStudiesPage";
import CorrosionStudiesDetailPage from "@/pages/monitor/CorrosionStudiesDetailPage";
import CorrosionStudiesFormPage from "@/pages/monitor/CorrosionStudiesFormPage";
import CriticalAssetsPage from "@/pages/monitor/CriticalAssetsPage";
import IMSDashboardPage from "@/pages/monitor/IMSDashboardPage";
import InspectionDataPage from "@/pages/monitor/InspectionDataPage";
import InspectionDataFormPage from "@/pages/monitor/InspectionDataFormPage";
import InspectionDataDetailPage from "@/pages/monitor/InspectionDataDetailPage";
import IntegrityPage from "@/pages/monitor/IntegrityPage";
import NewPressureVesselPage from "@/pages/monitor/NewPressureVesselPage";
import PressureVesselDetailPage from "@/pages/monitor/PressureVesselDetailPage";
import NewPipingPage from "@/pages/monitor/NewPipingPage";
import FormulaTestingPage from "@/pages/monitor/FormulaTestingPage";
import InventoryGroupsPage from "@/pages/monitor/InventoryGroupsPage";
import RBIAssessmentPage from "@/pages/monitor/RBIAssessmentPage";
import RBIAssessmentDetailPage from "@/pages/monitor/RBIAssessmentDetailPage";
// import RBIAssessmentPVDetailPage from "@/pages/monitor/RBIAssessmentPVDetailPage";
import RMSAssetListPage from "@/pages/monitor/RMSAssetListPage";
import RMSAssetDetailPage from "@/pages/monitor/RMSAssetDetailPage";
import RMSDashboardPage from "@/pages/monitor/RMSDashboardPage";
import PipingFormPage from "@/pages/monitor/PipingFormPage";
import PipingDetailPage from "@/pages/monitor/PipingDetailPage";

// Vendor Pages
// import VendorDashboardPage from "@/pages/vendor/VendorDashboardPage";

// Purchasing Pages
import PurchaseRequestPage from "@/pages/purchasing/PurchaseRequestPage";
import PurchaseRequestDetailPage from "@/pages/purchasing/PurchaseRequestDetailPage";
import PurchaseRequestFormPage from "@/pages/purchasing/PurchaseRequestFormPage";
import PurchaseOrderPage from "@/pages/purchasing/PurchaseOrderPage";
import PurchaseOrderDetailPage from "@/pages/purchasing/PurchaseOrderDetailPage";
import PurchaseOrderFormPage from "@/pages/purchasing/PurchaseOrderFormPage";
import GoodsReceivePage from "@/pages/purchasing/GoodsReceivePage";
import GoodsReceiveDetailPage from "@/pages/purchasing/GoodsReceiveDetailPage";
import GoodsReceiveFormPage from "@/pages/purchasing/GoodsReceiveFormPage";
import InventoryAddPage from "@/pages/manage/InventoryAddPage";
import ItemMasterAddPage from "@/pages/manage/ItemMasterAddPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public auth route */}
      <Route path="/auth" element={<AuthRoute />} />

      {/* Redirect /login to /auth for compatibility */}
      <Route path="/login" element={<AuthRoute />} />

      {/* Redirect root to auth for unauthenticated users */}
      <Route path="/" element={<AuthRoute />} />

      {/* Protected dashboard route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Index />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* All other protected routes */}
      <Route
        path="/overview"
        element={
          <ProtectedRoute>
            <Layout>
              <Overview />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/setup/client"
        element={
          <ProtectedRoute>
            <Layout>
              <ClientPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/setup/client/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ClientDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/admin/setup/company"
        element={
          <ProtectedRoute>
            <Layout>
              <CompanyPage />
            </Layout>
          </ProtectedRoute>
        }
      /> */}
      {/* <Route
        path="/admin/setup/company/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <CompanyDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/admin/setup/project"
        element={
          <ProtectedRoute>
            <Layout>
              <ProjectPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/setup/project/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ProjectDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/setup/sensor"
        element={
          <ProtectedRoute>
            <Layout>
              <SensorPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/setup/sensor/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <SensorDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/admin/setup/vendor"
        element={
          <ProtectedRoute>
            <Layout>
              <VendorPage />
            </Layout>
          </ProtectedRoute>
        }
      /> */}
      {/* <Route
        path="/admin/setup/vendor/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <VendorDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/admin/setup/work-center"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkCenterPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/setup/work-center/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkCenterDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/setup/user-management"
        element={
          <ProtectedRoute>
            <Layout>
              <UserManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/setup/lookup-management"
        element={
          <ProtectedRoute>
            <Layout>
              <LookupManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Settings Routes */}
      <Route
        path="/admin/settings/asset-class"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetClassPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/asset-class/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetClassDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/asset-tag"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetTagPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/asset-tag/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetTagDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/corrosion-group"
        element={
          <ProtectedRoute>
            <Layout>
              <CorrosionGroupPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/corrosion-group/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <CorrosionGroupDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/data-category"
        element={
          <ProtectedRoute>
            <Layout>
              <DataCategoryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/data-category/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DataCategoryDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/discipline"
        element={
          <ProtectedRoute>
            <Layout>
              <DisciplinePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/discipline/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DisciplineDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/frequency-setup"
        element={
          <ProtectedRoute>
            <Layout>
              <FrequencySetupPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/frequency-setup/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <FrequencySetupDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/maintenance-type"
        element={
          <ProtectedRoute>
            <Layout>
              <MaintenanceTypePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/maintenance-type/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <MaintenanceTypeDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/admin/settings/user-management"
        element={
          <ProtectedRoute>
            <Layout>
              <UserManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/admin/settings/average-uars"
        element={
          <ProtectedRoute>
            <Layout>
              <AverageUARSPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/average-uars/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <AverageUARSDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Manage Routes */}
      <Route
        path="/manage/assets/add"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetAddPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/assets"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/assets/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/assets/details/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetDetailsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/asset-hierarchy"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetHierarchyPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/asset-register"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetRegisterPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/asset-register/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetRegisterDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/bom-assembly"
        element={
          <ProtectedRoute>
            <Layout>
              <BomAssemblyPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/facilities"
        element={
          <ProtectedRoute>
            <Layout>
              <FacilitiesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/inventory"
        element={
          <ProtectedRoute>
            <Layout>
              <InventoryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/inventory/add"
        element={
          <ProtectedRoute>
            <Layout>
              <InventoryAddPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/inventory/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <InventoryDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/inventory/create-po"
        element={
          <ProtectedRoute>
            <Layout>
              <CreatePurchaseOrderPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/items-master/add"
        element={
          <ProtectedRoute>
            <Layout>
              <ItemMasterAddPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/items-master"
        element={
          <ProtectedRoute>
            <Layout>
              <ItemsMasterPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/items-master/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ItemsMasterDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/material"
        element={
          <ProtectedRoute>
            <Layout>
              <MaterialPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/material/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <MaterialDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/package"
        element={
          <ProtectedRoute>
            <Layout>
              <PackagePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/parts-inventory"
        element={
          <ProtectedRoute>
            <Layout>
              <PartsInventoryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/parts-inventory/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <PartsInventoryDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/system"
        element={
          <ProtectedRoute>
            <Layout>
              <SystemPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Maintain Routes */}
      <Route
        path="/maintain/pm-schedule"
        element={
          <ProtectedRoute>
            <Layout>
              <PMSchedulePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintain/pm-schedule/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreatePMSchedulePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintain/pm-schedule/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <PMScheduleDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintain/task-library"
        element={
          <ProtectedRoute>
            <Layout>
              <TaskLibraryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintain/task-library/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <TaskLibraryDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Work Orders Routes */}
      <Route
        path="/work-orders/work-request"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkRequestPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/work-orders/work-request/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkRequestDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/work-orders/work-order-list"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkOrderListPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/work-orders/work-order-list/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkOrderDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/work-orders/wo-history"
        element={
          <ProtectedRoute>
            <Layout>
              <WOHistoryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/work-orders/wo-history/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <WOHistoryDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Measure Routes */}
      <Route
        path="/measure/asset-performance"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetPerformancePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/measure/cost-analysis"
        element={
          <ProtectedRoute>
            <Layout>
              <CostAnalysisPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/measure/kpi-dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <KPIDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/measure/work-analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkAnalyticsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Monitor Routes */}
      <Route
        path="/monitor/asset-integrity/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetIntegrityDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/corrosion-studies"
        element={
          <ProtectedRoute>
            <Layout>
              <CorrosionStudiesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/corrosion-studies/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <CorrosionStudiesDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/corrosion-studies/new"
        element={
          <ProtectedRoute>
            <Layout>
              <CorrosionStudiesFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/critical-assets"
        element={
          <ProtectedRoute>
            <Layout>
              <CriticalAssetsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/ims-dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <IMSDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/inspection-data"
        element={
          <ProtectedRoute>
            <Layout>
              <InspectionDataPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/inspection-data/new"
        element={
          <ProtectedRoute>
            <Layout>
              <InspectionDataFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/inspection-data/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <InspectionDataDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/integrity"
        element={
          <ProtectedRoute>
            <Layout>
              <IntegrityPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/integrity/new-pressure-vessel"
        element={
          <ProtectedRoute>
            <Layout>
              <NewPressureVesselPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/integrity/new-piping"
        element={
          <ProtectedRoute>
            <Layout>
              <NewPipingPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/formula-testing"
        element={
          <ProtectedRoute>
            <Layout>
              <FormulaTestingPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/integrity/pressure-vessel/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <PressureVesselDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/integrity/piping/new"
        element={
          <ProtectedRoute>
            <Layout>
              <PipingFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/integrity/piping/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <PipingDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/inventory-groups"
        element={
          <ProtectedRoute>
            <Layout>
              <InventoryGroupsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/rbi-assessment"
        element={
          <ProtectedRoute>
            <Layout>
              <RBIAssessmentPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/rbi-assessment/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <RBIAssessmentDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/monitor/rbi-assessment-pv/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <RBIAssessmentPVDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/monitor/rms-asset-list"
        element={
          <ProtectedRoute>
            <Layout>
              <RMSAssetListPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/rms-asset-detail/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <RMSAssetDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/rms-dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <RMSDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Vendor Routes */}
      {/* <Route
        path="/vendor/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <VendorDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      /> */}

      {/* Purchasing Routes */}
      <Route
        path="/purchasing/request"
        element={
          <ProtectedRoute>
            <Layout>
              <PurchaseRequestPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchasing/request/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <PurchaseRequestDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchasing/request/new"
        element={
          <ProtectedRoute>
            <Layout>
              <PurchaseRequestFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchasing/request/:id/edit"
        element={
          <ProtectedRoute>
            <Layout>
              <PurchaseRequestFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchasing/orders"
        element={
          <ProtectedRoute>
            <Layout>
              <PurchaseOrderPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchasing/orders/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <PurchaseOrderDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchasing/orders/new"
        element={
          <ProtectedRoute>
            <Layout>
              <PurchaseOrderFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchasing/orders/:id/edit"
        element={
          <ProtectedRoute>
            <Layout>
              <PurchaseOrderFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchasing/goods-receive"
        element={
          <ProtectedRoute>
            <Layout>
              <GoodsReceivePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchasing/goods-receive/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <GoodsReceiveDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchasing/goods-receive/new"
        element={
          <ProtectedRoute>
            <Layout>
              <GoodsReceiveFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchasing/goods-receive/:id/receive"
        element={
          <ProtectedRoute>
            <Layout>
              <GoodsReceiveFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Layout>
              <NotFound />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
