import { prisma } from './content/prisma';

export async function withAudit<T>(
  action: string,
  entityType: string,
  fn: () => Promise<T>,
  opts: { userId?: string; diff?: object; ip?: string; userAgent?: string; entityId?: string }
): Promise<T> {
  const result = await fn();
  
  await prisma.auditLog.create({
    data: {
      action,
      entityType,
      entityId: opts.entityId,
      userId: opts.userId,
      diff: opts.diff ? JSON.parse(JSON.stringify(opts.diff)) : null,
      ip: opts.ip,
      userAgent: opts.userAgent,
    }
  });
  
  return result;
}
