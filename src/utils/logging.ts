type Level = "assert" | "debug" | "trace" | "log" | "info" | "warn" | "error";
const levelValue = (lvl: Level) => {
  return ["assert", "trace", "debug", "log", "info", "warn", "error"].indexOf(lvl);
};
type Logger = {
  level: Level;
  log: (message?: any) => void;
  info: (message?: any) => void;
  debug: (message?: any) => void;
  trace: (message?: any) => void;
  warn: (message?: any) => void;
  error: (message?: any) => void;
  assert: (condition?: boolean) => void;
};

function format(level: string, message?: any) {
  return `${level.toUpperCase()}: ${message}`;
}

function checkAndCall(this: Logger, level: Level, callback: () => void) {
  if (levelValue(this.level) <= levelValue(level)) {
    callback();
  }
}

const logLevel = process.env.REACT_APP_LOG_LEVEL as Level | undefined;

export const logger: Logger = {
  level: logLevel || "log",

  log: function (message?: any) {
    checkAndCall.bind(this)("log", () => console.log(format("log", message)));
  },
  info: function (message?: any) {
    checkAndCall.bind(this)("info", () => console.info(format("info", message)));
  },
  debug: function (message?: any) {
    checkAndCall.bind(this)("debug", () => console.debug(format("debug", message)));
  },
  trace: function (message?: any) {
    checkAndCall.bind(this)("trace", () => console.trace(format("trace", message)));
  },
  warn: function (message?: any) {
    checkAndCall.bind(this)("warn", () => console.warn(format("warn", message)));
  },
  error: function (message?: any) {
    checkAndCall.bind(this)("error", () => console.error(format("error", message)));
  },
  assert: function (condition?: boolean) {
    checkAndCall.bind(this)("assert", () => console.assert(condition));
  },
};
