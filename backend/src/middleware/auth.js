import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'development-only-change-me';

export const authenticate = (req, res, next) => {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
};

export const requireStudentOrAdmin = (req, res, next) => {
  if (!authenticateUser(req, res, next)) return;
  if (!['STUDENT', 'ADMIN'].includes(req.user.role)) return res.status(403).json({ error: 'Participant or administrator access required.' });
  next();
};

export const requireDataMutation = (req, res, next) => {
  if (!authenticateUser(req, res, next)) return;
  if (req.user.role === 'COORDINATOR') return res.status(403).json({ error: 'Coordinators have read-only access.' });
  if (req.user.role === 'ADMIN') return next();
  if (req.user.role === 'STUDENT') {
    const studentResources = new Set(['registrations', 'accommodations', 'hospitality', 'evaluations', 'participants']);
    const resource = req.baseUrl.endsWith('/') ? req.path : req.path;
    const isStudentResource = [...studentResources].some((name) => req.originalUrl.includes(`/api/${name}`));
    if (isStudentResource) return next();
  }
  return res.status(403).json({ error: 'You do not have permission to modify this data.' });
};

export const requireAdmin = (req, res, next) => {
  if (!authenticateUser(req, res, next)) return;
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required.' });
  next();
};

const authenticateUser = (req, res, next) => {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) { res.status(401).json({ error: 'Authentication required.' }); return false; }
  try { req.user = jwt.verify(token, JWT_SECRET); return true; } catch { res.status(401).json({ error: 'Invalid or expired authentication token.' }); return false; }
};
