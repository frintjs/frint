import React from 'react';
import { observe, streamProps } from 'frint-react';
import SomeFormModel from '../models/SomeFormModel';

const submitForm = function submitForm(e) {
  e.preventDefault();
  // eslint-disable-next-line no-console
  console.log("Form submit");
};

class theForm extends React.Component {
  render() {
  // eslint-disable-next-line no-console
    console.log('Props', this.props);
    const {
      values,
    } = this.props;

    return (
      <div>
        <p>This is the form</p>
        <form onSubmit={this.submitForm}>
          <label>Your name: <input onChange={e => this.props.handleChange('name', e.target.value)} type="text" value={values.name} /></label>
          <label>Your city: <input type="text" /></label>
          <input onSubmit={submitForm} type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

theForm.propTypes = {
  values: React.PropTypes.object,
  handleChange: React.PropTypes.func,
};

export default observe(function observeMe() {
  const formModel = new SomeFormModel({
    name: 'xyz',
  });

  return streamProps()
    .set(
      formModel.attributes$(),
      formAttributes => ({ values: formAttributes }),
    )
    .set('handleChange', (fieldName, fieldValue) => {
      return formModel.set(fieldName, fieldValue);
    })
    .get$();
})(theForm);
