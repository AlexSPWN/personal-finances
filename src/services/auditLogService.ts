import { limitToLast, off, onValue, orderByChild, push, query, ref } from "firebase/database";
import { db } from "../firebase/firebase";
import type { AuditLog, AuditLogWithId } from "../types/AuditLog";

export const logRoleChange = async (log: AuditLog) => {
  const logsRef = ref(db, "auditLogs");
  await push(logsRef, log);
};

export const subscribeToAuditLogs = (callback: (logs: AuditLogWithId[]) => void) => {
  const logsRef = ref(db, "auditLogs");

  onValue(logsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const data = snapshot.val();
    const logs: AuditLogWithId[] = Object.entries(data).map(([uid, log]) => ({
        uid,
      ...(log as AuditLog),
    }));

    callback(logs);
  });

  return () => off(logsRef);
};

export const subscribeToAuditLogsPaginated = (
  callback: (logs: AuditLogWithId[]) => void,
  limit = 20,
  //startKey: string // optional: key to start before
) => {
  const logsQuery = query(
    ref(db, "auditLogs"), 
    orderByChild("timestamp"), 
    //endAt(startKey),
    limitToLast(limit)
    );

  // For "previous page", you can pass startKey and adjust query
  // (Realtime DB has limited range queries)
  
  const listener = onValue(logsQuery, (snapshot) => {
    if (!snapshot.exists()) return callback([]);
    const data = snapshot.val();
    const logs: AuditLogWithId[] = Object.entries(data).map(([uid, log]) => ({
      uid,
      ...(log as AuditLog),
    }));
    callback(logs);
  });

  return () => off(ref(db, "auditLogs"), "value", listener);
};