/**
 * Webpack's `externals` equivalent object,
 * listing dependencies that Frint packages use.
 */
export default {
  // lodash
  'lodash/cloneDeep': ['_', 'cloneDeep'],
  'lodash/each': ['_', 'each'],
  'lodash/find': ['_', 'find'],
  'lodash/findIndex': ['_', 'findIndex'],
  'lodash/first': ['_', 'first'],
  'lodash/includes': ['_', 'includes'],
  'lodash/isArray': ['_', 'isArray'],
  'lodash/isEqual': ['_', 'isEqual'],
  'lodash/isPlainObject': ['_', 'isPlainObject'],
  'lodash/last': ['_', 'last'],
  'lodash/get': ['_', 'get'],
  'lodash/set': ['_', 'set'],
  'lodash/mapValues': ['_', 'mapValues'],
  'lodash/merge': ['_', 'merge'],
  'lodash/omit': ['_', 'omit'],
  'lodash/padStart': ['_', 'padStart'],
  'lodash/tail': ['_', 'tail'],
  'lodash/take': ['_', 'take'],
  'lodash/takeRight': ['_', 'takeRight'],
  'lodash/zipObject': ['_', 'zipObject'],
  'lodash/zipWith': ['_', 'zipWith'],

  // rxjs
  'rxjs/BehaviorSubject': ['Rx', 'BehaviorSubject'],
  'rxjs/Observable': ['Rx', 'Observable'],
  'rxjs/Subject': ['Rx', 'Subject'],
  'rxjs/operator/concatMap': ['Rx', 'Observable', 'prototype', 'concatMap'],
  'rxjs/operator/find': ['Rx', 'Observable', 'prototype', 'find'],
  'rxjs/operator/first': ['Rx', 'Observable', 'prototype', 'first'],
  'rxjs/operator/map': ['Rx', 'Observable', 'prototype', 'map'],
  'rxjs/observable/merge': ['Rx', 'Observable', 'merge'],
  'rxjs/observable/of': ['Rx', 'Observable', 'of'],
  'rxjs/operator/scan': ['Rx', 'Observable', 'prototype', 'scan'],
  'rxjs/operator/switchMap': ['Rx', 'Observable', 'prototype', 'switchMap'],
};
