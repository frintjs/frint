import Frint from './frint';

import CorePlugin from './core';
import StorePlugin from './store';
import ModelPlugin from './model';
import ReactPlugin from './react';
import CompatPlugin from './compat';

Frint.use(CorePlugin);
Frint.use(StorePlugin);
Frint.use(ModelPlugin);
Frint.use(ReactPlugin);
Frint.use(CompatPlugin);

export default Frint;
