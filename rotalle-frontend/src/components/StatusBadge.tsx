import type { VehicleApprovalStatus, VehicleStatus } from "@/types/enums";
import { APPROVAL_LABELS, VEHICLE_STATUS_LABELS } from "@/types/enums";

export function ApprovalBadge({ status }: { status: VehicleApprovalStatus }) {
  return <span className={`badge badge-${status}`}>{APPROVAL_LABELS[status]}</span>;
}

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  const cls = status === "available" ? "badge-available" : "badge-pending";
  return <span className={`badge ${cls}`}>{VEHICLE_STATUS_LABELS[status]}</span>;
}
