module.exports = {
  getIconClass: function (recordCategory, categories) {
    const categoryOfRecord = categories.find(category => category.category === recordCategory)
    return categoryOfRecord.iconClass
  }
}