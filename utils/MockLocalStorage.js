function MockLocalStorage() {
    this.data = {};
    this.data.name = 'kkk';
}

MockLocalStorage.prototype.setItem = function(key, value) {
    this.data[key] = value;
}

MockLocalStorage.prototype.getItem = function(key) {
    return this.data[key];
}

module.exports = MockLocalStorage;