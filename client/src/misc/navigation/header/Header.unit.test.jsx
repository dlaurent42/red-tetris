import React from 'react';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configure } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Header from './Header';
import { DEFAULT } from '../../../config/constants';

// Mock store
const middlewares = [];
const mockStore = configureStore(middlewares);
const initialState = { user: { username: '', avatar: DEFAULT.AVATAR } };
const store = mockStore(initialState);
configure({ adapter: new Adapter() });

describe('<Header />', () => {

  it('should render "full" header', () => {
    const component = renderer.create(
      <Provider store={store}>
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
      <Provider store={store}>
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
      <Provider store={store}>
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
      <Provider store={store}>
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
      <Provider store={store}>
        <MemoryRouter>
          <Header color="dark" />
        </MemoryRouter>
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
