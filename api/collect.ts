export default function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const { query } = req;

  res.status(200).json({ ok: true, query });
}
