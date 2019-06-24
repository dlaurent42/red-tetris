import React from 'react';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configure } from 'enzyme';
import renderer from 'react-test-renderer';
import { createMount } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import Header from './Header';
import { DEFAULT } from '../../../config/constants';

// Mock store
const middlewares = [];
const mockStore = configureStore(middlewares);
const initialStateWithUser = { user: { user: { id: 'testId', username: '', avatar: DEFAULT.AVATAR } } };
const initialStateWithoutUser = { user: { user: { id: 'testId', username: '', avatar: DEFAULT.AVATAR } } };
const storeWithUser = mockStore(initialStateWithUser);
const storeWithoutUser = mockStore(initialStateWithoutUser);
configure({ adapter: new Adapter() });

describe('<Header />', () => {

  it('should render "full" header', () => {
    const component = renderer.create(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header variant="full" />
        </MemoryRouter>
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render "reduced" header', () => {
    const component = renderer.create(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header variant="reduced" />
        </MemoryRouter>
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should not render (wrong variant)', () => {
    const component = renderer.create(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header variant="too-bad" />
        </MemoryRouter>
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render "light" header', () => {
    const component = renderer.create(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header color="light" />
        </MemoryRouter>
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render "dark" header', () => {
    const component = renderer.create(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header color="dark" />
        </MemoryRouter>
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render mobile menu without user', () => {
    const mount = createMount();
    const wrapper = mount(
      <Provider store={storeWithoutUser}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    wrapper.find('.mobile-menu-burger').simulate('click');
    mount.cleanUp();
  });

  it('should render mobile menu with user', () => {
    const mount = createMount();
    const wrapper = mount(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    wrapper.find('.mobile-menu-burger').simulate('click');
    mount.cleanUp();
  });

  it('should render classic menu without user', () => {
    const component = renderer.create(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header color="dark" />
        </MemoryRouter>
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render classic menu with user', () => {
    global.window = Object.create(window);
    const hash = '#/profile';
    Object.defineProperty(window, 'location', {
      value: { hash },
    });
    const component = renderer.create(
      <Provider store={storeWithUser}>
        <MemoryRouter>
          <Header color="dark" location={hash} />
        </MemoryRouter>
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
