import { createComponent, Region } from 'frint';

export default createComponent({
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="eight columns">
            <h3>Main</h3>

            <hr />

            <Region name="main" />
          </div>

          <div className="four columns">
            <h3>Sidebar</h3>

            <hr />

            <Region name="sidebar" />
          </div>
        </div>
      </div>
    );
  }
});
