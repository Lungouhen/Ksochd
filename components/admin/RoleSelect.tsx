"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/types/domain";
import { Crown, Shield, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

interface RoleSelectProps {
  userId: string;
  currentRole: Role;
  onRoleChange?: (newRole: Role) => void;
}

const roleConfig = {
  [Role.ADMIN]: {
    icon: Crown,
    label: "Admin",
    color: "text-amber-300 bg-amber-500/20",
    description: "Full system access",
  },
  [Role.MODERATOR]: {
    icon: Shield,
    label: "Moderator",
    color: "text-purple-300 bg-purple-500/20",
    description: "Manage events and content",
  },
  [Role.MEMBER]: {
    icon: UserIcon,
    label: "Member",
    color: "text-teal-300 bg-teal-500/20",
    description: "Standard member access",
  },
};

export function RoleSelect({ userId, currentRole, onRoleChange }: RoleSelectProps) {
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);

  const handleRoleSelect = (role: Role) => {
    if (role === selectedRole) return;
    setPendingRole(role);
    setShowConfirm(true);
  };

  const confirmRoleChange = async () => {
    if (!pendingRole) return;

    setIsChanging(true);
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: pendingRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      setSelectedRole(pendingRole);
      toast.success(`Role updated to ${roleConfig[pendingRole].label}`);
      onRoleChange?.(pendingRole);

      // Refresh the page data to reflect the change
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update role");
      // Reset to current role on error
      setPendingRole(null);
    } finally {
      setIsChanging(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {Object.entries(roleConfig).map(([role, config]) => {
          const Icon = config.icon;
          const isSelected = selectedRole === role;

          return (
            <button
              key={role}
              onClick={() => handleRoleSelect(role as Role)}
              disabled={isChanging}
              aria-label={`Set role to ${config.label}`}
              aria-pressed={isSelected}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition ${
                isSelected
                  ? `${config.color} border-current`
                  : "border-white/10 bg-slate-800/50 hover:bg-slate-800"
              } ${isChanging ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <Icon className={`h-6 w-6 ${isSelected ? "" : "text-slate-400"}`} />
              <div className="text-center">
                <p className={`text-sm font-semibold ${isSelected ? "" : "text-slate-300"}`}>
                  {config.label}
                </p>
                <p className="text-xs text-slate-400">{config.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {showConfirm && pendingRole && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4" role="alert">
          <p className="text-sm text-amber-200 mb-3">
            Are you sure you want to change this user&apos;s role to{" "}
            <strong>{roleConfig[pendingRole].label}</strong>?
          </p>
          <div className="flex gap-2">
            <button
              onClick={confirmRoleChange}
              disabled={isChanging}
              aria-label="Confirm role change"
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition disabled:opacity-50"
            >
              {isChanging ? "Updating..." : "Confirm"}
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                setPendingRole(null);
              }}
              disabled={isChanging}
              aria-label="Cancel role change"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
