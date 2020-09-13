// Register Babel to transpile before our tests run
require('@babel/register');

const Adapter = require('enzyme-adapter-react-16');
const Enzyme = require('enzyme');

Enzyme.configure({ adapter: new Adapter() });
// Disable Webpack features that Mocha doesn't understand
require.extensions['.css'] = function() {};

