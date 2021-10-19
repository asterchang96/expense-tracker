module.exports = {
  getIconClass: function (recordCategory, categories) {
    const categoryOfRecord = categories.find(category => category.category === recordCategory)
    return categoryOfRecord.iconClass
  },
  ifEqual: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
      }
    return options.inverse(this)
  },
}