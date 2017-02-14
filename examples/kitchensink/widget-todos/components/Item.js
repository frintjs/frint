import { h, createComponent, observe, streamProps, Region } from 'frint';

import { removeTodo } from '../actions/todos';

const Item = createComponent({
  render() {
    const { todo } = this.props;

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
  }
});

export default observe(function (app) {
  return streamProps()
    // actions
    .setDispatch(
      { removeTodo },
      app.get('store')
    )

    // final observable
    .get$();
})(Item);
