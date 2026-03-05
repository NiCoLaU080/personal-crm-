export async function POST(request) {
  const { contact, notionKey, notionDbId } = await request.json();

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${notionKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    },
    body: JSON.stringify({
      parent: { database_id: notionDbId },
      properties: {
        Name: { title: [{ text: { content: contact.name || "" } }] },
        Area: { select: { name: contact.area || "Personal" } },
        Context: { rich_text: [{ text: { content: contact.context || "" } }] },
        Tags: { multi_select: (contact.tags || []).map(t => ({ name: t })) },
        "Follow-up": { rich_text: [{ text: { content: contact.followUp || "" } }] },
        "Follow-up Date": contact.followUpDate ? { date: { start: contact.followUpDate } } : undefined,
        Notes: { rich_text: [{ text: { content: contact.notes || "" } }] },
        Energy: { select: { name: contact.energy || "medium" } },
        Links: { rich_text: [{ text: { content: contact.linkStr || "" } }] },
      }
    })
  });

  if (res.ok) return new Response(JSON.stringify({ ok: true }), { status: 200 });
  const err = await res.text();
  return new Response(JSON.stringify({ ok: false, error: err }), { status: 500 });
}
