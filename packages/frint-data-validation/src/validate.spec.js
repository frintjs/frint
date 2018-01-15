/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';
import { createModel, Types } from 'frint-data';

import validate from './validate';
import Rules from './Rules';

describe('frint-data-validation › validate', function () {
  it('is a function', function () {
    expect(validate).to.be.a('function');
  });

  describe('can validate model synchronously', function () {
    const Post = createModel({
      schema: {
        title: Types.string,
      },
      setTitle(newTitle) {
        this.title = newTitle;
      },
    });

    Post.validationRules = [
      {
        name: 'title',
        rule: function (model) {
          return model.title.length > 0;
        },
        message: 'Cannot be empty',
      },
    ];

    it('with custom rule defined statically', function () {
      const post = new Post({
        title: 'Hello World',
      });

      expect(validate(post)).to.deep.equal([]);

      post.setTitle('');
      expect(validate(post)).to.deep.equal([
        {
          name: 'title',
          message: 'Cannot be empty',
        },
      ]);
    });

    it('with rule passed manually', function () {
      const post = new Post({
        title: 'Hello World',
      });

      expect(validate(post), [
        Rules.isNotEmpty('title', 'Cannot be empty'),
      ]).to.deep.equal([]);

      post.setTitle('');
      expect(validate(post)).to.deep.equal([
        {
          name: 'title',
          message: 'Cannot be empty',
        },
      ]);
    });
  });
});
