var Signal0 = (function () {
    function Signal0() {
        this.handlers = [];
        this.onceHandlers = [];
    }
    Signal0.prototype.add = function (handler) {
        this.handlers.push(handler);
    };
    Signal0.prototype.addOnce = function (handler) {
        this.onceHandlers.push(handler);
    };
    Signal0.prototype.dispatch = function () {
        this.handlers.forEach(function (h) {
            return h();
        });
        this.onceHandlers.forEach(function (h) {
            return h();
        });
        this.onceHandlers = [];
    };
    return Signal0;
})();
var Signal1 = (function () {
    function Signal1() {
        this.handlers = [];
        this.onceHandlers = [];
    }
    Signal1.prototype.add = function (handler) {
        this.handlers.push(handler);
    };
    Signal1.prototype.addOnce = function (handler) {
        this.onceHandlers.push(handler);
    };
    Signal1.prototype.dispatch = function (param1) {
        this.handlers.forEach(function (h) {
            return h(param1);
        });
        this.onceHandlers.forEach(function (h) {
            return h(param1);
        });
        this.onceHandlers = [];
    };
    return Signal1;
})();
var Signal2 = (function () {
    function Signal2() {
        this.handlers = [];
        this.onceHandlers = [];
    }
    Signal2.prototype.add = function (handler) {
        this.handlers.push(handler);
    };
    Signal2.prototype.addOnce = function (handler) {
        this.onceHandlers.push(handler);
    };
    Signal2.prototype.dispatch = function (param1, param2) {
        this.handlers.forEach(function (h) {
            return h(param1, param2);
        });
        this.onceHandlers.forEach(function (h) {
            return h(param1, param2);
        });
        this.onceHandlers = [];
    };
    return Signal2;
})();
//@ sourceMappingURL=signals.js.map
