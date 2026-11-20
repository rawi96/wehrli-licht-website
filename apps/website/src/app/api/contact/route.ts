import { submitContactRequest } from '@/features/contact/service';
import { NextRequest, NextResponse } from 'next/server';

const readJson = async (req: NextRequest): Promise<unknown> => {
  try {
    return await req.json();
  } catch {
    return null;
  }
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const result = await submitContactRequest(await readJson(req));

  if (result.ok) {
    return NextResponse.json({ ok: true });
  }

  switch (result.error) {
    case 'invalid_request':
      return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
    case 'invalid_fields':
      return NextResponse.json(
        { error: 'Bitte prüfen Sie Ihre Angaben.', fieldErrors: result.fieldErrors },
        { status: 400 },
      );
    case 'not_configured':
      return NextResponse.json({ error: 'Die Anfrage konnte nicht gesendet werden.' }, { status: 500 });
    case 'send_failed':
      return NextResponse.json({ error: 'Die Anfrage konnte nicht gesendet werden.' }, { status: 502 });
  }
};
