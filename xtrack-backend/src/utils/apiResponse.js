export function ok(res, data, meta) {
  return res.json({ success: true, data, meta });
}

export function created(res, data) {
  return res.status(201).json({ success: true, data });
}
