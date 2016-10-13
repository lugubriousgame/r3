System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function validate(grid, { x, y }) {
        if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y)) {
            throw new Error(`(${x}, ${y}) is not valid`);
        }
        if (!grid.boundsCheck({ x, y })) {
            throw new Error(`(${x}, ${y}) is out of bounds`);
        }
    }
    var Grid;
    return {
        setters: [],
        execute: function () {
            Grid = class Grid {
                constructor(width, height) {
                    this.width = width;
                    this.height = height;
                    this.data = new Map();
                }
                boundsCheck({ x, y }) {
                    const { width, height } = this;
                    return x >= 0 && x < width && y >= 0 && y < height;
                }
                get({ x, y }) {
                    validate(this, { x, y });
                    const key = JSON.stringify({ x, y });
                    return this.data.get(key);
                }
                set({ x, y }, value) {
                    validate(this, { x, y });
                    const key = JSON.stringify({ x, y });
                    this.data.set(key, value);
                }
                [Symbol.iterator]() {
                    function* iterator() {
                        const { width, height } = this;
                        for (let x = 0; x < width; ++x)
                            for (let y = 0; y < height; ++y) {
                                yield this.get({ x, y });
                            }
                    }
                    return iterator.call(this);
                }
            };
            exports_1("default", Grid);
        }
    };
});

//# sourceMappingURL=grid.js.map
