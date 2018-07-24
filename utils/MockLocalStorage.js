function MockLocalStorage() {
    this.data = {};
}

MockLocalStorage.prototype.setItem = function(key, value) {
    if (typeof value == 'string') {
        this.data[key] = value;
    } else {
        throw Error('value needs to be a string');
    }
}

MockLocalStorage.prototype.getItem = function(key) {
    return this.data[key];
}

MockLocalStorage.prototype.clear = function() {
    this.data = {};
}

module.exports = MockLocalStorage;