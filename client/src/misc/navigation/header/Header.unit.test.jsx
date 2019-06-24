import React from 'react';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configure } from 'enzyme';
import { createMount } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import Header from './Header';
import { DEFAULT } from '../../../config/constants';

// Mock store
const middlewares = [];
const mockStore = configureStore(middlewares);
const initialStateWithUser = { user: { user: { id: 'testId', username: '', avatar: DEFAULT.AVATAR } } };
const initialStateWithoutUser = { user: { user: { username: '', avatar: DEFAULT.AVATAR } } };
const storeWithUser = mockStore(initialStateWithUser);
const storeWithoutUser = mockStore(initialStateWithoutUser);
configure({ adapter: new Adapter() });

describe('<Header />', () => {

  let mount;
  let wrapper;
  beforeEach(() => { mount = createMount(); });
  afterEach(() => { mount.cleanUp(); });

  it('should render "full" header', () => {
    wrapper = mount(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header variant="full" />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find('.header').hasClass('full')).toBe(true);
  });

  it('should render "full" header (without specifying variant)', () => {
    wrapper = mount(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find('.header').hasClass('full')).toBe(true);
  });

  it('should render "reduced" header', () => {
    wrapper = mount(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header variant="reduced" />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find('.header').hasClass('reduced')).toBe(true);
  });


  it('should render "light" header', () => {
    wrapper = mount(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header color="light" />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find('.menu-left').hasClass('light')).toBe(true);
    expect(wrapper.find('.menu-right').hasClass('light')).toBe(true);
    expect(wrapper.find('.mobile-menu').hasClass('light')).toBe(true);
  });

  it('should render "dark" header', () => {
    wrapper = mount(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header color="dark" />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find('.menu-left').hasClass('dark')).toBe(true);
    expect(wrapper.find('.menu-right').hasClass('dark')).toBe(true);
    expect(wrapper.find('.mobile-menu').hasClass('dark')).toBe(true);
  });

  it('should render with "tournaments" as active link', () => {
    wrapper = mount(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header color="dark" location="#/tournaments" />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find('.menu-left').hasClass('dark')).toBe(true);
    expect(wrapper.find('.menu-right').hasClass('dark')).toBe(true);
    expect(wrapper.find('.mobile-menu').hasClass('dark')).toBe(true);
  });

  it('should render with "leaderboard" as active link', () => {
    wrapper = mount(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header color="dark" location="#/leaderboard" />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find('.menu-left').hasClass('dark')).toBe(true);
    expect(wrapper.find('.menu-right').hasClass('dark')).toBe(true);
    expect(wrapper.find('.mobile-menu').hasClass('dark')).toBe(true);
  });

  it('should render with "about" as active link', () => {
    wrapper = mount(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header color="dark" location="#/about" />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find('.menu-left').hasClass('dark')).toBe(true);
    expect(wrapper.find('.menu-right').hasClass('dark')).toBe(true);
    expect(wrapper.find('.mobile-menu').hasClass('dark')).toBe(true);
  });

  it('should render with "profile" as active link', () => {
    wrapper = mount(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header color="dark" location="#/profile" />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find('.menu-left').hasClass('dark')).toBe(true);
    expect(wrapper.find('.menu-right').hasClass('dark')).toBe(true);
    expect(wrapper.find('.mobile-menu').hasClass('dark')).toBe(true);
  });

  it('should render mobile menu with "Profile" and "Logout" links when burger menu is clicked', () => {
    wrapper = mount(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    wrapper.find('.mobile-menu-burger').simulate('click');
    expect(wrapper.find('.mobile-menu-item .mobile-menu-profile')).toHaveLength(1);
    expect(wrapper.find('.mobile-menu-item .mobile-menu-logout')).toHaveLength(1);
  });

  it('should render mobile menu with "Log in" and "Sign up" links when burger menu is clicked', () => {
    wrapper = mount(
      <Provider store={storeWithoutUser}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    wrapper.find('.mobile-menu-burger').simulate('click');
    expect(wrapper.find('.mobile-menu-item .mobile-menu-login')).toHaveLength(1);
    expect(wrapper.find('.mobile-menu-item .mobile-menu-signup')).toHaveLength(1);
  });

  it('should render classic menu with "Profile" and "Logout" links', () => {
    wrapper = mount(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find('.menu-item .menu-profile')).toHaveLength(1);
    expect(wrapper.find('.menu-logout')).toHaveLength(2);
  });

  it('should render classic menu with "Log in" and "Sign up" links', () => {
    wrapper = mount(
      <Provider store={storeWithoutUser}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find('.menu-item .menu-login')).toHaveLength(1);
    expect(wrapper.find('.menu-signup')).toHaveLength(2);
  });
});
