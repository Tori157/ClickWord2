Array.prototype.filterByExcludeIds = function (excludeIds) {
  if (this.length === 0) return [];
  return this.filter((item) => !excludeIds.includes(item.id));
};

Array.prototype.filterByMode = function (mode) {
  if (this.length === 0) return [];
  return this.filter((item) => item.difficulty === mode);
};

Array.prototype.shuffle = function () {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
};
