const react = require('react');

// Resolution for requestAnimationFrame not supported in jest error:
global.window = global;
window.addEventListener = () => {};
window.requestAnimationFrame = () => {
    throw new Error('requestAnimationFrame is not supported in Node');
};

module.exports = react;
