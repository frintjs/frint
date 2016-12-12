import { createComponent, Region } from '../../../../src';

export default createComponent({
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="eight columns">
            <h3>Main</h3>

            <Region name="main" />
          </div>

          <div className="four columns">
            <h3>Sidebar</h3>

            <Region name="sidebar" />
          </div>
        </div>
      </div>
    );
  }
});
