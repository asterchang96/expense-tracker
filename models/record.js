const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  incomeOrExpenses:{
    type: String, 
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    trim: true
  },
  merchant: {
    type: String,
    required: true,
    trim: true
  },
  userId:{ //加入關聯設定
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  }
})
module.exports = mongoose.model('Record', recordSchema)