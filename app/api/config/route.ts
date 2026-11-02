import { getConfig } from "@/lib/qsafe-config";
export function GET() {
  return Response.json(getConfig(), {
    headers: { "Cache-Control": "no-store" },
  });
}
