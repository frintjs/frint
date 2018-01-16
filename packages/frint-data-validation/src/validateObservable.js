import { map } from 'rxjs/operators/map';

import validate from './validate';

export default function validate$(model, options = {}) {
  return model.get$().pipe(
    map(m => validate(m, options))
  );
}
