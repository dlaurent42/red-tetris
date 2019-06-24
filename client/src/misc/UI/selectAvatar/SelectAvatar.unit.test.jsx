import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createMount } from '@material-ui/core/test-utils';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from '@material-ui/core/ListItem';
import SelectAvatar from './SelectAvatar';
import { AVATARS } from '../../../config/constants';

configure({ adapter: new Adapter() });

describe('<SelectAvatar /> - allow user to select an avatar from selection', () => {

  let mount;
  let wrapper;
  const mockFn = jest.fn();
  beforeEach(() => {
    mount = createMount();
    wrapper = mount(<SelectAvatar open onClose={mockFn} />);
  });
  afterEach(() => { mount.cleanUp(); });

  it('should render correctly', () => {
    expect(wrapper.contains(<DialogTitle id="simple-dialog-title">Select your avatar</DialogTitle>)).toEqual(true);
    expect(wrapper.find(ListItem)).toHaveLength(AVATARS.length);
  });

  it('should call function from props onClick', () => {
    wrapper.find(ListItem).first().simulate('click');
    expect(mockFn).toHaveBeenCalled();
  });

});
