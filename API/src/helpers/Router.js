class Router {
  constructor(app) {
    this.app = app
    this.routes = {
      '': [middleware],
      '/user': [
        
      ],
    }
  }

  setAllRoutes() {
    Object.keys(this.routes).forEach((route) => {
      this.routes[route].forEach((element) => {
        if (route === '') this.app.use(element)
        else this.app.use(route, element)
      })
    })
  }
}

export default Router;
