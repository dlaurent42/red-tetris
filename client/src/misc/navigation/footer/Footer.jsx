import React from 'react';
import './Footer.scss';

const footer = () => (
  <footer className="footer">
    <div>{`© Copyright ${new Date().getFullYear()}`}</div>
  </footer>
);

export default footer;
