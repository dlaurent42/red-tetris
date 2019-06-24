import React from 'react';
import mockAxios from 'axios';
import { configure } from 'enzyme';
import { createMount } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import Profile from './Profile';
import { DEFAULT } from '../../config/constants';

configure({ adapter: new Adapter() });


/* https://github.com/testing-library/react-testing-library/issues/281#issuecomment-480349256 */

describe('<Header />', () => {

  let mount;
  let wrapper;
  const userAccount = { id: 'testId', username: 'GreatUsername', avatar: DEFAULT.AVATAR, scores: {} };
  const originalError = console.error;
  beforeEach(() => {
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) return;
      originalError.call(console, ...args);
    };
    mount = createMount();
  });
  afterEach(() => {
    console.error = originalError;
    mount.cleanUp();
  });

  it('should render correctly without user account', () => {
    wrapper = mount(<Profile open onClose={jest.fn()} user={{}} />);
    expect(wrapper.find('.profile').exists()).toBe(true);
  });

  it('should render correctly with user account but API call failed', () => {
    wrapper = mount(<Profile open onClose={jest.fn()} user={userAccount} />);
    mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: { success: false } }));
    expect(mockAxios.get).toHaveBeenCalled();
  });

  it('should render correctly with user account but API call get rejected', () => {
    wrapper = mount(<Profile open onClose={jest.fn()} user={userAccount} />);
    mockAxios.get.mockImplementationOnce(() => Promise.reject());
    expect(mockAxios.get).toHaveBeenCalled();
  });

  it('should render correctly with user account and API call succeed', () => {
    wrapper = mount(<Profile open onClose={jest.fn()} user={userAccount} />);
    mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: {
      success: true,
      user: userAccount,
    } }));
    expect(mockAxios.get).toHaveBeenCalled();
  });

  it('should render correctly on small screen width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    wrapper = mount(<Profile open onClose={jest.fn()} user={userAccount} />);
  });

});
