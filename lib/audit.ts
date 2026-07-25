import { prisma } from "@/lib/prisma";

export async function logAuditEvent(params: {
  staffId?: string;
  action: string;
  resource: string;
  metadata?: Record<string, any>;
}) {
  const { staffId, action, resource, metadata } = params;

  if (process.env.DATABASE_URL) {
    try {
      await prisma.auditEvent.create({
        data: {
          staffId: staffId || null,
          action,
          resource,
          metadata: metadata ? JSON.stringify(metadata) : undefined,
        },
      });
    } catch (err) {
      console.warn("Audit logging DB warning:", err);
    }
  } else {
    console.log(`[AUDIT LOG] ${new Date().toISOString()} | Action: ${action} | Resource: ${resource} | Staff: ${staffId || "System"}`);
  }
}
