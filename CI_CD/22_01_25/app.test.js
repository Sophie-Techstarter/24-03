const add = require('./app');

test('1 + 2 ergibt 3 im Ergebnis', () => {
    expect(add(1, 2)).toBe(3);
});
