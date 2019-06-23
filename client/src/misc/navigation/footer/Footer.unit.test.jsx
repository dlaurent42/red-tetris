import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createMount } from '@material-ui/core/test-utils';
import Footer from './Footer';

configure({ adapter: new Adapter() });

describe('<Footer />', () => {

  let mount;
  let wrapper;
  beforeEach(() => {
    mount = createMount();
    wrapper = mount(<Footer />);
  });
  afterEach(() => { mount.cleanUp(); });

  it('should render correctly', () => {
    expect(wrapper.contains(
      <footer className="footer">
        <div>{`© Copyright ${new Date().getFullYear()}`}</div>
      </footer>,
    )).toEqual(true);
  });

});
