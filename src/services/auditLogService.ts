import { push, ref } from "firebase/database";
import { db } from "../firebase/firebase";
import type { AuditLog } from "../types/AuditLog";

export const logRoleChange = async (log: AuditLog) => {
  const logsRef = ref(db, "auditLogs");
  await push(logsRef, log);
};