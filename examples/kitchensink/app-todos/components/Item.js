import React from 'react';
import { observe, streamProps, Region } from 'frint-react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { removeTodo, updateTodo } from '../actions/todos';

class Item extends React.Component {
  render() {
    const { todo } = this.props;

    return (
      <div style={{background: '#f1f1f1', border: '1px solid #e1e1e1', marginBottom: '15px', padding: '15px', borderRadius: '4px'}}>
        {!this.props.showEditForm && (
          <p>
            {todo.title}

            [<a href="javascript:" onClick={() => this.props.edit(todo)}>edit</a>]
            [<a href="javascript:" onClick={() => this.props.removeTodo(todo.id)}>x</a>]
          </p>
        )}

        {this.props.showEditForm && (
          <p>
            <input
              className="u-full-width"
              type="text"
              placeholder="my todo title..."
              id="todoItemInput"
              value={this.props.inputValue}
              onChange={(e) => this.props.changeInput(e.target.value)}
            />

            <button
              type="button"
              className="button-primary"
              onClick={() => this.props.submit(todo.id, this.props.inputValue)}
            >
              Submit
            </button>

            [<a href="javascript:" onClick={() => this.props.cancelEdit()}>cancel</a>]
          </p>
        )}

        <p>Below is Region <strong>todo-item</strong> that is specific to this Todo item:</p>

        <Region
          name="todo-item"
          uniqueKey={`todo-item-${todo.id}`}
          data={{text: todo.title}}
        />
      </div>
    );
  }
}

export default observe(function (app) {
  const showEditForm$ = new BehaviorSubject(false); // start with hidden form
  const formInput$ = new BehaviorSubject('');
  const store = app.get('store');

  const cancelEdit = () => {
    formInput$.next(''); // clear input field value
    showEditForm$.next(false);
  };

  return streamProps()
    // dispatchable actions against store
    .setDispatch(
      { removeTodo },
      store
    )

    // stream values
    .set(
      showEditForm$,
      (showEditForm) => ({ showEditForm })
    )
    .set(
      formInput$,
      (inputValue) => ({ inputValue })
    )

    // form actions
    .set({
      edit: (todo) => {
        formInput$.next(todo.title); // set input field value
        showEditForm$.next(true);
      },
      changeInput: (value) => {
        formInput$.next(value);
      },
      cancelEdit,
      submit: (id, newTitle) => {
        store.dispatch(updateTodo(id, newTitle));
        cancelEdit();
      }
    })

    // final observable
    .get$();
})(Item);
