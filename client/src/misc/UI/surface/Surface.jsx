import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const card = props => (
  <Card>
    <CardActionArea>
      <CardMedia
        style={{ height: props.height }}
        image={props.image}
        title={props.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">{props.title}</Typography>
        <Typography variant="body2" color="textSecondary" component="p" style={{ textAlign: 'justify' }}>{props.content}</Typography>
      </CardContent>
    </CardActionArea>
    <CardActions>
      <Button onClick={props.onClick}>Learn More</Button>
    </CardActions>
  </Card>
);

card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  onClick: PropTypes.func,
  height: PropTypes.number,
};

card.defaultProps = {
  title: '',
  content: '',
  height: 280,
  onClick: () => {},
};

export default card;
