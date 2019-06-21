import nodemailer from 'nodemailer';

import { LINKS, MAIL } from '../config/config';

class Mail {
  constructor() {
    this.user = MAIL.USER;
    this.pass = MAIL.PASS;
    this.admin = MAIL.ADMIN;
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });
  }

  send(options) {
    this.transporter.sendMail(options, err => process.stderr.write(err));
  }

  register(user) {
    const options = {
      from: this.user,
      to: user.email,
      subject: 'Welcome to Red-Tetris',
      text: `We glad you registered player ${user.username}. Let the fights begin!`,
    };
    return this.send(options);
  }

  recoveryToken(email, token) {
    const options = {
      from: this.user,
      to: email,
      subject: 'Red-Tetris password recovery',
      text: `Your password recovery link: ${LINKS.WEBSITE}/user/recover-password?token=${token}`,
    };
    return this.send(options);
  }
}

export default Mail;
