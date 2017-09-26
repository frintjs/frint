/**
 * Webpack's `externals` equivalent object,
 * listing dependencies that Frint packages use.
 */
export default {
  // lodash
  'lodash/cloneDeep': { root: ['_', 'cloneDeep'] },
  'lodash/each': { root: ['_', 'each'] },
  'lodash/find': { root: ['_', 'find'] },
  'lodash/findIndex': { root: ['_', 'findIndex'] },
  'lodash/first': { root: ['_', 'first'] },
  'lodash/includes': { root: ['_', 'includes'] },
  'lodash/isArray': { root: ['_', 'isArray'] },
  'lodash/isEqual': { root: ['_', 'isEqual'] },
  'lodash/isPlainObject': { root: ['_', 'isPlainObject'] },
  'lodash/last': { root: ['_', 'last'] },
  'lodash/get': { root: ['_', 'get'] },
  'lodash/set': { root: ['_', 'set'] },
  'lodash/mapValues': { root: ['_', 'mapValues'] },
  'lodash/merge': { root: ['_', 'merge'] },
  'lodash/omit': { root: ['_', 'omit'] },
  'lodash/padStart': { root: ['_', 'padStart'] },
  'lodash/tail': { root: ['_', 'tail'] },
  'lodash/take': { root: ['_', 'take'] },
  'lodash/takeRight': { root: ['_', 'takeRight'] },
  'lodash/zipObject': { root: ['_', 'zipObject'] },
  'lodash/zipWith': { root: ['_', 'zipWith'] },

  // rxjs
  'rxjs/BehaviorSubject': { root: ['Rx', 'BehaviorSubject'] },
  'rxjs/Observable': { root: ['Rx', 'Observable'] },
  'rxjs/Subject': { root: ['Rx', 'Subject'] },
  'rxjs/operator/concatMap': { root: ['Rx', 'Observable', 'prototype', 'concatMap'] },
  'rxjs/operator/find': { root: ['Rx', 'Observable', 'prototype', 'find'] },
  'rxjs/operator/first': { root: ['Rx', 'Observable', 'prototype', 'first'] },
  'rxjs/operator/map': { root: ['Rx', 'Observable', 'prototype', 'map'] },
  'rxjs/observable/merge': { root: ['Rx', 'Observable', 'merge'] },
  'rxjs/observable/of': { root: ['Rx', 'Observable', 'of'] },
  'rxjs/operator/scan': { root: ['Rx', 'Observable', 'prototype', 'scan'] },
  'rxjs/operator/switchMap': { root: ['Rx', 'Observable', 'prototype', 'switchMap'] },
};
