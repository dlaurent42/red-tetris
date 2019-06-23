import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createMount } from '@material-ui/core/test-utils';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Surface from './Surface';

configure({ adapter: new Adapter() });

describe('<Surface /> - display a card with media, content and actions', () => {

  let mount;
  let wrapper;
  const image = 'MySuperImage';
  const mockFn = jest.fn();
  beforeEach(() => {
    mount = createMount();
    wrapper = mount(<Surface image={image} onClick={mockFn} />);
  });
  afterEach(() => { mount.cleanUp(); });

  it('should render correctly', () => {
    expect(wrapper.contains(Button)).toEqual(true);
    expect(wrapper.contains(Card)).toEqual(true);
    expect(wrapper.contains(CardActionArea)).toEqual(true);
    expect(wrapper.contains(CardMedia)).toEqual(true);
    expect(wrapper.contains(CardActions)).toEqual(true);
    expect(wrapper.contains(CardContent)).toEqual(true);
  });

  it('should execute onClick event', () => {
    const button = wrapper.find(Button);
    button.simulate('click');
    expect(mockFn).toHaveBeenCalled();
  });

  it('should define props correctly', () => {
    const props = wrapper.props();
    expect(props.image).toEqual(image);
    expect(props.title).toEqual('');
    expect(props.content).toEqual('');
    expect(props.height).toEqual(280);
    expect(props.onClick).toEqual(mockFn);
  });

});
