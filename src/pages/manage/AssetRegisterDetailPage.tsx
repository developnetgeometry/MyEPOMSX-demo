import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Wrench, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  assets,
  packages,
  systems,
  facilityLocations,
} from "@/data/sampleData";
import { toast } from "sonner";

interface Asset {
  id: string;
  assetNo: string;
  name: string;
  packageId: string;
  package?: string;
  systemId: string;
  system?: string;
  facilityId: string;
  facility?: string;
  assetTag: string;
  model: string;
  status: string;
  sceCode: string;
  criticalityCode: string;
}

const AssetRegisterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);

  useEffect(() => {
    // Fetch asset data based on id
    const foundAsset = assets.find((a) => a.id === id);

    if (foundAsset) {
      // Find related data
      const pkg = packages.find((p) => p.id === foundAsset.packageId);
      const system = systems.find((s) => s.id === foundAsset.systemId);
      const facility = facilityLocations.find(
        (f) => f.id === foundAsset.facilityId
      );

      setAsset({
        ...foundAsset,
        package: pkg?.name || "Unknown",
        system: system?.name || "Unknown",
        facility: facility?.name || "Unknown",
      });
    } else {
      toast.error("Asset Codet found");
      navigate("/manage/asset-register");
    }
  }, [id, navigate]);

  const handleEdit = () => {
    // In a real application, this would open an edit form
    toast.info("Edit functionality would be implemented here");
  };

  if (!asset) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Asset Detail"
          icon={<Wrench className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={() => navigate("/manage/asset-register")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Asset Register
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Field</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Asset Code</TableCell>
                <TableCell>{asset.assetNo}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Asset Name</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Package</TableCell>
                <TableCell>{asset.package}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">System</TableCell>
                <TableCell>{asset.system}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Facility</TableCell>
                <TableCell>{asset.facility}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Asset Tag</TableCell>
                <TableCell>{asset.assetTag}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Model</TableCell>
                <TableCell>{asset.model}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Status</TableCell>
                <TableCell>
                  <StatusBadge status={asset.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">SCE Code</TableCell>
                <TableCell>{asset.sceCode}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Criticality Code</TableCell>
                <TableCell>{asset.criticalityCode}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetRegisterDetailPage;
