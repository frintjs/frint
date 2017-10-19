import React from 'react';
import { observe, Region } from 'frint-react';
import { of } from 'rxjs/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operator/map';
import { merge } from 'rxjs/operator/merge';
import { scan } from 'rxjs/operator/scan';

import { addTodo } from '../actions/todos';
import Item from './Item';

class Root extends React.Component {
  render() {
    return (
      <div>
        <h5>App: Todos</h5>

        <label htmlFor="todoInput">
          Create a new Todo item
        </label>

        <input
          className="u-full-width"
          type="text"
          placeholder="my todo title..."
          id="todoInput"
          value={this.props.inputValue}
          onChange={(e) => this.props.changeInput(e.target.value)}
        />

        <button
          type="button"
          className="button-primary"
          onClick={() => this.props.addTodo(this.props.inputValue)}
        >
          Submit
        </button>

        <div>
        {this.props.todos.map((todo, index) => {
          return (
            <Item
              key={`todo-${index}`}
              todo={todo}
            />
          );
        })}
        </div>
      </div>
    );
  }
}

export default observe(function (app) {
  const store = app.get('store');

  const state$ = store.getState$()
    ::map((state) => {
      return {
        todos: state.todos.records,
      };
    });

  const formInput$ = (new BehaviorSubject(''))
    ::map((inputValue) => {
      return {
        inputValue,
      };
    });
  const clearInput = () => formInput$.next('');
  const changeInput = (value) => formInput$.next(value);

  const actions$ = of({
    addTodo: (...args) => {
      clearInput();
      return store.dispatch(addTodo(...args));
    },

    changeInput,
    clearInput,
  });

  return state$
    ::merge(actions$)
    ::merge(formInput$)
    ::scan((props, emitted) => {
      return {
        ...props,
        ...emitted,
      };
    }, {
      todos: [],
    });
})(Root);
