import { Schema, model } from 'mongoose';

const roleSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Role title is required'],
    trim: true,
  },
});

const Role = model('Role', roleSchema);

export default Role;
