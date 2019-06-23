import React from 'react';
import { MemoryRouter } from 'react-router';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PageNotFound from './404';

configure({ adapter: new Adapter() });

describe('<404 /> - page displayed when page not found', () => {

  it('should render a redirection', () => {
    const component = renderer.create(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
