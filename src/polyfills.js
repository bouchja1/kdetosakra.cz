// https://stackoverflow.com/questions/43756211/best-way-to-polyfill-es6-features-in-react-app-that-uses-create-react-app
// https://github.com/facebook/create-react-app/blob/master/packages/react-app-polyfill/README.md
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js/features/array/find';
import 'core-js/features/array/includes';
import 'core-js/features/number/is-nan';
