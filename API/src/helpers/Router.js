// import middleware from '../middlewares/middleware';
import getById from '../routes/user/get';
import updateById from '../routes/user/put';
import getLogin from '../routes/user/getLogin';
import deleteUser from '../routes/user/delete';
import postSignup from '../routes/user/postSignup';

class Router {
  constructor(app) {
    this.app = app;
    this.routes = {
      // '': [middleware],
      '/user': [
        postSignup,
        getLogin,
        getById,
        updateById,
        deleteUser,
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
