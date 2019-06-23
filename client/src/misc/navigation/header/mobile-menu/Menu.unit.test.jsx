import React from 'react';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createMount } from '@material-ui/core/test-utils';
import Menu from './Menu';
import { DEFAULT } from '../../../../config/constants';

// Mock store
const middlewares = [];
const mockStore = configureStore(middlewares);
configure({ adapter: new Adapter() });

describe('<Menu />', () => {

  let mount;
  let wrapper;
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation(init => [init, setState]);

  beforeEach(() => { mount = createMount(); });

  afterEach(() => {
    jest.clearAllMocks();
    mount.cleanUp();
  });

  it('should display menu opened thanks to burger', () => {

    const initialState = { user: { username: '', avatar: DEFAULT.AVATAR } };
    const store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Menu />
        </MemoryRouter>
      </Provider>,
    );
    wrapper.find('.mobile-menu-burger').simulate('click');
  });
});
