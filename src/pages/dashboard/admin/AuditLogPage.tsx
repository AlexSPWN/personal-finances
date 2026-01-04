import { useEffect, useMemo, useState } from "react";
import { subscribeToAuditLogsPaginated } from "../../../services/auditLogService";
import { subscribeToUsersMap } from "../../../services/userService";
import type { AuditLogWithId } from "../../../types/AuditLog";

const PAGE_SIZE = 20;
const HIGHLIGHT_MS = 1000 * 60 * 5; // 5 minutes

export const AuditLogPage = () => {
  const [logs, setLogs] = useState<AuditLogWithId[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [now] = useState(()=> Date.now());

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

  const exportCSV = () => {
    if (filteredLogs.length === 0) return;

    const rows = filteredLogs.map((log) => ({
      actor: usersMap[log.actorUid] ?? log.actorUid,
      actorRole: log.actorRole,
      target: usersMap[log.targetUid] ?? log.targetUid,
      oldRole: log.oldRole,
      newRole: log.newRole,
      timestamp:
        typeof log.timestamp === "number"
          ? new Date(log.timestamp).toISOString()
          : "",
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
          className="border p-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={exportCSV}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Export CSV
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Actor</th>
            <th className="border p-2">Actor Role</th>
            <th className="border p-2">Target</th>
            <th className="border p-2">Old Role</th>
            <th className="border p-2">New Role</th>
            <th className="border p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log) => {
            const isRecent =
              typeof log.timestamp === "number" &&
              now - log.timestamp < HIGHLIGHT_MS;

            return (
              <tr key={log.uid} className={isRecent ? "bg-yellow-50" : ""}>
                <td className="border p-2">
                  {usersMap[log.actorUid] ?? log.actorUid}
                </td>
                <td className="border p-2">{log.actorRole}</td>
                <td className="border p-2">
                  {usersMap[log.targetUid] ?? log.targetUid}
                </td>
                <td className="border p-2">{log.oldRole}</td>
                <td className="border p-2">{log.newRole}</td>
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

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setLimit((l) => l + PAGE_SIZE)}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Load more
        </button>
      </div>
    </div>
  );
};
