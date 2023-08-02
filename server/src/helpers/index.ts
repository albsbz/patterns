import logger from '../services/errorBoundary.service';
// PATTERN: Proxy
const ProxifyClassWithLogger = (className) => {
  return new Proxy(className, {
    get(target, prop) {
      return new Proxy(target[prop], {
        apply(methodTarget, thisArg, args) {
          logger.log({
            message: `Method called: ${String(prop)}`,
            payload: args,
          });
          return methodTarget.apply(thisArg, args);
        },
      });
    },
  });
};

export default ProxifyClassWithLogger;
