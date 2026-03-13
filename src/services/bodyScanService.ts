import type { BodyScanJob, BodyScanResult } from "@/types/domain";

export async function createBodyScanJob(uploadCount: number): Promise<BodyScanJob> {
  return {
    id: `body-scan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    uploadCount
  };
}

export async function getBodyScanResult(_jobId: string): Promise<BodyScanResult> {
  return {
    id: `body-scan-result-${Date.now()}`,
    postureSummary: "Body scan estimation is not available in the MVP yet.",
    symmetrySummary: "Symmetry analysis is intentionally deferred until image processing is implemented.",
    confidence: "not_available"
  };
}
