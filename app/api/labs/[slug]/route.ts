import { getLabBySlug } from "@/lib/labs/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const lab = getLabBySlug(slug);

  if (!lab) {
    return Response.json(
      {
        error: {
          code: "LAB_NOT_FOUND",
          message: "指定された演習が見つかりません。",
        },
      },
      { status: 404 },
    );
  }

  return Response.json({ data: lab });
}
