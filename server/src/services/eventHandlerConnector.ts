import logger, { Level } from "./errorBoundary.service";

export function eventHandlerConnector({ handlers, socket, context }) {
  handlers.forEach(([event, handler]) => {
    socket.on(event, (...args) => {
      try {
        handler.apply(context, args);
      } catch (e) {
        logger.log({
          message: `Error in ${event}`,
          payload: e,
          logLevel: Level.error,
        });
        return;
      }
      logger.log({ message: event, payload: args });
    });
  });
}
