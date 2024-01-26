export function setPrototype() {
  // eslint-disable-next-line
  Array.prototype.getMinIdx = function () {
    const maxValue = Math.min.apply(null, this);
    const minIdx = this.indexOf(maxValue);

    return minIdx;
  };

  // eslint-disable-next-line
  Array.prototype.getMaxIdx = function () {
    const maxValue = Math.max.apply(null, this);
    const maxIdx = this.indexOf(maxValue);

    return maxIdx;
  };

  // eslint-disable-next-line
  Array.prototype.sum = function () {
    return this.reduce((acc, cur) => acc + cur, 0);
  };
}
