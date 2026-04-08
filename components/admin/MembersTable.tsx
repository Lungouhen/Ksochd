"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

type MemberRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  status: string;
  joined: string;
};

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-teal-500/20 text-teal-300",
  PENDING: "bg-amber-500/20 text-amber-300",
  REJECTED: "bg-red-500/20 text-red-300",
  EXPIRED: "bg-slate-500/20 text-slate-400",
};

const roleStyles: Record<string, string> = {
  ADMIN: "bg-amber-500/20 text-amber-200",
  MODERATOR: "bg-purple-500/20 text-purple-300",
  MEMBER: "bg-slate-500/20 text-slate-300",
};

interface MembersTableProps {
  initialMembers: MemberRow[];
}

export function MembersTable({ initialMembers }: MembersTableProps) {
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleAction = async (memberId: string, action: "approve" | "reject") => {
    setProcessingIds((prev) => new Set(prev).add(memberId));

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} member`);
      }

      // Update local state
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? { ...m, status: data.status }
            : m
        )
      );

      toast.success(
        `Member ${action === "approve" ? "approved" : "rejected"} successfully`
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${action} member`);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(memberId);
        return next;
      });
    }
  };

  // Filter members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      searchTerm === "" ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);

    const matchesRole = roleFilter === "ALL" || member.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || member.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none rounded-lg border border-white/10 bg-slate-800/50 py-2 pl-10 pr-8 text-sm text-white focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MODERATOR">Moderator</option>
              <option value="MEMBER">Member</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg border border-white/10 bg-slate-800/50 py-2 pl-10 pr-8 text-sm text-white focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-400">
        Showing {filteredMembers.length} of {members.length} members
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/30">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Joined</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member, idx) => (
              <tr
                key={member.id}
                className={`cursor-pointer transition hover:bg-white/5 ${idx % 2 ? "bg-white/5" : "bg-white/[0.02]"}`}
              >
                <td className="px-4 py-3 font-medium text-white">{member.name}</td>
                <td className="px-4 py-3 text-slate-300">{member.email}</td>
                <td className="px-4 py-3 text-slate-300">{member.phone}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyles[member.role] ?? "bg-slate-500/20 text-slate-300"}`}
                  >
                    {member.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[member.status] ?? "bg-slate-500/20 text-slate-400"}`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{member.joined}</td>
                <td className="px-4 py-3">
                  {member.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(member.id, "approve")}
                        disabled={processingIds.has(member.id)}
                        className="flex items-center gap-1 rounded-lg bg-emerald-600/20 px-2.5 py-1 text-xs font-medium text-emerald-300 transition hover:bg-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(member.id, "reject")}
                        disabled={processingIds.has(member.id)}
                        className="flex items-center gap-1 rounded-lg bg-red-600/20 px-2.5 py-1 text-xs font-medium text-red-300 transition hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="h-3 w-3" />
                        Reject
                      </button>
                    </div>
                  ) : member.status === "ACTIVE" || member.status === "REJECTED" ? (
                    <Link
                      href={`/admin/members/${member.id}`}
                      className="flex w-fit items-center gap-1 rounded-lg bg-teal-600/20 px-2.5 py-1 text-xs font-medium text-teal-300 transition hover:bg-teal-600/30"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Link>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMembers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-400">No members found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
