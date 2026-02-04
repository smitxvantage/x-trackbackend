import * as service from "./attendance.service.js";

export const getMyAttendance = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getAttendanceByUser(req.user.id) }); }
  catch (e) { next(e); }
};

export const checkIn = async (req, res, next) => {
  try { res.json({ success: true, data: await service.checkIn(req.user.id) }); }
  catch (e) { next(e); }
};

export const checkOut = async (req, res, next) => {
  try { res.json({ success: true, data: await service.checkOut(req.user.id) }); }
  catch (e) { next(e); }
};

export const getWeeklyHours = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getWeeklyHours(req.user.id) }); }
  catch (e) { next(e); }
};
