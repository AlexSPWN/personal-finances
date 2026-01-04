// src/pages/admin/AuditLogPage.tsx
import { useEffect, useMemo, useState } from "react";
import { subscribeToAuditLogsPaginated } from "../../../services/auditLogService";
import { subscribeToUsersMap } from "../../../services/userService";
import type { AuditLogWithId } from "../../../types/AuditLog";

const PAGE_SIZE = 20;
const HIGHLIGHT_MS = 1000 * 60 * 5; // 5 min
const SKELETON_ROWS = 6;

export const AuditLogPage = () => {
  const [logs, setLogs] = useState<AuditLogWithId[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [now] = useState(() => Date.now());

  const loadingLogs = logs.length === 0;

  useEffect(() => {
    const unsubLogs = subscribeToAuditLogsPaginated(setLogs, limit);
    const unsubUsers = subscribeToUsersMap(setUsersMap);
    return () => {
      unsubLogs();
      unsubUsers();
    };
  }, [limit]);

  const filteredLogs = useMemo(() => {
    const q = search.toLowerCase();
    return logs.filter((log) => {
      const actorEmail = usersMap[log.actorUid] ?? "";
      const targetEmail = usersMap[log.targetUid] ?? "";
      return (
        actorEmail.toLowerCase().includes(q) ||
        targetEmail.toLowerCase().includes(q) ||
        log.actorRole.toLowerCase().includes(q) ||
        log.oldRole.toLowerCase().includes(q) ||
        log.newRole.toLowerCase().includes(q)
      );
    });
  }, [logs, usersMap, search]);

  const isEmpty = !loadingLogs && logs.length === 0;
  const isSearchEmpty = !loadingLogs && logs.length > 0 && filteredLogs.length === 0;

  const highlight = (text: string) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const exportCSV = () => {
    if (filteredLogs.length === 0) return;
    const rows = filteredLogs.map((log) => ({
      actor: usersMap[log.actorUid] ?? log.actorUid,
      actorRole: log.actorRole,
      target: usersMap[log.targetUid] ?? log.targetUid,
      oldRole: log.oldRole,
      newRole: log.newRole,
      timestamp: typeof log.timestamp === "number" ? new Date(log.timestamp).toISOString() : "",
    }));
    const header = Object.keys(rows[0]).join(",");
    const body = rows.map((r) => Object.values(r).join(",")).join("\n");
    const csv = `${header}\n${body}`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-log-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Audit Log</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by actor, target, role..."
          aria-label="Search audit logs"
          className="border p-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={exportCSV}
          aria-label="Export audit logs CSV"
          className="bg-blue-500 text-white px-4 rounded"
          disabled={filteredLogs.length === 0}
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-y-auto h-125 border rounded bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border p-2">Actor</th>
              <th className="border p-2">Actor Role</th>
              <th className="border p-2">Target</th>
              <th className="border p-2">Old Role</th>
              <th className="border p-2">New Role</th>
              <th className="border p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {/* Skeleton */}
            {loadingLogs &&
              Array.from({ length: SKELETON_ROWS }).map((_, rowIdx) => (
                <tr key={`skeleton-${rowIdx}`}>
                  {Array.from({ length: 6 }).map((__, colIdx) => (
                    <td key={colIdx} className="border p-2">
                      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    </td>
                  ))}
                </tr>
              ))}

            {/* Empty states */}
            {!loadingLogs && isEmpty && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No audit log entries yet.
                </td>
              </tr>
            )}
            {!loadingLogs && isSearchEmpty && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No audit log entries match your search.
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loadingLogs &&
              !isSearchEmpty &&
              filteredLogs.map((log) => {
                const isRecent =
                  typeof log.timestamp === "number" && now - log.timestamp < HIGHLIGHT_MS;
                return (
                  <tr key={log.uid} className={isRecent ? "bg-yellow-50" : ""}>
                    <td className="border p-2">{highlight(usersMap[log.actorUid] ?? log.actorUid)}</td>
                    <td className="border p-2">{highlight(log.actorRole)}</td>
                    <td className="border p-2">{highlight(usersMap[log.targetUid] ?? log.targetUid)}</td>
                    <td className="border p-2">{highlight(log.oldRole)}</td>
                    <td className="border p-2">{highlight(log.newRole)}</td>
                    <td className="border p-2">
                      {typeof log.timestamp === "number"
                        ? new Date(log.timestamp).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setLimit((l) => l + PAGE_SIZE)}
          aria-label="Load more audit logs"
          className="bg-gray-200 px-4 py-2 rounded flex items-center gap-2"
          disabled={loadingLogs}
        >
          {loadingLogs && (
            <svg
              className="animate-spin h-4 w-4 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          Load more
        </button>
      </div>
    </div>
  );
};
