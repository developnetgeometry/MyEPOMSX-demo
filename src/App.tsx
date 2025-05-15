
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from './components/layout/Layout';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import FacilitiesPage from './pages/manage/FacilitiesPage';
import FacilityDetailPage from './pages/manage/FacilityDetailPage';
import SystemPage from './pages/manage/SystemPage';
import SystemDetailPage from './pages/manage/SystemDetailPage';
import PackagePage from './pages/manage/PackagePage';
import PackageDetailPage from './pages/manage/PackageDetailPage';
import AssetRegisterPage from './pages/manage/AssetRegisterPage';
import AssetRegisterDetailPage from './pages/manage/AssetRegisterDetailPage';
import ItemsMasterPage from './pages/manage/ItemsMasterPage';
import ItemsMasterDetailPage from './pages/manage/ItemsMasterDetailPage';
import InventoryPage from './pages/manage/InventoryPage';
import InventoryDetailPage from './pages/manage/InventoryDetailPage';
import InventoryItemDetailPage from './pages/manage/InventoryItemDetailPage';
import ClientPage from './pages/admin/setup/ClientPage';
import ClientDetailPage from './pages/admin/setup/ClientDetailPage';
import ProjectPage from './pages/admin/setup/ProjectPage';
import ProjectDetailPage from './pages/admin/setup/ProjectDetailPage';
import WorkCenterPage from './pages/admin/setup/WorkCenterPage';
import WorkCenterDetailPage from './pages/admin/setup/WorkCenterDetailPage';
import SensorPage from './pages/admin/setup/SensorPage';
import SensorDetailPage from './pages/admin/setup/SensorDetailPage';
import AssetClassPage from './pages/admin/settings/AssetClassPage';
import AssetClassDetailPage from './pages/admin/settings/AssetClassDetailPage';
import AssetTagPage from './pages/admin/settings/AssetTagPage';
import AssetTagDetailPage from './pages/admin/settings/AssetTagDetailPage';
import CorrosionGroupPage from './pages/admin/settings/CorrosionGroupPage';
import CorrosionGroupDetailPage from './pages/admin/settings/CorrosionGroupDetailPage';
import DataCategoryPage from './pages/admin/settings/DataCategoryPage';
import DataCategoryDetailPage from './pages/admin/settings/DataCategoryDetailPage';
import DisciplinePage from './pages/admin/settings/DisciplinePage';
import DisciplineDetailPage from './pages/admin/settings/DisciplineDetailPage';
import FrequencySetupPage from './pages/admin/settings/FrequencySetupPage';
import FrequencySetupDetailPage from './pages/admin/settings/FrequencySetupDetailPage';
import MaintenanceTypePage from './pages/admin/settings/MaintenanceTypePage';
import MaintenanceTypeDetailPage from './pages/admin/settings/MaintenanceTypeDetailPage';
import AverageUARSPage from './pages/admin/settings/AverageUARSPage';
import AverageUARSDetailPage from './pages/admin/settings/AverageUARSDetailPage';
import IntegrityModulePage from './pages/integrity/IntegrityModulePage';
import InventoryGroupsPage from './pages/monitor/InventoryGroupsPage';
import IntegrityPage from './pages/monitor/IntegrityPage';
import AssetIntegrityDetailPage from './pages/monitor/AssetIntegrityDetailPage';
import RBIAssessmentPage from './pages/monitor/RBIAssessmentPage';
import RBIAssessmentDetailPage from './pages/monitor/RBIAssessmentDetailPage';
import CorrosionStudiesPage from './pages/monitor/CorrosionStudiesPage';
import CorrosionStudiesDetailPage from './pages/monitor/CorrosionStudiesDetailPage';
import InspectionDataPage from './pages/monitor/InspectionDataPage';
import IMSDashboardPage from './pages/monitor/IMSDashboardPage';
import RMSAssetListPage from './pages/monitor/RMSAssetListPage';
import RMSAssetDetailPage from './pages/monitor/RMSAssetDetailPage';
import CriticalAssetsPage from './pages/monitor/CriticalAssetsPage';
import RMSDashboardPage from './pages/monitor/RMSDashboardPage';
import WOHistoryPage from './pages/maintain/WOHistoryPage';
import WOHistoryDetailPage from './pages/maintain/WOHistoryDetailPage';
import TaskLibraryPage from './pages/maintain/TaskLibraryPage';
import TaskLibraryDetailPage from './pages/maintain/TaskLibraryDetailPage';
import PMSchedulePage from './pages/maintain/PMSchedulePage';
import PMScheduleDetailPage from './pages/maintain/PMScheduleDetailPage';
import WorkRequestPage from './pages/maintain/WorkRequestPage';
import WorkRequestDetailPage from './pages/maintain/WorkRequestDetailPage';
import WorkOrderListPage from './pages/maintain/WorkOrderListPage';
import WorkOrderDetailPage from './pages/maintain/WorkOrderDetailPage';
import BomAssemblyPage from './pages/manage/BomAssemblyPage';
import AssetsPage from './pages/manage/AssetsPage';
import AssetDetailPage from './pages/manage/AssetDetailsPage';
import BomAssemblyDetailPage from './pages/manage/BomAssemblyPage';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <Router>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />

          {/* Manage Routes */}
          <Route path="/manage/facilities" element={<Layout><FacilitiesPage /></Layout>} />
          <Route path="/manage/facilities/:id" element={<Layout><FacilityDetailPage /></Layout>} />
          <Route path="/manage/system" element={<Layout><SystemPage /></Layout>} />
          <Route path="/manage/system/:id" element={<Layout><SystemDetailPage /></Layout>} />
          <Route path="/manage/package" element={<Layout><PackagePage /></Layout>} />
          <Route path="/manage/package/:id" element={<Layout><PackageDetailPage /></Layout>} />
          <Route path="/manage/asset-register" element={<Layout><AssetRegisterPage /></Layout>} />
          <Route path="/manage/asset-register/:id" element={<Layout><AssetRegisterDetailPage /></Layout>} />
          <Route path="/manage/assets" element={<Layout><AssetsPage /></Layout>} />
          <Route path="/manage/assets/:id" element={<Layout><AssetDetailPage /></Layout>} />
          <Route path="/manage/bom-assembly" element={<Layout><BomAssemblyPage /></Layout>} />
          <Route path="/manage/bom-assembly/:id" element={<Layout><BomAssemblyDetailPage /></Layout>} />
          <Route path="/manage/items-master" element={<Layout><ItemsMasterPage /></Layout>} />
          <Route path="/manage/items-master/:id" element={<Layout><ItemsMasterDetailPage /></Layout>} />
          <Route path="/manage/inventory" element={<Layout><InventoryPage /></Layout>} />
          <Route path="/manage/inventory/:id" element={<Layout><InventoryDetailPage /></Layout>} />
          <Route path="/manage/inventory/item/:id" element={<Layout><InventoryItemDetailPage /></Layout>} />

          {/* Admin Setup Routes */}
          <Route path="/admin/setup/client" element={<Layout><ClientPage /></Layout>} />
          <Route path="/admin/setup/client/:id" element={<Layout><ClientDetailPage /></Layout>} />
          <Route path="/admin/setup/project" element={<Layout><ProjectPage /></Layout>} />
          <Route path="/admin/setup/project/:id" element={<Layout><ProjectDetailPage /></Layout>} />
          <Route path="/admin/setup/work-center" element={<Layout><WorkCenterPage /></Layout>} />
          <Route path="/admin/setup/work-center/:id" element={<Layout><WorkCenterDetailPage /></Layout>} />
          <Route path="/admin/setup/sensor" element={<Layout><SensorPage /></Layout>} />
          <Route path="/admin/setup/sensor/:id" element={<Layout><SensorDetailPage /></Layout>} />

          {/* Admin Settings Routes */}
          <Route path="/admin/settings/asset-class" element={<Layout><AssetClassPage /></Layout>} />
          <Route path="/admin/settings/asset-class/:id" element={<Layout><AssetClassDetailPage /></Layout>} />
          <Route path="/admin/settings/asset-tag" element={<Layout><AssetTagPage /></Layout>} />
          <Route path="/admin/settings/asset-tag/:id" element={<Layout><AssetTagDetailPage /></Layout>} />
          <Route path="/admin/settings/corrosion-group" element={<Layout><CorrosionGroupPage /></Layout>} />
          <Route path="/admin/settings/corrosion-group/:id" element={<Layout><CorrosionGroupDetailPage /></Layout>} />
          <Route path="/admin/settings/data-category" element={<Layout><DataCategoryPage /></Layout>} />
          <Route path="/admin/settings/data-category/:id" element={<Layout><DataCategoryDetailPage /></Layout>} />
          <Route path="/admin/settings/discipline" element={<Layout><DisciplinePage /></Layout>} />
          <Route path="/admin/settings/discipline/:id" element={<Layout><DisciplineDetailPage /></Layout>} />
          <Route path="/admin/settings/frequency-setup" element={<Layout><FrequencySetupPage /></Layout>} />
          <Route path="/admin/settings/frequency-setup/:id" element={<Layout><FrequencySetupDetailPage /></Layout>} />
          <Route path="/admin/settings/maintenance-type" element={<Layout><MaintenanceTypePage /></Layout>} />
          <Route path="/admin/settings/maintenance-type/:id" element={<Layout><MaintenanceTypeDetailPage /></Layout>} />
          <Route path="/admin/settings/average-uars" element={<Layout><AverageUARSPage /></Layout>} />
          <Route path="/admin/settings/average-uars/:id" element={<Layout><AverageUARSDetailPage /></Layout>} />

          {/* Integrity Routes */}
          <Route path="/integrity/module" element={<Layout><IntegrityModulePage /></Layout>} />

          {/* Monitor Routes */}
          <Route path="/monitor/inventory-groups" element={<Layout><InventoryGroupsPage /></Layout>} />
          <Route path="/monitor/integrity" element={<Layout><IntegrityPage /></Layout>} />
          <Route path="/monitor/integrity/:type/:id" element={<Layout><AssetIntegrityDetailPage /></Layout>} />
          <Route path="/monitor/ims-dashboard" element={<Layout><IMSDashboardPage /></Layout>} />
          <Route path="/monitor/rbi-assessment" element={<Layout><RBIAssessmentPage /></Layout>} />
          <Route path="/monitor/rbi-assessment/:id" element={<Layout><RBIAssessmentDetailPage /></Layout>} />
          <Route path="/monitor/corrosion-studies" element={<Layout><CorrosionStudiesPage /></Layout>} />
          <Route path="/monitor/corrosion-studies/:id" element={<Layout><CorrosionStudiesDetailPage /></Layout>} />
          <Route path="/monitor/inspection-data" element={<Layout><InspectionDataPage /></Layout>} />
          <Route path="/monitor/rms-asset-list" element={<Layout><RMSAssetListPage /></Layout>} />
          <Route path="/monitor/rms-asset-detail/:id" element={<Layout><RMSAssetDetailPage /></Layout>} />
          <Route path="/monitor/critical-assets" element={<Layout><CriticalAssetsPage /></Layout>} />
          <Route path="/monitor/rms-dashboard" element={<Layout><RMSDashboardPage /></Layout>} />

          {/* Maintain Routes */}
          <Route path="/maintain/wo-history" element={<Layout><WOHistoryPage /></Layout>} />
          <Route path="/maintain/wo-history/:id" element={<Layout><WOHistoryDetailPage /></Layout>} />
          <Route path="/maintain/task-library" element={<Layout><TaskLibraryPage /></Layout>} />
          <Route path="/maintain/task-library/:id" element={<Layout><TaskLibraryDetailPage /></Layout>} />
          <Route path="/maintain/pm-schedule" element={<Layout><PMSchedulePage /></Layout>} />
          <Route path="/maintain/pm-schedule/:id" element={<Layout><PMScheduleDetailPage /></Layout>} />
          <Route path="/maintain/work-request" element={<Layout><WorkRequestPage /></Layout>} />
          <Route path="/maintain/work-request/:id" element={<Layout><WorkRequestDetailPage /></Layout>} />
          <Route path="/maintain/work-order-list" element={<Layout><WorkOrderListPage /></Layout>} />
          <Route path="/maintain/work-order-list/:id" element={<Layout><WorkOrderDetailPage /></Layout>} />

          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>

  );
}

export default App;
