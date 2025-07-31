const controllerMap = new Map<string, AbortController>();

export const abortControllers = {
  create: (key: string) => {
    controllerMap.get(key)?.abort();
    const controller = new AbortController();
    controllerMap.set(key, controller);
    return controller;
  },
  abortAll: () => {
    controllerMap.forEach(c => c.abort());
    controllerMap.clear();
  },
};
