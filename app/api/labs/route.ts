import { getLabs } from "@/lib/labs/queries";

export function GET() {
  const labs = getLabs();
  return Response.json({ data: labs, meta: { total: labs.length } });
}
