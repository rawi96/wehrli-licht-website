import { content } from '@/integrations';
import { NextRequest, NextResponse } from 'next/server';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export function OPTIONS() {
  return NextResponse.json('ok', { status: 200, headers });
}

/** Preview links for the CMS's preview plugin: the live and the draft version of a record. */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get('token');

  if (token !== process.env.DRAFT_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Invalid Token' }, { status: 401, headers });
  }

  const previewLinks = await content.getPreviewLinks(await req.json(), token);

  return NextResponse.json({ previewLinks }, { status: 200, headers });
}
