import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
