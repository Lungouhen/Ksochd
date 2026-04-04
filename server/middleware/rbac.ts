import { Role } from "@/types/domain";

export function canAccess(role: Role, allowed: Role[]) {
  return allowed.includes(role);
}

export function requireRole(role: Role, allowed: Role[]) {
  if (!canAccess(role, allowed)) {
    throw new Error("Insufficient permissions");
  }
}
