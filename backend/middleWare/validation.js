// Validation middleware    
import { Types } from 'mongoose';

export const checkObjectId = (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};