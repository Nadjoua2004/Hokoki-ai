const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  number: { type: String },
  entity: {
    type: Number,
    enum: [1, 2, 3], // 1=Travail, 2=Emploi, 3=CNAS
    required: true
  },
  type: {
    type: Number,
    enum: [0, 1, 2, 3], // 0=أصلي، 1=تعديل، 2=إلغاء، 3=تطبيقي
    required: true
  },
  pdfUrl: { type: String, required: true },
  relatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    default: null
  }
}, { timestamps: true });

documentSchema.index({ entity: 1, type: 1 });

module.exports = mongoose.model('Document', documentSchema);
