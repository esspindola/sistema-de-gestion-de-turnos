import mongoose from 'mongoose';

const professionalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    availableDays: [{ type: String, enum: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'] }],
  },
  { timestamps: true }
);

export const Professional = mongoose.model('Professional', professionalSchema);
