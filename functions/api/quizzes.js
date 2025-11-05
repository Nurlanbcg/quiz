// functions/api/quizzes.js
export async function onRequestGet(context) {
  // context.env contains bindings including your D1 binding (see dashboard/wrangler)
  const db = context.env.DB; // DB is the binding name - change if you named it differently
  // simple query
  const res = await db.prepare("SELECT id, title, created_at FROM quizzes ORDER BY created_at DESC").all();
  return new Response(JSON.stringify(res.results ?? []), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context) {
  const db = context.env.DB;
  const body = await context.request.json();
  const { title } = body;
  if (!title) return new Response("Missing title", { status: 400 });
  await db.prepare("INSERT INTO quizzes (title, created_at) VALUES (?, datetime('now'))").bind(title).run();
  return new Response("OK", { status: 201 });
}
