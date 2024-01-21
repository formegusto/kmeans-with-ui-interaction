export function setPrototype() {
  Array.prototype.getMinIdx = function () {
    const maxValue = Math.min.apply(null, this);
    const minIdx = this.indexOf(maxValue);

    return minIdx;
  };

  Array.prototype.getMaxIdx = function () {
    const maxValue = Math.max.apply(null, this);
    const maxIdx = this.indexOf(maxValue);

    return maxIdx;
  };
}
