// import middleware from '../middlewares/middleware';
import postSignup from '../routes/user/postSignup';
import getLogin from '../routes/user/getLogin';

class Router {
  constructor(app) {
    this.app = app;
    this.routes = {
      // '': [middleware],
      '/user': [
        postSignup,
        getLogin,
      ],
    };
  }

  setAllRoutes() {
    Object.keys(this.routes).forEach((route) => {
      this.routes[route].forEach((element) => {
        if (route === '') this.app.use(element);
        else this.app.use(route, element);
      });
    });
  }
}

export default Router;
