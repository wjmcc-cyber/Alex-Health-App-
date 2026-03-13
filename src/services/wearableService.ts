import type { WearableIntegration } from "@/types/domain";

export async function listWearableIntegrations(): Promise<WearableIntegration[]> {
  return [
    { id: "wearable-apple-health", provider: "apple_health", status: "not_connected" },
    { id: "wearable-google-fit", provider: "google_fit", status: "not_connected" },
    { id: "wearable-garmin", provider: "garmin", status: "not_connected" },
    { id: "wearable-whoop", provider: "whoop", status: "not_connected" }
  ];
}
