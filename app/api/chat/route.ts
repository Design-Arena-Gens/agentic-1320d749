import { NextRequest } from 'next/server';
import { routeAndExecute } from '@/lib/agent';
import { AllPlugins } from '@/lib/plugins';

// register plugins once on cold start
let registered = false;
function ensureRegistered() {
  if (registered) return;
  const { registerPlugin } = require('@/lib/agent');
  AllPlugins.forEach(p => registerPlugin(p));
  registered = true;
}

export async function POST(req: NextRequest) {
  ensureRegistered();
  const body = await req.json();
  const lastUser = [...(body?.messages||[])].reverse().find((m: any)=>m.role==='user')?.content || '';
  const result = await routeAndExecute(String(lastUser||''));
  return Response.json({ response: result.text, spoken: result.spoken });
}
