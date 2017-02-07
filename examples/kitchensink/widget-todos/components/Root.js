import { h, createComponent, observe, Region } from 'frint';
import { Observable, BehaviorSubject } from 'rxjs';

import { addTodo, removeTodo } from '../actions/todos';

const Root = createComponent({
  render() {
    return (
      <div>
        <h5>Widget: Todos</h5>

        <label for="todoInput">
          Create a new Todo item
        </label>

        <input
          class="u-full-width"
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
        {this.props.todos.map((todo) => {
          return (
            <div style={{background: '#f1f1f1', border: '1px solid #e1e1e1', marginBottom: '15px', padding: '15px', borderRadius: '4px'}}>
              <p>{todo.title} [<a href="#" onClick={() => this.props.removeTodo(todo.id)}>x</a>]</p>

              <p>Below is Region <strong>todo-item</strong> that is specific to this Todo item:</p>

              <Region
                name="todo-item"
                uniqueKey={`todo-item-${todo.id}`}
                data={{text: todo.title}}
              />
            </div>
          );
        })}
        </div>
      </div>
    );
  }
});

export default observe(function (app) {
  const store = app.get('store');

  const state$ = store.getState$()
    .map((state) => {
      return {
        todos: state.todos.records,
      };
    });

  const formInput$ = (new BehaviorSubject(''))
    .map((inputValue) => {
      return {
        inputValue,
      };
    });
  const clearInput = () => formInput$.next('');
  const changeInput = (value) => formInput$.next(value);

  const actions$ = Observable.of({
    addTodo: (...args) => {
      clearInput();
      return store.dispatch(addTodo(...args));
    },
    removeTodo: (...args) => store.dispatch(removeTodo(...args)),

    changeInput,
    clearInput,
  });

  return state$
    .merge(actions$)
    .merge(formInput$)
    .scan((props, emitted) => {
      return {
        ...props,
        ...emitted,
      };
    }, {
      todos: [],
    });
})(Root);
