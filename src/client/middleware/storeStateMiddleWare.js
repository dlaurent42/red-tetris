export const storeStateMiddleWare = ({ getState }) => (
  (next) => (action) => {
    const returnValue = next(action)
    window.top.state = getState()
    return returnValue
  }
);
