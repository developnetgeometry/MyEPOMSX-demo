
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { ProjectProvider } from './contexts/ProjectContext';

// Manage imports
import FacilitiesPage from '@/pages/manage/FacilitiesPage';
import FacilityDetailPage from '@/pages/manage/FacilityDetailPage';
import SystemPage from '@/pages/manage/SystemPage';
import SystemDetailPage from '@/pages/manage/SystemDetailPage';
import PackagePage from '@/pages/manage/PackagePage';
import PackageDetailPage from '@/pages/manage/PackageDetailPage';
import AssetRegisterPage from '@/pages/manage/AssetRegisterPage';
import AssetRegisterDetailPage from '@/pages/manage/AssetRegisterDetailPage';
import AssetsPage from '@/pages/manage/AssetsPage';
import AssetDetailPage from '@/pages/manage/AssetDetailPage';
import BomAssemblyPage from '@/pages/manage/BomAssemblyPage';
import BomAssemblyDetailPage from '@/pages/manage/BomAssemblyPage';
import ItemsMasterPage from '@/pages/manage/ItemsMasterPage';
import ItemsMasterDetailPage from '@/pages/manage/ItemsMasterDetailPage';
import InventoryPage from '@/pages/manage/InventoryPage';
import InventoryDetailPage from '@/pages/manage/InventoryDetailPage';
import InventoryItemDetailPage from '@/pages/manage/InventoryItemDetailPage';

// Admin Setup imports
import ClientPage from '@/pages/admin/setup/client/ClientPage';
import ClientDetailPage from '@/pages/admin/setup/client/ClientDetailPage';
import ProjectPage from '@/pages/admin/setup/project/ProjectPage';
import ProjectDetailPage from '@/pages/admin/setup/project/ProjectDetailPage';
import WorkCenterPage from '@/pages/admin/setup/work-center/WorkCenterPage';
import WorkCenterDetailPage from '@/pages/admin/setup/work-center/WorkCenterDetailPage';
import SensorPage from '@/pages/admin/setup/sensor/SensorPage';
import SensorDetailPage from '@/pages/admin/setup/sensor/SensorDetailPage';

// Admin Settings imports
import AssetClassPage from '@/pages/admin/settings/AssetClassPage';
import AssetClassDetailPage from '@/pages/admin/settings/AssetClassDetailPage';
import AssetTagPage from '@/pages/admin/settings/AssetTagPage';
import AssetTagDetailPage from '@/pages/admin/settings/AssetTagDetailPage';
import CorrosionGroupPage from '@/pages/admin/settings/CorrosionGroupPage';
import CorrosionGroupDetailPage from '@/pages/admin/settings/CorrosionGroupDetailPage';
import DataCategoryPage from '@/pages/admin/settings/DataCategoryPage';
import DataCategoryDetailPage from '@/pages/admin/settings/DataCategoryDetailPage';
import DisciplinePage from '@/pages/admin/settings/DisciplinePage';
import DisciplineDetailPage from '@/pages/admin/settings/DisciplineDetailPage';
import FrequencySetupPage from '@/pages/admin/settings/FrequencySetupPage';
import FrequencySetupDetailPage from '@/pages/admin/settings/FrequencySetupDetailPage';
import MaintenanceTypePage from '@/pages/admin/settings/MaintenanceTypePage';
import MaintenanceTypeDetailPage from '@/pages/admin/settings/MaintenanceTypeDetailPage';
import AverageUARSPage from '@/pages/admin/settings/AverageUARSPage';
import AverageUARSDetailPage from '@/pages/admin/settings/AverageUARSDetailPage';

// Integrity imports
import IntegrityModulePage from '@/pages/integrity/IntegrityModulePage';

// Monitor imports
import InventoryGroupsPage from '@/pages/monitor/InventoryGroupsPage';
import IntegrityPage from '@/pages/monitor/IntegrityPage';
import AssetIntegrityDetailPage from '@/pages/monitor/AssetIntegrityDetailPage';
import IMSDashboardPage from '@/pages/monitor/IMSDashboardPage';
import RBIAssessmentPage from '@/pages/monitor/RBIAssessmentPage';
import RBIAssessmentDetailPage from '@/pages/monitor/RBIAssessmentDetailPage';
import CorrosionStudiesPage from '@/pages/monitor/CorrosionStudiesPage';
import CorrosionStudiesDetailPage from '@/pages/monitor/CorrosionStudiesDetailPage';
import InspectionDataPage from '@/pages/monitor/InspectionDataPage';
import RMSAssetListPage from '@/pages/monitor/RMSAssetListPage';
import RMSAssetDetailPage from '@/pages/monitor/RMSAssetDetailPage';
import CriticalAssetsPage from '@/pages/monitor/CriticalAssetsPage';
import RMSDashboardPage from '@/pages/monitor/RMSDashboardPage';

// Maintain imports
import WOHistoryPage from '@/pages/maintain/WOHistoryPage';
import WOHistoryDetailPage from '@/pages/maintain/WOHistoryDetailPage';
import TaskLibraryPage from '@/pages/maintain/TaskLibraryPage';
import TaskLibraryDetailPage from '@/pages/maintain/TaskLibraryDetailPage';
import PMSchedulePage from '@/pages/maintain/PMSchedulePage';
import PMScheduleDetailPage from '@/pages/maintain/PMScheduleDetailPage';
import WorkRequestPage from '@/pages/maintain/WorkRequestPage';
import WorkRequestDetailPage from '@/pages/maintain/WorkRequestDetailPage';
import WorkOrderListPage from '@/pages/maintain/WorkOrderListPage';
import WorkOrderDetailPage from '@/pages/maintain/WorkOrderDetailPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><Outlet /></Layout>}>
              <Route index element={<Index />} />
              {/* Manage Routes */}
              <Route path="/manage/facilities" element={<FacilitiesPage />} />
              <Route path="/manage/facilities/:id" element={<FacilityDetailPage />} />
              <Route path="/manage/system" element={<SystemPage />} />
              <Route path="/manage/system/:id" element={<SystemDetailPage />} />
              <Route path="/manage/package" element={<PackagePage />} />
              <Route path="/manage/package/:id" element={<PackageDetailPage />} />
              <Route path="/manage/asset-register" element={<AssetRegisterPage />} />
              <Route path="/manage/asset-register/:id" element={<AssetRegisterDetailPage />} />
              <Route path="/manage/assets" element={<AssetsPage />} />
              <Route path="/manage/assets/:id" element={<AssetDetailPage />} />
              <Route path="/manage/bom-assembly" element={<BomAssemblyPage />} />
              <Route path="/manage/bom-assembly/:id" element={<BomAssemblyDetailPage />} />
              <Route path="/manage/items-master" element={<ItemsMasterPage />} />
              <Route path="/manage/items-master/:id" element={<ItemsMasterDetailPage />} />
              <Route path="/manage/inventory" element={<InventoryPage />} />
              <Route path="/manage/inventory/:id" element={<InventoryDetailPage />} />
              <Route path="/manage/inventory/item/:id" element={<InventoryItemDetailPage />} />

              {/* Admin Setup Routes */}
              <Route path="/admin/setup/client" element={<ClientPage />} />
              <Route path="/admin/setup/client/:id" element={<ClientDetailPage />} />
              <Route path="/admin/setup/project" element={<ProjectPage />} />
              <Route path="/admin/setup/project/:id" element={<ProjectDetailPage />} />
              <Route path="/admin/setup/work-center" element={<WorkCenterPage />} />
              <Route path="/admin/setup/work-center/:id" element={<WorkCenterDetailPage />} />
              <Route path="/admin/setup/sensor" element={<SensorPage />} />
              <Route path="/admin/setup/sensor/:id" element={<SensorDetailPage />} />

              {/* Admin Settings Routes */}
              <Route path="/admin/settings/asset-class" element={<AssetClassPage />} />
              <Route path="/admin/settings/asset-class/:id" element={<AssetClassDetailPage />} />
              <Route path="/admin/settings/asset-tag" element={<AssetTagPage />} />
              <Route path="/admin/settings/asset-tag/:id" element={<AssetTagDetailPage />} />
              <Route path="/admin/settings/corrosion-group" element={<CorrosionGroupPage />} />
              <Route path="/admin/settings/corrosion-group/:id" element={<CorrosionGroupDetailPage />} />
              <Route path="/admin/settings/data-category" element={<DataCategoryPage />} />
              <Route path="/admin/settings/data-category/:id" element={<DataCategoryDetailPage />} />
              <Route path="/admin/settings/discipline" element={<DisciplinePage />} />
              <Route path="/admin/settings/discipline/:id" element={<DisciplineDetailPage />} />
              <Route path="/admin/settings/frequency-setup" element={<FrequencySetupPage />} />
              <Route path="/admin/settings/frequency-setup/:id" element={<FrequencySetupDetailPage />} />
              <Route path="/admin/settings/maintenance-type" element={<MaintenanceTypePage />} />
              <Route path="/admin/settings/maintenance-type/:id" element={<MaintenanceTypeDetailPage />} />
              <Route path="/admin/settings/average-uars" element={<AverageUARSPage />} />
              <Route path="/admin/settings/average-uars/:id" element={<AverageUARSDetailPage />} />

              {/* Integrity Routes */}
              <Route path="/integrity/module" element={<IntegrityModulePage />} />

              {/* Monitor Routes */}
              <Route path="/monitor/inventory-groups" element={<InventoryGroupsPage />} />
              <Route path="/monitor/integrity" element={<IntegrityPage />} />
              <Route path="/monitor/integrity/:type/:id" element={<AssetIntegrityDetailPage />} />
              <Route path="/monitor/ims-dashboard" element={<IMSDashboardPage />} />
              <Route path="/monitor/rbi-assessment" element={<RBIAssessmentPage />} />
              <Route path="/monitor/rbi-assessment/:id" element={<RBIAssessmentDetailPage />} />
              <Route path="/monitor/corrosion-studies" element={<CorrosionStudiesPage />} />
              <Route path="/monitor/corrosion-studies/:id" element={<CorrosionStudiesDetailPage />} />
              <Route path="/monitor/inspection-data" element={<InspectionDataPage />} />
              <Route path="/monitor/rms-asset-list" element={<RMSAssetListPage />} />
              <Route path="/monitor/rms-asset-detail/:id" element={<RMSAssetDetailPage />} />
              <Route path="/monitor/critical-assets" element={<CriticalAssetsPage />} />
              <Route path="/monitor/rms-dashboard" element={<RMSDashboardPage />} />

              {/* Maintain Routes */}
              <Route path="/maintain/wo-history" element={<WOHistoryPage />} />
              <Route path="/maintain/wo-history/:id" element={<WOHistoryDetailPage />} />
              <Route path="/maintain/task-library" element={<TaskLibraryPage />} />
              <Route path="/maintain/task-library/:id" element={<TaskLibraryDetailPage />} />
              <Route path="/maintain/pm-schedule" element={<PMSchedulePage />} />
              <Route path="/maintain/pm-schedule/:id" element={<PMScheduleDetailPage />} />
              <Route path="/maintain/work-request" element={<WorkRequestPage />} />
              <Route path="/maintain/work-request/:id" element={<WorkRequestDetailPage />} />
              <Route path="/maintain/work-order-list" element={<WorkOrderListPage />} />
              <Route path="/maintain/work-order-list/:id" element={<WorkOrderDetailPage />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </ProjectProvider>
    </QueryClientProvider>
  );
}

export default App;