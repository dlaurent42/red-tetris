import React from 'react';
import './Footer.scss';

const footer = () => (
  <footer className="footer">
    <ul>
      <li>{`© Copyright ${new Date().getFullYear()}`}</li>
      <li>
        Created By&nbsp;
        <a href="https://github.com/dlaurent42">dlaurent</a>
        &nbsp;and&nbsp;
        <a href="https://github.com/devadomas">adomas</a>
      </li>
      <li>Inspired By You</li>
      <li>No Rights Reserved</li>
    </ul>
  </footer>
);

export default footer;
