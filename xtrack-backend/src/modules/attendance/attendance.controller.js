import * as service from "./attendance.service.js";

// --------------------------------------
// USER: GET /attendance/me
// --------------------------------------
export async function getMyAttendance(req, res, next) {
  try {
    const data = await service.getAttendanceByUser(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// --------------------------------------
// USER: GET /attendance/my-summary
// --------------------------------------
export async function getMySummary(req, res, next) {
  try {
    const data = await service.getMonthlySummary(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// --------------------------------------
// USER: POST /attendance/check-in
// --------------------------------------
export async function checkIn(req, res, next) {
  try {
    const data = await service.checkIn(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// --------------------------------------
// USER: POST /attendance/check-out
// --------------------------------------
export async function checkOut(req, res, next) {
  try {
    const data = await service.checkOut(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// --------------------------------------
// ADMIN: GET /attendance
// --------------------------------------
export async function getAllAttendance(req, res, next) {
  try {
    const data = await service.getAllAttendance();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
