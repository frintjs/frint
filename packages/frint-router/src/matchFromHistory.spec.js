/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import matchFromHistory from './matchFromHistory';

describe('frint-router › matchFromHistory', function () {
  it('is a function', function () {
    expect(matchFromHistory).to.be.a('function');
  });

  const validEntries = [
    {
      name: 'exact path in root',
      input: {
        pattern: '/',
        exact: true,
        history: {
          location: {
            pathname: '/',
          },
        },
      },
      output: {
        url: '/',
        params: {},
        isExact: true,
      }
    },

    {
      name: 'exact path in deep link',
      input: {
        pattern: '/houses/revenclaw',
        exact: true,
        history: {
          location: {
            pathname: '/houses/revenclaw',
          },
        },
      },
      output: {
        url: '/houses/revenclaw',
        params: {},
        isExact: true,
      }
    },

    {
      name: 'non-exact deep link',
      input: {
        pattern: '/houses/hufflepuff',
        history: {
          location: {
            pathname: '/houses/hufflepuff',
          },
        },
      },
      output: {
        url: '/houses/hufflepuff',
        params: {},
        isExact: true,
      }
    },

    {
      name: 'non-exact deep link, with children',
      input: {
        pattern: '/houses',
        history: {
          location: {
            pathname: '/houses/gryffindor',
          },
        },
      },
      output: {
        url: '/houses',
        params: {},
        isExact: false,
      }
    },

    {
      name: 'exact deep link, with params',
      input: {
        pattern: '/houses/:name',
        exact: true,
        history: {
          location: {
            pathname: '/houses/slytherin',
          },
        },
      },
      output: {
        url: '/houses/slytherin',
        params: {
          name: 'slytherin',
        },
        isExact: true,
      }
    },

    {
      name: 'exact deep link, with multiple params',
      input: {
        pattern: '/comics/:universe/:superhero',
        exact: true,
        history: {
          location: {
            pathname: '/comics/marvel/spiderman',
          },
        },
      },
      output: {
        url: '/comics/marvel/spiderman',
        params: {
          universe: 'marvel',
          superhero: 'spiderman',
        },
        isExact: true,
      }
    },

    {
      name: 'non-exact deep link, with multiple params',
      input: {
        pattern: '/comics/:universe/:superhero',
        history: {
          location: {
            pathname: '/comics/dc/batman/abilities',
          },
        },
      },
      output: {
        url: '/comics/dc/batman',
        params: {
          universe: 'dc',
          superhero: 'batman',
        },
        isExact: false,
      }
    },
  ];

  validEntries.forEach(function (entry) {
    it(`matches: ${entry.name}`, function () {
      const result = matchFromHistory(
        entry.input.pattern,
        entry.input.history,
        { exact: entry.input.exact }
      );

      expect(result.url).to.equal(entry.output.url);
      expect(result.params).to.deep.equal(entry.output.params);
      expect(result.isExact).to.equal(entry.output.isExact);
    });
  });
});
