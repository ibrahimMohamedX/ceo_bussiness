
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "4.1.6";globalThis.nextVersion = "16.3.0";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/@opennextjs/aws/node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/@opennextjs/aws/node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream as ReadableStream2 } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream2({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream2({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream2({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          const cur = responseHeaders[key];
          if (cur === void 0) {
            responseHeaders[key] = value;
          } else if (Array.isArray(cur)) {
            cur.push(value);
          } else {
            responseHeaders[key] = [cur, value];
          }
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0_kjzx3.js
var require_node_modules_next_dist_esm_build_templates_edge_wrapper_0_kjzx3 = __commonJS({
  ".next/server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0_kjzx3.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0_kjzx3.js", 35825, (e, t, l) => {
      self._ENTRIES ||= {};
      let n = Promise.resolve().then(() => e.i(58217));
      n.catch(() => {
      }), self._ENTRIES.middleware_middleware = new Proxy(n, { get(e2, t2) {
        if ("then" === t2) return (t3, l3) => e2.then(t3, l3);
        let l2 = (...l3) => e2.then((e3) => (0, e3[t2])(...l3));
        return l2.then = (l3, n2) => e2.then((e3) => e3[t2]).then(l3, n2), l2;
      } });
    }]);
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/edge/chunks/[root-of-the-server]__1hepuqv._.js
var require_root_of_the_server_1hepuqv = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__1hepuqv._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__1hepuqv._.js", 74398, (e, t, r) => {
    }, 28042, (e, t, r) => {
      "use strict";
      var n = Object.defineProperty, i = Object.getOwnPropertyDescriptor, a = Object.getOwnPropertyNames, s = Object.prototype.hasOwnProperty, o = {}, l = { RequestCookies: () => _, ResponseCookies: () => g, parseCookie: () => c, parseSetCookie: () => h, stringifyCookie: () => u };
      for (var d in l) n(o, d, { get: l[d], enumerable: true });
      function u(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function c(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, i2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != i2 ? i2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function h(e2) {
        if (!e2) return;
        let [[t2, r2], ...n2] = c(e2), { domain: i2, expires: a2, httponly: s2, maxage: o2, path: l2, samesite: d2, secure: u2, partitioned: h2, priority: _2 } = Object.fromEntries(n2.map(([e3, t3]) => [e3.toLowerCase().replace(/-/g, ""), t3]));
        {
          var g2, m, y = { name: t2, value: decodeURIComponent(r2), domain: i2, ...a2 && { expires: new Date(a2) }, ...s2 && { httpOnly: true }, ..."string" == typeof o2 && { maxAge: Number(o2) }, path: l2, ...d2 && { sameSite: f.includes(g2 = (g2 = d2).toLowerCase()) ? g2 : void 0 }, ...u2 && { secure: true }, ..._2 && { priority: p.includes(m = (m = _2).toLowerCase()) ? m : void 0 }, ...h2 && { partitioned: true } };
          let e3 = {};
          for (let t3 in y) y[t3] && (e3[t3] = y[t3]);
          return e3;
        }
      }
      t.exports = ((e2, t2, r2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let o2 of a(t2)) s.call(e2, o2) || void 0 === o2 || n(e2, o2, { get: () => t2[o2], enumerable: !(r2 = i(t2, o2)) || r2.enumerable });
        return e2;
      })(n({}, "__esModule", { value: true }), o);
      var f = ["strict", "lax", "none"], p = ["low", "medium", "high"], _ = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const t2 = e2.get("cookie");
          if (t2) for (const [e3, r2] of c(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => u(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => u(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, g = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const i2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (const e3 of Array.isArray(i2) ? i2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, i3, a2, s2 = [], o2 = 0;
            function l2() {
              for (; o2 < e4.length && /\s/.test(e4.charAt(o2)); ) o2 += 1;
              return o2 < e4.length;
            }
            for (; o2 < e4.length; ) {
              for (t3 = o2, a2 = false; l2(); ) if ("," === (r3 = e4.charAt(o2))) {
                for (n3 = o2, o2 += 1, l2(), i3 = o2; o2 < e4.length && "=" !== (r3 = e4.charAt(o2)) && ";" !== r3 && "," !== r3; ) o2 += 1;
                o2 < e4.length && "=" === e4.charAt(o2) ? (a2 = true, o2 = i3, s2.push(e4.substring(t3, n3)), t3 = o2) : o2 = n3 + 1;
              } else o2 += 1;
              (!a2 || o2 >= e4.length) && s2.push(e4.substring(t3, e4.length));
            }
            return s2;
          }(i2)) {
            const t3 = h(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, i2 = this._parsed;
          return i2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = u(r3);
              t3.append("set-cookie", e4);
            }
          }(i2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0]];
          return this.set({ ...r2, name: t2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(u).join("; ");
        }
      };
    }, 11646, (e) => {
      "use strict";
      var t, r, n, i, a, s, o, l, d, u, c, h;
      function f(e2) {
        return Symbol.for(e2);
      }
      let p = new class e2 {
        constructor(t2) {
          const r2 = this;
          r2._currentContext = t2 ? new Map(t2) : /* @__PURE__ */ new Map(), r2.getValue = (e3) => r2._currentContext.get(e3), r2.setValue = (t3, n2) => {
            let i2 = new e2(r2._currentContext);
            return i2._currentContext.set(t3, n2), i2;
          }, r2.deleteValue = (t3) => {
            let n2 = new e2(r2._currentContext);
            return n2._currentContext.delete(t3), n2;
          };
        }
      }(), _ = "1.9.1", g = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/, m = function(e2) {
        let t2 = /* @__PURE__ */ new Set([e2]), r2 = /* @__PURE__ */ new Set(), n2 = e2.match(g);
        if (!n2) return () => false;
        let i2 = { major: +n2[1], minor: +n2[2], patch: +n2[3], prerelease: n2[4] };
        if (null != i2.prerelease) return function(t3) {
          return t3 === e2;
        };
        function a2(e3) {
          return r2.add(e3), false;
        }
        return function(e3) {
          if (t2.has(e3)) return true;
          if (r2.has(e3)) return false;
          let n3 = e3.match(g);
          if (!n3) return a2(e3);
          let s2 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
          if (null != s2.prerelease || i2.major !== s2.major) return a2(e3);
          if (0 === i2.major) return i2.minor === s2.minor && i2.patch <= s2.patch ? (t2.add(e3), true) : a2(e3);
          return i2.minor <= s2.minor ? (t2.add(e3), true) : a2(e3);
        };
      }(_), y = _.split(".")[0], w = Symbol.for(`opentelemetry.js.api.${y}`), v = "object" == typeof globalThis ? globalThis : "object" == typeof self ? self : e.g;
      function b(e2, t2, r2, n2 = false) {
        var i2;
        let a2 = v[w] = null != (i2 = v[w]) ? i2 : { version: _ };
        if (!n2 && a2[e2]) {
          let t3 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e2}`);
          return r2.error(t3.stack || t3.message), false;
        }
        if (a2.version !== _) {
          let t3 = Error(`@opentelemetry/api: Registration of version v${a2.version} for ${e2} does not match previously registered API v${_}`);
          return r2.error(t3.stack || t3.message), false;
        }
        return a2[e2] = t2, r2.debug(`@opentelemetry/api: Registered a global for ${e2} v${_}.`), true;
      }
      function x(e2) {
        var t2, r2;
        let n2 = null == (t2 = v[w]) ? void 0 : t2.version;
        if (n2 && m(n2)) return null == (r2 = v[w]) ? void 0 : r2[e2];
      }
      function E(e2, t2) {
        t2.debug(`@opentelemetry/api: Unregistering a global for ${e2} v${_}.`);
        let r2 = v[w];
        r2 && delete r2[e2];
      }
      class C {
        constructor(e2) {
          this._namespace = e2.namespace || "DiagComponentLogger";
        }
        debug(...e2) {
          return S("debug", this._namespace, e2);
        }
        error(...e2) {
          return S("error", this._namespace, e2);
        }
        info(...e2) {
          return S("info", this._namespace, e2);
        }
        warn(...e2) {
          return S("warn", this._namespace, e2);
        }
        verbose(...e2) {
          return S("verbose", this._namespace, e2);
        }
      }
      function S(e2, t2, r2) {
        let n2 = x("diag");
        if (n2) return n2[e2](t2, ...r2);
      }
      (o = t || (t = {}))[o.NONE = 0] = "NONE", o[o.ERROR = 30] = "ERROR", o[o.WARN = 50] = "WARN", o[o.INFO = 60] = "INFO", o[o.DEBUG = 70] = "DEBUG", o[o.VERBOSE = 80] = "VERBOSE", o[o.ALL = 9999] = "ALL";
      class R {
        static instance() {
          return this._instance || (this._instance = new R()), this._instance;
        }
        constructor() {
          function e2(e3) {
            return function(...t2) {
              let r3 = x("diag");
              if (r3) return r3[e3](...t2);
            };
          }
          const r2 = this;
          r2.setLogger = (e3, n2 = { logLevel: t.INFO }) => {
            var i2, a2, s2;
            if (e3 === r2) {
              let e4 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
              return r2.error(null != (i2 = e4.stack) ? i2 : e4.message), false;
            }
            "number" == typeof n2 && (n2 = { logLevel: n2 });
            let o2 = x("diag"), l2 = function(e4, r3) {
              function n3(t2, n4) {
                let i3 = r3[t2];
                return "function" == typeof i3 && e4 >= n4 ? i3.bind(r3) : function() {
                };
              }
              return e4 < t.NONE ? e4 = t.NONE : e4 > t.ALL && (e4 = t.ALL), r3 = r3 || {}, { error: n3("error", t.ERROR), warn: n3("warn", t.WARN), info: n3("info", t.INFO), debug: n3("debug", t.DEBUG), verbose: n3("verbose", t.VERBOSE) };
            }(null != (a2 = n2.logLevel) ? a2 : t.INFO, e3);
            if (o2 && !n2.suppressOverrideMessage) {
              let e4 = null != (s2 = Error().stack) ? s2 : "<failed to generate stacktrace>";
              o2.warn(`Current logger will be overwritten from ${e4}`), l2.warn(`Current logger will overwrite one already registered from ${e4}`);
            }
            return b("diag", l2, r2, true);
          }, r2.disable = () => {
            E("diag", r2);
          }, r2.createComponentLogger = (e3) => new C(e3), r2.verbose = e2("verbose"), r2.debug = e2("debug"), r2.info = e2("info"), r2.warn = e2("warn"), r2.error = e2("error");
        }
      }
      let T = "context", O = new class {
        active() {
          return p;
        }
        with(e2, t2, r2, ...n2) {
          return t2.call(r2, ...n2);
        }
        bind(e2, t2) {
          return t2;
        }
        enable() {
          return this;
        }
        disable() {
          return this;
        }
      }();
      class P {
        static getInstance() {
          return this._instance || (this._instance = new P()), this._instance;
        }
        setGlobalContextManager(e2) {
          return b(T, e2, R.instance());
        }
        active() {
          return this._getContextManager().active();
        }
        with(e2, t2, r2, ...n2) {
          return this._getContextManager().with(e2, t2, r2, ...n2);
        }
        bind(e2, t2) {
          return this._getContextManager().bind(e2, t2);
        }
        _getContextManager() {
          return x(T) || O;
        }
        disable() {
          this._getContextManager().disable(), E(T, R.instance());
        }
      }
      let A = P.getInstance(), k = R.instance();
      class N {
      }
      class L {
        addCallback(e2) {
        }
        removeCallback(e2) {
        }
      }
      let M = new class {
        createGauge(e2, t2) {
          return q;
        }
        createHistogram(e2, t2) {
          return D;
        }
        createCounter(e2, t2) {
          return I;
        }
        createUpDownCounter(e2, t2) {
          return j;
        }
        createObservableGauge(e2, t2) {
          return B;
        }
        createObservableCounter(e2, t2) {
          return U;
        }
        createObservableUpDownCounter(e2, t2) {
          return G;
        }
        addBatchObservableCallback(e2, t2) {
        }
        removeBatchObservableCallback(e2) {
        }
      }(), I = new class extends N {
        add(e2, t2) {
        }
      }(), q = new class extends N {
        record(e2, t2) {
        }
      }(), D = new class extends N {
        record(e2, t2) {
        }
      }(), j = new class extends N {
        add(e2, t2) {
        }
      }(), U = new class extends L {
      }(), B = new class extends L {
      }(), G = new class extends L {
      }(), H = new class {
        getMeter(e2, t2, r2) {
          return M;
        }
      }(), $ = "metrics", F = class e2 {
        static getInstance() {
          return this._instance || (this._instance = new e2()), this._instance;
        }
        setGlobalMeterProvider(e3) {
          return b($, e3, R.instance());
        }
        getMeterProvider() {
          return x($) || H;
        }
        getMeter(e3, t2, r2) {
          return this.getMeterProvider().getMeter(e3, t2, r2);
        }
        disable() {
          E($, R.instance());
        }
      }.getInstance(), z = { get(e2, t2) {
        if (null != e2) return e2[t2];
      }, keys: (e2) => null == e2 ? [] : Object.keys(e2) }, V = { set(e2, t2, r2) {
        null != e2 && (e2[t2] = r2);
      } }, K = f("OpenTelemetry Baggage Key");
      function W(e2) {
        return e2.getValue(K) || void 0;
      }
      function X() {
        return W(P.getInstance().active());
      }
      function Z(e2, t2) {
        return e2.setValue(K, t2);
      }
      function J(e2) {
        return e2.deleteValue(K);
      }
      class Y {
        constructor(e2) {
          this._entries = e2 ? new Map(e2) : /* @__PURE__ */ new Map();
        }
        getEntry(e2) {
          let t2 = this._entries.get(e2);
          if (t2) return Object.assign({}, t2);
        }
        getAllEntries() {
          return Array.from(this._entries.entries());
        }
        setEntry(e2, t2) {
          let r2 = new Y(this._entries);
          return r2._entries.set(e2, t2), r2;
        }
        removeEntry(e2) {
          let t2 = new Y(this._entries);
          return t2._entries.delete(e2), t2;
        }
        removeEntries(...e2) {
          let t2 = new Y(this._entries);
          for (let r2 of e2) t2._entries.delete(r2);
          return t2;
        }
        clear() {
          return new Y();
        }
      }
      let Q = Symbol("BaggageEntryMetadata"), ee = R.instance();
      function et(e2 = {}) {
        return new Y(new Map(Object.entries(e2)));
      }
      let er = "propagation", en = new class {
        inject(e2, t2) {
        }
        extract(e2, t2) {
          return e2;
        }
        fields() {
          return [];
        }
      }(), ei = class e2 {
        constructor() {
          this.createBaggage = et, this.getBaggage = W, this.getActiveBaggage = X, this.setBaggage = Z, this.deleteBaggage = J;
        }
        static getInstance() {
          return this._instance || (this._instance = new e2()), this._instance;
        }
        setGlobalPropagator(e3) {
          return b(er, e3, R.instance());
        }
        inject(e3, t2, r2 = V) {
          return this._getGlobalPropagator().inject(e3, t2, r2);
        }
        extract(e3, t2, r2 = z) {
          return this._getGlobalPropagator().extract(e3, t2, r2);
        }
        fields() {
          return this._getGlobalPropagator().fields();
        }
        disable() {
          E(er, R.instance());
        }
        _getGlobalPropagator() {
          return x(er) || en;
        }
      }.getInstance();
      (l = r || (r = {}))[l.NONE = 0] = "NONE", l[l.SAMPLED = 1] = "SAMPLED";
      let ea = "0000000000000000", es = "00000000000000000000000000000000", eo = { traceId: es, spanId: ea, traceFlags: r.NONE };
      class el {
        constructor(e2 = eo) {
          this._spanContext = e2;
        }
        spanContext() {
          return this._spanContext;
        }
        setAttribute(e2, t2) {
          return this;
        }
        setAttributes(e2) {
          return this;
        }
        addEvent(e2, t2) {
          return this;
        }
        addLink(e2) {
          return this;
        }
        addLinks(e2) {
          return this;
        }
        setStatus(e2) {
          return this;
        }
        updateName(e2) {
          return this;
        }
        end(e2) {
        }
        isRecording() {
          return false;
        }
        recordException(e2, t2) {
        }
      }
      let ed = f("OpenTelemetry Context Key SPAN");
      function eu(e2) {
        return e2.getValue(ed) || void 0;
      }
      function ec() {
        return eu(P.getInstance().active());
      }
      function eh(e2, t2) {
        return e2.setValue(ed, t2);
      }
      function ef(e2) {
        return e2.deleteValue(ed);
      }
      function ep(e2, t2) {
        return eh(e2, new el(t2));
      }
      function e_(e2) {
        var t2;
        return null == (t2 = eu(e2)) ? void 0 : t2.spanContext();
      }
      let eg = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]);
      function em(e2, t2) {
        if ("string" != typeof e2 || e2.length !== t2) return false;
        let r2 = 0;
        for (let t3 = 0; t3 < e2.length; t3 += 4) r2 += (0 | eg[e2.charCodeAt(t3)]) + (0 | eg[e2.charCodeAt(t3 + 1)]) + (0 | eg[e2.charCodeAt(t3 + 2)]) + (0 | eg[e2.charCodeAt(t3 + 3)]);
        return r2 === t2;
      }
      function ey(e2) {
        return em(e2, 32) && e2 !== es;
      }
      function ew(e2) {
        return em(e2, 16) && e2 !== ea;
      }
      function ev(e2) {
        return ey(e2.traceId) && ew(e2.spanId);
      }
      function eb(e2) {
        return new el(e2);
      }
      let ex = P.getInstance();
      class eE {
        startSpan(e2, t2, r2 = ex.active()) {
          var n2;
          if (null == t2 ? void 0 : t2.root) return new el();
          let i2 = r2 && e_(r2);
          return null !== (n2 = i2) && "object" == typeof n2 && "spanId" in n2 && "string" == typeof n2.spanId && "traceId" in n2 && "string" == typeof n2.traceId && "traceFlags" in n2 && "number" == typeof n2.traceFlags && ev(i2) ? new el(i2) : new el();
        }
        startActiveSpan(e2, t2, r2, n2) {
          let i2, a2, s2;
          if (arguments.length < 2) return;
          2 == arguments.length ? s2 = t2 : 3 == arguments.length ? (i2 = t2, s2 = r2) : (i2 = t2, a2 = r2, s2 = n2);
          let o2 = null != a2 ? a2 : ex.active(), l2 = this.startSpan(e2, i2, o2), d2 = eh(o2, l2);
          return ex.with(d2, s2, void 0, l2);
        }
      }
      let eC = new eE();
      class eS {
        constructor(e2, t2, r2, n2) {
          this._provider = e2, this.name = t2, this.version = r2, this.options = n2;
        }
        startSpan(e2, t2, r2) {
          return this._getTracer().startSpan(e2, t2, r2);
        }
        startActiveSpan(e2, t2, r2, n2) {
          let i2 = this._getTracer();
          return Reflect.apply(i2.startActiveSpan, i2, arguments);
        }
        _getTracer() {
          if (this._delegate) return this._delegate;
          let e2 = this._provider.getDelegateTracer(this.name, this.version, this.options);
          return e2 ? (this._delegate = e2, this._delegate) : eC;
        }
      }
      let eR = new class {
        getTracer(e2, t2, r2) {
          return new eE();
        }
      }();
      class eT {
        getTracer(e2, t2, r2) {
          var n2;
          return null != (n2 = this.getDelegateTracer(e2, t2, r2)) ? n2 : new eS(this, e2, t2, r2);
        }
        getDelegate() {
          var e2;
          return null != (e2 = this._delegate) ? e2 : eR;
        }
        setDelegate(e2) {
          this._delegate = e2;
        }
        getDelegateTracer(e2, t2, r2) {
          var n2;
          return null == (n2 = this._delegate) ? void 0 : n2.getTracer(e2, t2, r2);
        }
      }
      let eO = "trace", eP = class e2 {
        constructor() {
          this._proxyTracerProvider = new eT(), this.wrapSpanContext = eb, this.isSpanContextValid = ev, this.deleteSpan = ef, this.getSpan = eu, this.getActiveSpan = ec, this.getSpanContext = e_, this.setSpan = eh, this.setSpanContext = ep;
        }
        static getInstance() {
          return this._instance || (this._instance = new e2()), this._instance;
        }
        setGlobalTracerProvider(e3) {
          let t2 = b(eO, this._proxyTracerProvider, R.instance());
          return t2 && this._proxyTracerProvider.setDelegate(e3), t2;
        }
        getTracerProvider() {
          return x(eO) || this._proxyTracerProvider;
        }
        getTracer(e3, t2) {
          return this.getTracerProvider().getTracer(e3, t2);
        }
        disable() {
          E(eO, R.instance()), this._proxyTracerProvider = new eT();
        }
      }.getInstance(), eA = { context: A, diag: k, metrics: F, propagation: ei, trace: eP };
      e.s(["default", 0, eA], 47071), e.i(47071);
      let ek = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }], eN = {};
      if ("u" > typeof console) for (let e2 of ["error", "warn", "info", "debug", "trace", "log"]) "function" == typeof console[e2] && (eN[e2] = console[e2]);
      (d = n || (n = {}))[d.INT = 0] = "INT", d[d.DOUBLE = 1] = "DOUBLE", (u = i || (i = {}))[u.NOT_RECORD = 0] = "NOT_RECORD", u[u.RECORD = 1] = "RECORD", u[u.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED", (c = a || (a = {}))[c.INTERNAL = 0] = "INTERNAL", c[c.SERVER = 1] = "SERVER", c[c.CLIENT = 2] = "CLIENT", c[c.PRODUCER = 3] = "PRODUCER", c[c.CONSUMER = 4] = "CONSUMER", (h = s || (s = {}))[h.UNSET = 0] = "UNSET", h[h.OK = 1] = "OK", h[h.ERROR = 2] = "ERROR";
      let eL = "[_0-9a-z-*/]", eM = `[a-z]${eL}{0,255}`, eI = `[a-z0-9]${eL}{0,240}@[a-z]${eL}{0,13}`, eq = RegExp(`^(?:${eM}|${eI})$`), eD = /^[ -~]{0,255}[!-~]$/, ej = /,|=/;
      class eU {
        constructor(e2) {
          this._internalState = /* @__PURE__ */ new Map(), e2 && this._parse(e2);
        }
        set(e2, t2) {
          let r2 = this._clone();
          return r2._internalState.has(e2) && r2._internalState.delete(e2), r2._internalState.set(e2, t2), r2;
        }
        unset(e2) {
          let t2 = this._clone();
          return t2._internalState.delete(e2), t2;
        }
        get(e2) {
          return this._internalState.get(e2);
        }
        serialize() {
          return Array.from(this._internalState.keys()).reduceRight((e2, t2) => (e2.push(t2 + "=" + this.get(t2)), e2), []).join(",");
        }
        _parse(e2) {
          !(e2.length > 512) && (this._internalState = e2.split(",").reduceRight((e3, t2) => {
            let r2 = t2.trim(), n2 = r2.indexOf("=");
            if (-1 !== n2) {
              let i2 = r2.slice(0, n2), a2 = r2.slice(n2 + 1, t2.length);
              eq.test(i2) && eD.test(a2) && !ej.test(a2) && e3.set(i2, a2);
            }
            return e3;
          }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
        }
        _keys() {
          return Array.from(this._internalState.keys()).reverse();
        }
        _clone() {
          let e2 = new eU();
          return e2._internalState = new Map(this._internalState), e2;
        }
      }
      e.s(["DiagConsoleLogger", 0, class {
        constructor() {
          for (let e2 = 0; e2 < ek.length; e2++) this[ek[e2].n] = /* @__PURE__ */ function(e3) {
            return function(...t2) {
              let r2 = eN[e3];
              if ("function" != typeof r2 && (r2 = eN.log), "function" != typeof r2 && console && "function" != typeof (r2 = console[e3]) && (r2 = console.log), "function" == typeof r2) return r2.apply(console, t2);
            };
          }(ek[e2].c);
        }
      }, "DiagLogLevel", 0, t, "INVALID_SPANID", 0, ea, "INVALID_SPAN_CONTEXT", 0, eo, "INVALID_TRACEID", 0, es, "ProxyTracer", 0, eS, "ProxyTracerProvider", 0, eT, "ROOT_CONTEXT", 0, p, "SamplingDecision", 0, i, "SpanKind", 0, a, "SpanStatusCode", 0, s, "TraceFlags", 0, r, "ValueType", 0, n, "baggageEntryMetadataFromString", 0, function(e2) {
        return "string" != typeof e2 && (ee.error(`Cannot create baggage metadata from unknown type: ${typeof e2}`), e2 = ""), { __TYPE__: Q, toString: () => e2 };
      }, "context", 0, A, "createContextKey", 0, f, "createNoopMeter", 0, function() {
        return M;
      }, "createTraceState", 0, function(e2) {
        return new eU(e2);
      }, "default", 0, eA, "defaultTextMapGetter", 0, z, "defaultTextMapSetter", 0, V, "diag", 0, k, "isSpanContextValid", 0, ev, "isValidSpanId", 0, ew, "isValidTraceId", 0, ey, "metrics", 0, F, "propagation", 0, ei, "trace", 0, eP], 11646);
    }, 71498, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/cookie/");
        var e2, r2, n, i, a = {};
        a.parse = function(t2, r3) {
          if ("string" != typeof t2) throw TypeError("argument str must be a string");
          for (var i2 = {}, a2 = t2.split(n), s = (r3 || {}).decode || e2, o = 0; o < a2.length; o++) {
            var l = a2[o], d = l.indexOf("=");
            if (!(d < 0)) {
              var u = l.substr(0, d).trim(), c = l.substr(++d, l.length).trim();
              '"' == c[0] && (c = c.slice(1, -1)), void 0 == i2[u] && (i2[u] = function(e3, t3) {
                try {
                  return t3(e3);
                } catch (t4) {
                  return e3;
                }
              }(c, s));
            }
          }
          return i2;
        }, a.serialize = function(e3, t2, n2) {
          var a2 = n2 || {}, s = a2.encode || r2;
          if ("function" != typeof s) throw TypeError("option encode is invalid");
          if (!i.test(e3)) throw TypeError("argument name is invalid");
          var o = s(t2);
          if (o && !i.test(o)) throw TypeError("argument val is invalid");
          var l = e3 + "=" + o;
          if (null != a2.maxAge) {
            var d = a2.maxAge - 0;
            if (isNaN(d) || !isFinite(d)) throw TypeError("option maxAge is invalid");
            l += "; Max-Age=" + Math.floor(d);
          }
          if (a2.domain) {
            if (!i.test(a2.domain)) throw TypeError("option domain is invalid");
            l += "; Domain=" + a2.domain;
          }
          if (a2.path) {
            if (!i.test(a2.path)) throw TypeError("option path is invalid");
            l += "; Path=" + a2.path;
          }
          if (a2.expires) {
            if ("function" != typeof a2.expires.toUTCString) throw TypeError("option expires is invalid");
            l += "; Expires=" + a2.expires.toUTCString();
          }
          if (a2.httpOnly && (l += "; HttpOnly"), a2.secure && (l += "; Secure"), a2.sameSite) switch ("string" == typeof a2.sameSite ? a2.sameSite.toLowerCase() : a2.sameSite) {
            case true:
            case "strict":
              l += "; SameSite=Strict";
              break;
            case "lax":
              l += "; SameSite=Lax";
              break;
            case "none":
              l += "; SameSite=None";
              break;
            default:
              throw TypeError("option sameSite is invalid");
          }
          return l;
        }, e2 = decodeURIComponent, r2 = encodeURIComponent, n = /; */, i = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, t.exports = a;
      })();
    }, 99734, (e, t, r) => {
      (() => {
        "use strict";
        let e2, r2, n, i, a;
        var s = { 234: (e3) => {
          var t2 = Object.prototype.hasOwnProperty, r3 = "~";
          function n2() {
          }
          function i2(e4, t3, r4) {
            this.fn = e4, this.context = t3, this.once = r4 || false;
          }
          function a2(e4, t3, n3, a3, s3) {
            if ("function" != typeof n3) throw TypeError("The listener must be a function");
            var o3 = new i2(n3, a3 || e4, s3), l2 = r3 ? r3 + t3 : t3;
            return e4._events[l2] ? e4._events[l2].fn ? e4._events[l2] = [e4._events[l2], o3] : e4._events[l2].push(o3) : (e4._events[l2] = o3, e4._eventsCount++), e4;
          }
          function s2(e4, t3) {
            0 == --e4._eventsCount ? e4._events = new n2() : delete e4._events[t3];
          }
          function o2() {
            this._events = new n2(), this._eventsCount = 0;
          }
          Object.create && (n2.prototype = /* @__PURE__ */ Object.create(null), new n2().__proto__ || (r3 = false)), o2.prototype.eventNames = function() {
            var e4, n3, i3 = [];
            if (0 === this._eventsCount) return i3;
            for (n3 in e4 = this._events) t2.call(e4, n3) && i3.push(r3 ? n3.slice(1) : n3);
            return Object.getOwnPropertySymbols ? i3.concat(Object.getOwnPropertySymbols(e4)) : i3;
          }, o2.prototype.listeners = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            if (!n3) return [];
            if (n3.fn) return [n3.fn];
            for (var i3 = 0, a3 = n3.length, s3 = Array(a3); i3 < a3; i3++) s3[i3] = n3[i3].fn;
            return s3;
          }, o2.prototype.listenerCount = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            return n3 ? n3.fn ? 1 : n3.length : 0;
          }, o2.prototype.emit = function(e4, t3, n3, i3, a3, s3) {
            var o3 = r3 ? r3 + e4 : e4;
            if (!this._events[o3]) return false;
            var l2, d2, u = this._events[o3], c = arguments.length;
            if (u.fn) {
              switch (u.once && this.removeListener(e4, u.fn, void 0, true), c) {
                case 1:
                  return u.fn.call(u.context), true;
                case 2:
                  return u.fn.call(u.context, t3), true;
                case 3:
                  return u.fn.call(u.context, t3, n3), true;
                case 4:
                  return u.fn.call(u.context, t3, n3, i3), true;
                case 5:
                  return u.fn.call(u.context, t3, n3, i3, a3), true;
                case 6:
                  return u.fn.call(u.context, t3, n3, i3, a3, s3), true;
              }
              for (d2 = 1, l2 = Array(c - 1); d2 < c; d2++) l2[d2 - 1] = arguments[d2];
              u.fn.apply(u.context, l2);
            } else {
              var h, f = u.length;
              for (d2 = 0; d2 < f; d2++) switch (u[d2].once && this.removeListener(e4, u[d2].fn, void 0, true), c) {
                case 1:
                  u[d2].fn.call(u[d2].context);
                  break;
                case 2:
                  u[d2].fn.call(u[d2].context, t3);
                  break;
                case 3:
                  u[d2].fn.call(u[d2].context, t3, n3);
                  break;
                case 4:
                  u[d2].fn.call(u[d2].context, t3, n3, i3);
                  break;
                default:
                  if (!l2) for (h = 1, l2 = Array(c - 1); h < c; h++) l2[h - 1] = arguments[h];
                  u[d2].fn.apply(u[d2].context, l2);
              }
            }
            return true;
          }, o2.prototype.on = function(e4, t3, r4) {
            return a2(this, e4, t3, r4, false);
          }, o2.prototype.once = function(e4, t3, r4) {
            return a2(this, e4, t3, r4, true);
          }, o2.prototype.removeListener = function(e4, t3, n3, i3) {
            var a3 = r3 ? r3 + e4 : e4;
            if (!this._events[a3]) return this;
            if (!t3) return s2(this, a3), this;
            var o3 = this._events[a3];
            if (o3.fn) o3.fn !== t3 || i3 && !o3.once || n3 && o3.context !== n3 || s2(this, a3);
            else {
              for (var l2 = 0, d2 = [], u = o3.length; l2 < u; l2++) (o3[l2].fn !== t3 || i3 && !o3[l2].once || n3 && o3[l2].context !== n3) && d2.push(o3[l2]);
              d2.length ? this._events[a3] = 1 === d2.length ? d2[0] : d2 : s2(this, a3);
            }
            return this;
          }, o2.prototype.removeAllListeners = function(e4) {
            var t3;
            return e4 ? (t3 = r3 ? r3 + e4 : e4, this._events[t3] && s2(this, t3)) : (this._events = new n2(), this._eventsCount = 0), this;
          }, o2.prototype.off = o2.prototype.removeListener, o2.prototype.addListener = o2.prototype.on, o2.prefixed = r3, o2.EventEmitter = o2, e3.exports = o2;
        }, 274: (e3) => {
          e3.exports = (e4, t2) => (t2 = t2 || (() => {
          }), e4.then((e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => e5), (e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => {
            throw e5;
          })));
        }, 294: (e3, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = function(e4, t3, r3) {
            let n2 = 0, i2 = e4.length;
            for (; i2 > 0; ) {
              let a2 = i2 / 2 | 0, s2 = n2 + a2;
              0 >= r3(e4[s2], t3) ? (n2 = ++s2, i2 -= a2 + 1) : i2 = a2;
            }
            return n2;
          };
        }, 838: (e3, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true });
          let n2 = r3(294);
          t2.default = class {
            constructor() {
              this._queue = [];
            }
            enqueue(e4, t3) {
              let r4 = { priority: (t3 = Object.assign({ priority: 0 }, t3)).priority, run: e4 };
              if (this.size && this._queue[this.size - 1].priority >= t3.priority) return void this._queue.push(r4);
              let i2 = n2.default(this._queue, r4, (e5, t4) => t4.priority - e5.priority);
              this._queue.splice(i2, 0, r4);
            }
            dequeue() {
              let e4 = this._queue.shift();
              return null == e4 ? void 0 : e4.run;
            }
            filter(e4) {
              return this._queue.filter((t3) => t3.priority === e4.priority).map((e5) => e5.run);
            }
            get size() {
              return this._queue.length;
            }
          };
        }, 138: (e3, t2, r3) => {
          let n2 = r3(274);
          class i2 extends Error {
            constructor(e4) {
              super(e4), this.name = "TimeoutError";
            }
          }
          let a2 = (e4, t3, r4) => new Promise((a3, s2) => {
            if ("number" != typeof t3 || t3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (t3 === 1 / 0) return void a3(e4);
            let o2 = setTimeout(() => {
              if ("function" == typeof r4) {
                try {
                  a3(r4());
                } catch (e5) {
                  s2(e5);
                }
                return;
              }
              let n3 = "string" == typeof r4 ? r4 : `Promise timed out after ${t3} milliseconds`, o3 = r4 instanceof Error ? r4 : new i2(n3);
              "function" == typeof e4.cancel && e4.cancel(), s2(o3);
            }, t3);
            n2(e4.then(a3, s2), () => {
              clearTimeout(o2);
            });
          });
          e3.exports = a2, e3.exports.default = a2, e3.exports.TimeoutError = i2;
        } }, o = {};
        function l(e3) {
          var t2 = o[e3];
          if (void 0 !== t2) return t2.exports;
          var r3 = o[e3] = { exports: {} }, n2 = true;
          try {
            s[e3](r3, r3.exports, l), n2 = false;
          } finally {
            n2 && delete o[e3];
          }
          return r3.exports;
        }
        l.ab = "/ROOT/node_modules/next/dist/compiled/p-queue/";
        var d = {};
        Object.defineProperty(d, "__esModule", { value: true }), e2 = l(234), r2 = l(138), n = l(838), i = () => {
        }, a = new r2.TimeoutError(), d.default = class extends e2 {
          constructor(e3) {
            var t2, r3, a2, s2;
            if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = i, this._resolveIdle = i, !("number" == typeof (e3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: n.default }, e3)).intervalCap && e3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (r3 = null == (t2 = e3.intervalCap) ? void 0 : t2.toString()) ? r3 : ""}\` (${typeof e3.intervalCap})`);
            if (void 0 === e3.interval || !(Number.isFinite(e3.interval) && e3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (s2 = null == (a2 = e3.interval) ? void 0 : a2.toString()) ? s2 : ""}\` (${typeof e3.interval})`);
            this._carryoverConcurrencyCount = e3.carryoverConcurrencyCount, this._isIntervalIgnored = e3.intervalCap === 1 / 0 || 0 === e3.interval, this._intervalCap = e3.intervalCap, this._interval = e3.interval, this._queue = new e3.queueClass(), this._queueClass = e3.queueClass, this.concurrency = e3.concurrency, this._timeout = e3.timeout, this._throwOnTimeout = true === e3.throwOnTimeout, this._isPaused = false === e3.autoStart;
          }
          get _doesIntervalAllowAnother() {
            return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
          }
          get _doesConcurrentAllowAnother() {
            return this._pendingCount < this._concurrency;
          }
          _next() {
            this._pendingCount--, this._tryToStartAnother(), this.emit("next");
          }
          _resolvePromises() {
            this._resolveEmpty(), this._resolveEmpty = i, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = i, this.emit("idle"));
          }
          _onResumeInterval() {
            this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
          }
          _isIntervalPaused() {
            let e3 = Date.now();
            if (void 0 === this._intervalId) {
              let t2 = this._intervalEnd - e3;
              if (!(t2 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                this._onResumeInterval();
              }, t2)), true;
              this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
            }
            return false;
          }
          _tryToStartAnother() {
            if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
            if (!this._isPaused) {
              let e3 = !this._isIntervalPaused();
              if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                let t2 = this._queue.dequeue();
                return !!t2 && (this.emit("active"), t2(), e3 && this._initializeIntervalIfNeeded(), true);
              }
            }
            return false;
          }
          _initializeIntervalIfNeeded() {
            this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
              this._onInterval();
            }, this._interval), this._intervalEnd = Date.now() + this._interval);
          }
          _onInterval() {
            0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
          }
          _processQueue() {
            for (; this._tryToStartAnother(); ) ;
          }
          get concurrency() {
            return this._concurrency;
          }
          set concurrency(e3) {
            if (!("number" == typeof e3 && e3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e3}\` (${typeof e3})`);
            this._concurrency = e3, this._processQueue();
          }
          async add(e3, t2 = {}) {
            return new Promise((n2, i2) => {
              let s2 = async () => {
                this._pendingCount++, this._intervalCount++;
                try {
                  let s3 = void 0 === this._timeout && void 0 === t2.timeout ? e3() : r2.default(Promise.resolve(e3()), void 0 === t2.timeout ? this._timeout : t2.timeout, () => {
                    (void 0 === t2.throwOnTimeout ? this._throwOnTimeout : t2.throwOnTimeout) && i2(a);
                  });
                  n2(await s3);
                } catch (e4) {
                  i2(e4);
                }
                this._next();
              };
              this._queue.enqueue(s2, t2), this._tryToStartAnother(), this.emit("add");
            });
          }
          async addAll(e3, t2) {
            return Promise.all(e3.map(async (e4) => this.add(e4, t2)));
          }
          start() {
            return this._isPaused && (this._isPaused = false, this._processQueue()), this;
          }
          pause() {
            this._isPaused = true;
          }
          clear() {
            this._queue = new this._queueClass();
          }
          async onEmpty() {
            if (0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveEmpty;
              this._resolveEmpty = () => {
                t2(), e3();
              };
            });
          }
          async onIdle() {
            if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveIdle;
              this._resolveIdle = () => {
                t2(), e3();
              };
            });
          }
          get size() {
            return this._queue.size;
          }
          sizeBy(e3) {
            return this._queue.filter(e3).length;
          }
          get pending() {
            return this._pendingCount;
          }
          get isPaused() {
            return this._isPaused;
          }
          get timeout() {
            return this._timeout;
          }
          set timeout(e3) {
            this._timeout = e3;
          }
        }, t.exports = d;
      })();
    }, 51615, (e, t, r) => {
      t.exports = e.x("node:buffer", () => (init_node_buffer(), __toCommonJS(node_buffer_exports)));
    }, 78500, (e, t, r) => {
      t.exports = e.x("node:async_hooks", () => (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports)));
    }, 25085, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { getTestReqInfo: function() {
        return l;
      }, withRequest: function() {
        return o;
      } };
      for (var i in n) Object.defineProperty(r, i, { enumerable: true, get: n[i] });
      let a = new (e.r(78500)).AsyncLocalStorage();
      function s(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (!r2) return;
        let n2 = t2.url(e2);
        return { url: n2, proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function o(e2, t2, r2) {
        let n2 = s(e2, t2);
        return n2 ? a.run(n2, r2) : r2();
      }
      function l(e2, t2) {
        let r2 = a.getStore();
        return r2 || (e2 && t2 ? s(e2, t2) : void 0);
      }
    }, 28325, (e, t, r) => {
      "use strict";
      var n = e.i(51615);
      Object.defineProperty(r, "__esModule", { value: true });
      var i = { handleFetch: function() {
        return d;
      }, interceptFetch: function() {
        return u;
      }, reader: function() {
        return o;
      } };
      for (var a in i) Object.defineProperty(r, a, { enumerable: true, get: i[a] });
      let s = e.r(25085), o = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function l(e2, t2) {
        let { url: r2, method: i2, headers: a2, body: s2, cache: o2, credentials: l2, integrity: d2, mode: u2, redirect: c, referrer: h, referrerPolicy: f } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: i2, headers: [...Array.from(a2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: s2 ? n.Buffer.from(await t2.arrayBuffer()).toString("base64") : null, cache: o2, credentials: l2, integrity: d2, mode: u2, redirect: c, referrer: h, referrerPolicy: f } };
      }
      async function d(e2, t2) {
        let r2 = (0, s.getTestReqInfo)(t2, o);
        if (!r2) return e2(t2);
        let { testData: i2, proxyPort: a2 } = r2, d2 = await l(i2, t2), u2 = await e2(`http://localhost:${a2}`, { method: "POST", body: JSON.stringify(d2), headers: { "next-test-internal": "1" }, next: { internal: true } });
        if (!u2.ok) throw Object.defineProperty(Error(`Proxy request failed: ${u2.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let c = await u2.json(), { api: h } = c;
        switch (h) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${t2.method} ${t2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            return function(e3) {
              let { status: t3, headers: r3, body: i3 } = e3.response;
              return new Response(i3 ? n.Buffer.from(i3, "base64") : null, { status: t3, headers: new Headers(r3) });
            }(c);
          default:
            return h;
        }
      }
      function u(t2) {
        return e.g.fetch = function(e2, r2) {
          var n2;
          return (null == r2 || null == (n2 = r2.next) ? void 0 : n2.internal) ? t2(e2, r2) : d(t2, new Request(e2, r2));
        }, () => {
          e.g.fetch = t2;
        };
      }
    }, 94165, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { interceptTestApis: function() {
        return o;
      }, wrapRequestHandler: function() {
        return l;
      } };
      for (var i in n) Object.defineProperty(r, i, { enumerable: true, get: n[i] });
      let a = e.r(25085), s = e.r(28325);
      function o() {
        return (0, s.interceptFetch)(e.g.fetch);
      }
      function l(e2) {
        return (t2, r2) => (0, a.withRequest)(t2, s.reader, () => e2(t2, r2));
      }
    }, 54846, (e, t, r) => {
      !function() {
        "use strict";
        var e2 = { 431: function(e3) {
          function t2(e4) {
            if ("string" != typeof e4) throw TypeError("Path must be a string. Received " + JSON.stringify(e4));
          }
          function r3(e4, t3) {
            for (var r4, n3 = "", i = 0, a = -1, s = 0, o = 0; o <= e4.length; ++o) {
              if (o < e4.length) r4 = e4.charCodeAt(o);
              else if (47 === r4) break;
              else r4 = 47;
              if (47 === r4) {
                if (a === o - 1 || 1 === s) ;
                else if (a !== o - 1 && 2 === s) {
                  if (n3.length < 2 || 2 !== i || 46 !== n3.charCodeAt(n3.length - 1) || 46 !== n3.charCodeAt(n3.length - 2)) {
                    if (n3.length > 2) {
                      var l = n3.lastIndexOf("/");
                      if (l !== n3.length - 1) {
                        -1 === l ? (n3 = "", i = 0) : i = (n3 = n3.slice(0, l)).length - 1 - n3.lastIndexOf("/"), a = o, s = 0;
                        continue;
                      }
                    } else if (2 === n3.length || 1 === n3.length) {
                      n3 = "", i = 0, a = o, s = 0;
                      continue;
                    }
                  }
                  t3 && (n3.length > 0 ? n3 += "/.." : n3 = "..", i = 2);
                } else n3.length > 0 ? n3 += "/" + e4.slice(a + 1, o) : n3 = e4.slice(a + 1, o), i = o - a - 1;
                a = o, s = 0;
              } else 46 === r4 && -1 !== s ? ++s : s = -1;
            }
            return n3;
          }
          var n2 = { resolve: function() {
            for (var e4, n3, i = "", a = false, s = arguments.length - 1; s >= -1 && !a; s--) s >= 0 ? n3 = arguments[s] : (void 0 === e4 && (e4 = ""), n3 = e4), t2(n3), 0 !== n3.length && (i = n3 + "/" + i, a = 47 === n3.charCodeAt(0));
            if (i = r3(i, !a), a) if (i.length > 0) return "/" + i;
            else return "/";
            return i.length > 0 ? i : ".";
          }, normalize: function(e4) {
            if (t2(e4), 0 === e4.length) return ".";
            var n3 = 47 === e4.charCodeAt(0), i = 47 === e4.charCodeAt(e4.length - 1);
            return (0 !== (e4 = r3(e4, !n3)).length || n3 || (e4 = "."), e4.length > 0 && i && (e4 += "/"), n3) ? "/" + e4 : e4;
          }, isAbsolute: function(e4) {
            return t2(e4), e4.length > 0 && 47 === e4.charCodeAt(0);
          }, join: function() {
            if (0 == arguments.length) return ".";
            for (var e4, r4 = 0; r4 < arguments.length; ++r4) {
              var i = arguments[r4];
              t2(i), i.length > 0 && (void 0 === e4 ? e4 = i : e4 += "/" + i);
            }
            return void 0 === e4 ? "." : n2.normalize(e4);
          }, relative: function(e4, r4) {
            if (t2(e4), t2(r4), e4 === r4 || (e4 = n2.resolve(e4)) === (r4 = n2.resolve(r4))) return "";
            for (var i = 1; i < e4.length && 47 === e4.charCodeAt(i); ++i) ;
            for (var a = e4.length, s = a - i, o = 1; o < r4.length && 47 === r4.charCodeAt(o); ++o) ;
            for (var l = r4.length - o, d = s < l ? s : l, u = -1, c = 0; c <= d; ++c) {
              if (c === d) {
                if (l > d) {
                  if (47 === r4.charCodeAt(o + c)) return r4.slice(o + c + 1);
                  else if (0 === c) return r4.slice(o + c);
                } else s > d && (47 === e4.charCodeAt(i + c) ? u = c : 0 === c && (u = 0));
                break;
              }
              var h = e4.charCodeAt(i + c);
              if (h !== r4.charCodeAt(o + c)) break;
              47 === h && (u = c);
            }
            var f = "";
            for (c = i + u + 1; c <= a; ++c) (c === a || 47 === e4.charCodeAt(c)) && (0 === f.length ? f += ".." : f += "/..");
            return f.length > 0 ? f + r4.slice(o + u) : (o += u, 47 === r4.charCodeAt(o) && ++o, r4.slice(o));
          }, _makeLong: function(e4) {
            return e4;
          }, dirname: function(e4) {
            if (t2(e4), 0 === e4.length) return ".";
            for (var r4 = e4.charCodeAt(0), n3 = 47 === r4, i = -1, a = true, s = e4.length - 1; s >= 1; --s) if (47 === (r4 = e4.charCodeAt(s))) {
              if (!a) {
                i = s;
                break;
              }
            } else a = false;
            return -1 === i ? n3 ? "/" : "." : n3 && 1 === i ? "//" : e4.slice(0, i);
          }, basename: function(e4, r4) {
            if (void 0 !== r4 && "string" != typeof r4) throw TypeError('"ext" argument must be a string');
            t2(e4);
            var n3, i = 0, a = -1, s = true;
            if (void 0 !== r4 && r4.length > 0 && r4.length <= e4.length) {
              if (r4.length === e4.length && r4 === e4) return "";
              var o = r4.length - 1, l = -1;
              for (n3 = e4.length - 1; n3 >= 0; --n3) {
                var d = e4.charCodeAt(n3);
                if (47 === d) {
                  if (!s) {
                    i = n3 + 1;
                    break;
                  }
                } else -1 === l && (s = false, l = n3 + 1), o >= 0 && (d === r4.charCodeAt(o) ? -1 == --o && (a = n3) : (o = -1, a = l));
              }
              return i === a ? a = l : -1 === a && (a = e4.length), e4.slice(i, a);
            }
            for (n3 = e4.length - 1; n3 >= 0; --n3) if (47 === e4.charCodeAt(n3)) {
              if (!s) {
                i = n3 + 1;
                break;
              }
            } else -1 === a && (s = false, a = n3 + 1);
            return -1 === a ? "" : e4.slice(i, a);
          }, extname: function(e4) {
            t2(e4);
            for (var r4 = -1, n3 = 0, i = -1, a = true, s = 0, o = e4.length - 1; o >= 0; --o) {
              var l = e4.charCodeAt(o);
              if (47 === l) {
                if (!a) {
                  n3 = o + 1;
                  break;
                }
                continue;
              }
              -1 === i && (a = false, i = o + 1), 46 === l ? -1 === r4 ? r4 = o : 1 !== s && (s = 1) : -1 !== r4 && (s = -1);
            }
            return -1 === r4 || -1 === i || 0 === s || 1 === s && r4 === i - 1 && r4 === n3 + 1 ? "" : e4.slice(r4, i);
          }, format: function(e4) {
            var t3, r4;
            if (null === e4 || "object" != typeof e4) throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e4);
            return t3 = e4.dir || e4.root, r4 = e4.base || (e4.name || "") + (e4.ext || ""), t3 ? t3 === e4.root ? t3 + r4 : t3 + "/" + r4 : r4;
          }, parse: function(e4) {
            t2(e4);
            var r4, n3 = { root: "", dir: "", base: "", ext: "", name: "" };
            if (0 === e4.length) return n3;
            var i = e4.charCodeAt(0), a = 47 === i;
            a ? (n3.root = "/", r4 = 1) : r4 = 0;
            for (var s = -1, o = 0, l = -1, d = true, u = e4.length - 1, c = 0; u >= r4; --u) {
              if (47 === (i = e4.charCodeAt(u))) {
                if (!d) {
                  o = u + 1;
                  break;
                }
                continue;
              }
              -1 === l && (d = false, l = u + 1), 46 === i ? -1 === s ? s = u : 1 !== c && (c = 1) : -1 !== s && (c = -1);
            }
            return -1 === s || -1 === l || 0 === c || 1 === c && s === l - 1 && s === o + 1 ? -1 !== l && (0 === o && a ? n3.base = n3.name = e4.slice(1, l) : n3.base = n3.name = e4.slice(o, l)) : (0 === o && a ? (n3.name = e4.slice(1, s), n3.base = e4.slice(1, l)) : (n3.name = e4.slice(o, s), n3.base = e4.slice(o, l)), n3.ext = e4.slice(s, l)), o > 0 ? n3.dir = e4.slice(0, o - 1) : a && (n3.dir = "/"), n3;
          }, sep: "/", delimiter: ":", win32: null, posix: null };
          n2.posix = n2, e3.exports = n2;
        } }, r2 = {};
        function n(t2) {
          var i = r2[t2];
          if (void 0 !== i) return i.exports;
          var a = r2[t2] = { exports: {} }, s = true;
          try {
            e2[t2](a, a.exports, n), s = false;
          } finally {
            s && delete r2[t2];
          }
          return a.exports;
        }
        n.ab = "/ROOT/node_modules/next/dist/compiled/path-browserify/", t.exports = n(431);
      }();
    }, 68886, (e, t, r) => {
      t.exports = e.r(54846);
    }, 67914, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/path-to-regexp/");
        var e2 = {};
        (() => {
          function t2(e3, t3) {
            void 0 === t3 && (t3 = {});
            for (var r3 = function(e4) {
              for (var t4 = [], r4 = 0; r4 < e4.length; ) {
                var n3 = e4[r4];
                if ("*" === n3 || "+" === n3 || "?" === n3) {
                  t4.push({ type: "MODIFIER", index: r4, value: e4[r4++] });
                  continue;
                }
                if ("\\" === n3) {
                  t4.push({ type: "ESCAPED_CHAR", index: r4++, value: e4[r4++] });
                  continue;
                }
                if ("{" === n3) {
                  t4.push({ type: "OPEN", index: r4, value: e4[r4++] });
                  continue;
                }
                if ("}" === n3) {
                  t4.push({ type: "CLOSE", index: r4, value: e4[r4++] });
                  continue;
                }
                if (":" === n3) {
                  for (var i2 = "", a3 = r4 + 1; a3 < e4.length; ) {
                    var s3 = e4.charCodeAt(a3);
                    if (s3 >= 48 && s3 <= 57 || s3 >= 65 && s3 <= 90 || s3 >= 97 && s3 <= 122 || 95 === s3) {
                      i2 += e4[a3++];
                      continue;
                    }
                    break;
                  }
                  if (!i2) throw TypeError("Missing parameter name at ".concat(r4));
                  t4.push({ type: "NAME", index: r4, value: i2 }), r4 = a3;
                  continue;
                }
                if ("(" === n3) {
                  var o3 = 1, l2 = "", a3 = r4 + 1;
                  if ("?" === e4[a3]) throw TypeError('Pattern cannot start with "?" at '.concat(a3));
                  for (; a3 < e4.length; ) {
                    if ("\\" === e4[a3]) {
                      l2 += e4[a3++] + e4[a3++];
                      continue;
                    }
                    if (")" === e4[a3]) {
                      if (0 == --o3) {
                        a3++;
                        break;
                      }
                    } else if ("(" === e4[a3] && (o3++, "?" !== e4[a3 + 1])) throw TypeError("Capturing groups are not allowed at ".concat(a3));
                    l2 += e4[a3++];
                  }
                  if (o3) throw TypeError("Unbalanced pattern at ".concat(r4));
                  if (!l2) throw TypeError("Missing pattern at ".concat(r4));
                  t4.push({ type: "PATTERN", index: r4, value: l2 }), r4 = a3;
                  continue;
                }
                t4.push({ type: "CHAR", index: r4, value: e4[r4++] });
              }
              return t4.push({ type: "END", index: r4, value: "" }), t4;
            }(e3), n2 = t3.prefixes, a2 = void 0 === n2 ? "./" : n2, s2 = t3.delimiter, o2 = void 0 === s2 ? "/#?" : s2, l = [], d = 0, u = 0, c = "", h = function(e4) {
              if (u < r3.length && r3[u].type === e4) return r3[u++].value;
            }, f = function(e4) {
              var t4 = h(e4);
              if (void 0 !== t4) return t4;
              var n3 = r3[u], i2 = n3.type, a3 = n3.index;
              throw TypeError("Unexpected ".concat(i2, " at ").concat(a3, ", expected ").concat(e4));
            }, p = function() {
              for (var e4, t4 = ""; e4 = h("CHAR") || h("ESCAPED_CHAR"); ) t4 += e4;
              return t4;
            }, _ = function(e4) {
              for (var t4 = 0; t4 < o2.length; t4++) {
                var r4 = o2[t4];
                if (e4.indexOf(r4) > -1) return true;
              }
              return false;
            }, g = function(e4) {
              var t4 = l[l.length - 1], r4 = e4 || (t4 && "string" == typeof t4 ? t4 : "");
              if (t4 && !r4) throw TypeError('Must have text between two parameters, missing text after "'.concat(t4.name, '"'));
              return !r4 || _(r4) ? "[^".concat(i(o2), "]+?") : "(?:(?!".concat(i(r4), ")[^").concat(i(o2), "])+?");
            }; u < r3.length; ) {
              var m = h("CHAR"), y = h("NAME"), w = h("PATTERN");
              if (y || w) {
                var v = m || "";
                -1 === a2.indexOf(v) && (c += v, v = ""), c && (l.push(c), c = ""), l.push({ name: y || d++, prefix: v, suffix: "", pattern: w || g(v), modifier: h("MODIFIER") || "" });
                continue;
              }
              var b = m || h("ESCAPED_CHAR");
              if (b) {
                c += b;
                continue;
              }
              if (c && (l.push(c), c = ""), h("OPEN")) {
                var v = p(), x = h("NAME") || "", E = h("PATTERN") || "", C = p();
                f("CLOSE"), l.push({ name: x || (E ? d++ : ""), pattern: x && !E ? g(v) : E, prefix: v, suffix: C, modifier: h("MODIFIER") || "" });
                continue;
              }
              f("END");
            }
            return l;
          }
          function r2(e3, t3) {
            void 0 === t3 && (t3 = {});
            var r3 = a(t3), n2 = t3.encode, i2 = void 0 === n2 ? function(e4) {
              return e4;
            } : n2, s2 = t3.validate, o2 = void 0 === s2 || s2, l = e3.map(function(e4) {
              if ("object" == typeof e4) return new RegExp("^(?:".concat(e4.pattern, ")$"), r3);
            });
            return function(t4) {
              for (var r4 = "", n3 = 0; n3 < e3.length; n3++) {
                var a2 = e3[n3];
                if ("string" == typeof a2) {
                  r4 += a2;
                  continue;
                }
                var s3 = t4 ? t4[a2.name] : void 0, d = "?" === a2.modifier || "*" === a2.modifier, u = "*" === a2.modifier || "+" === a2.modifier;
                if (Array.isArray(s3)) {
                  if (!u) throw TypeError('Expected "'.concat(a2.name, '" to not repeat, but got an array'));
                  if (0 === s3.length) {
                    if (d) continue;
                    throw TypeError('Expected "'.concat(a2.name, '" to not be empty'));
                  }
                  for (var c = 0; c < s3.length; c++) {
                    var h = i2(s3[c], a2);
                    if (o2 && !l[n3].test(h)) throw TypeError('Expected all "'.concat(a2.name, '" to match "').concat(a2.pattern, '", but got "').concat(h, '"'));
                    r4 += a2.prefix + h + a2.suffix;
                  }
                  continue;
                }
                if ("string" == typeof s3 || "number" == typeof s3) {
                  var h = i2(String(s3), a2);
                  if (o2 && !l[n3].test(h)) throw TypeError('Expected "'.concat(a2.name, '" to match "').concat(a2.pattern, '", but got "').concat(h, '"'));
                  r4 += a2.prefix + h + a2.suffix;
                  continue;
                }
                if (!d) {
                  var f = u ? "an array" : "a string";
                  throw TypeError('Expected "'.concat(a2.name, '" to be ').concat(f));
                }
              }
              return r4;
            };
          }
          function n(e3, t3, r3) {
            void 0 === r3 && (r3 = {});
            var n2 = r3.decode, i2 = void 0 === n2 ? function(e4) {
              return e4;
            } : n2;
            return function(r4) {
              var n3 = e3.exec(r4);
              if (!n3) return false;
              for (var a2 = n3[0], s2 = n3.index, o2 = /* @__PURE__ */ Object.create(null), l = 1; l < n3.length; l++) !function(e4) {
                if (void 0 !== n3[e4]) {
                  var r5 = t3[e4 - 1];
                  "*" === r5.modifier || "+" === r5.modifier ? o2[r5.name] = n3[e4].split(r5.prefix + r5.suffix).map(function(e5) {
                    return i2(e5, r5);
                  }) : o2[r5.name] = i2(n3[e4], r5);
                }
              }(l);
              return { path: a2, index: s2, params: o2 };
            };
          }
          function i(e3) {
            return e3.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
          }
          function a(e3) {
            return e3 && e3.sensitive ? "" : "i";
          }
          function s(e3, t3, r3) {
            void 0 === r3 && (r3 = {});
            for (var n2 = r3.strict, s2 = void 0 !== n2 && n2, o2 = r3.start, l = r3.end, d = r3.encode, u = void 0 === d ? function(e4) {
              return e4;
            } : d, c = r3.delimiter, h = r3.endsWith, f = "[".concat(i(void 0 === h ? "" : h), "]|$"), p = "[".concat(i(void 0 === c ? "/#?" : c), "]"), _ = void 0 === o2 || o2 ? "^" : "", g = 0; g < e3.length; g++) {
              var m = e3[g];
              if ("string" == typeof m) _ += i(u(m));
              else {
                var y = i(u(m.prefix)), w = i(u(m.suffix));
                if (m.pattern) if (t3 && t3.push(m), y || w) if ("+" === m.modifier || "*" === m.modifier) {
                  var v = "*" === m.modifier ? "?" : "";
                  _ += "(?:".concat(y, "((?:").concat(m.pattern, ")(?:").concat(w).concat(y, "(?:").concat(m.pattern, "))*)").concat(w, ")").concat(v);
                } else _ += "(?:".concat(y, "(").concat(m.pattern, ")").concat(w, ")").concat(m.modifier);
                else {
                  if ("+" === m.modifier || "*" === m.modifier) throw TypeError('Can not repeat "'.concat(m.name, '" without a prefix and suffix'));
                  _ += "(".concat(m.pattern, ")").concat(m.modifier);
                }
                else _ += "(?:".concat(y).concat(w, ")").concat(m.modifier);
              }
            }
            if (void 0 === l || l) s2 || (_ += "".concat(p, "?")), _ += r3.endsWith ? "(?=".concat(f, ")") : "$";
            else {
              var b = e3[e3.length - 1], x = "string" == typeof b ? p.indexOf(b[b.length - 1]) > -1 : void 0 === b;
              s2 || (_ += "(?:".concat(p, "(?=").concat(f, "))?")), x || (_ += "(?=".concat(p, "|").concat(f, ")"));
            }
            return new RegExp(_, a(r3));
          }
          function o(e3, r3, n2) {
            if (e3 instanceof RegExp) {
              var i2;
              if (!r3) return e3;
              for (var l = /\((?:\?<(.*?)>)?(?!\?)/g, d = 0, u = l.exec(e3.source); u; ) r3.push({ name: u[1] || d++, prefix: "", suffix: "", modifier: "", pattern: "" }), u = l.exec(e3.source);
              return e3;
            }
            return Array.isArray(e3) ? (i2 = e3.map(function(e4) {
              return o(e4, r3, n2).source;
            }), new RegExp("(?:".concat(i2.join("|"), ")"), a(n2))) : s(t2(e3, n2), r3, n2);
          }
          Object.defineProperty(e2, "__esModule", { value: true }), e2.pathToRegexp = e2.tokensToRegexp = e2.regexpToFunction = e2.match = e2.tokensToFunction = e2.compile = e2.parse = void 0, e2.parse = t2, e2.compile = function(e3, n2) {
            return r2(t2(e3, n2), n2);
          }, e2.tokensToFunction = r2, e2.match = function(e3, t3) {
            var r3 = [];
            return n(o(e3, r3, t3), r3, t3);
          }, e2.regexpToFunction = n, e2.tokensToRegexp = s, e2.pathToRegexp = o;
        })(), t.exports = e2;
      })();
    }, 64445, (e, t, r) => {
      var n = { 943: function(t2, r2) {
        !function(n2) {
          "use strict";
          var i2 = "function", a2 = "undefined", s = "object", o = "string", l = "major", d = "model", u = "name", c = "type", h = "vendor", f = "version", p = "architecture", _ = "console", g = "mobile", m = "tablet", y = "smarttv", w = "wearable", v = "embedded", b = "Amazon", x = "Apple", E = "ASUS", C = "BlackBerry", S = "Browser", R = "Chrome", T = "Firefox", O = "Google", P = "Huawei", A = "Microsoft", k = "Motorola", N = "Opera", L = "Samsung", M = "Sharp", I = "Sony", q = "Xiaomi", D = "Zebra", j = "Facebook", U = "Chromium OS", B = "Mac OS", G = function(e2, t3) {
            var r3 = {};
            for (var n3 in e2) t3[n3] && t3[n3].length % 2 == 0 ? r3[n3] = t3[n3].concat(e2[n3]) : r3[n3] = e2[n3];
            return r3;
          }, H = function(e2) {
            for (var t3 = {}, r3 = 0; r3 < e2.length; r3++) t3[e2[r3].toUpperCase()] = e2[r3];
            return t3;
          }, $ = function(e2, t3) {
            return typeof e2 === o && -1 !== F(t3).indexOf(F(e2));
          }, F = function(e2) {
            return e2.toLowerCase();
          }, z = function(e2, t3) {
            if (typeof e2 === o) return e2 = e2.replace(/^\s\s*/, ""), typeof t3 === a2 ? e2 : e2.substring(0, 350);
          }, V = function(e2, t3) {
            for (var r3, n3, a3, o2, l2, d2, u2 = 0; u2 < t3.length && !l2; ) {
              var c2 = t3[u2], h2 = t3[u2 + 1];
              for (r3 = n3 = 0; r3 < c2.length && !l2 && c2[r3]; ) if (l2 = c2[r3++].exec(e2)) for (a3 = 0; a3 < h2.length; a3++) d2 = l2[++n3], typeof (o2 = h2[a3]) === s && o2.length > 0 ? 2 === o2.length ? typeof o2[1] == i2 ? this[o2[0]] = o2[1].call(this, d2) : this[o2[0]] = o2[1] : 3 === o2.length ? typeof o2[1] !== i2 || o2[1].exec && o2[1].test ? this[o2[0]] = d2 ? d2.replace(o2[1], o2[2]) : void 0 : this[o2[0]] = d2 ? o2[1].call(this, d2, o2[2]) : void 0 : 4 === o2.length && (this[o2[0]] = d2 ? o2[3].call(this, d2.replace(o2[1], o2[2])) : void 0) : this[o2] = d2 || void 0;
              u2 += 2;
            }
          }, K = function(e2, t3) {
            for (var r3 in t3) if (typeof t3[r3] === s && t3[r3].length > 0) {
              for (var n3 = 0; n3 < t3[r3].length; n3++) if ($(t3[r3][n3], e2)) return "?" === r3 ? void 0 : r3;
            } else if ($(t3[r3], e2)) return "?" === r3 ? void 0 : r3;
            return e2;
          }, W = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, X = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [f, [u, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [f, [u, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [u, f], [/opios[\/ ]+([\w\.]+)/i], [f, [u, N + " Mini"]], [/\bopr\/([\w\.]+)/i], [f, [u, N]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [u, f], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [f, [u, "UC" + S]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [f, [u, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [f, [u, "WeChat"]], [/konqueror\/([\w\.]+)/i], [f, [u, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [f, [u, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [f, [u, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[u, /(.+)/, "$1 Secure " + S], f], [/\bfocus\/([\w\.]+)/i], [f, [u, T + " Focus"]], [/\bopt\/([\w\.]+)/i], [f, [u, N + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [f, [u, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [f, [u, "Dolphin"]], [/coast\/([\w\.]+)/i], [f, [u, N + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [f, [u, "MIUI " + S]], [/fxios\/([-\w\.]+)/i], [f, [u, T]], [/\bqihu|(qi?ho?o?|360)browser/i], [[u, "360 " + S]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[u, /(.+)/, "$1 " + S], f], [/(comodo_dragon)\/([\w\.]+)/i], [[u, /_/g, " "], f], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [u, f], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [u], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[u, j], f], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [u, f], [/\bgsa\/([\w\.]+) .*safari\//i], [f, [u, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [f, [u, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [f, [u, R + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[u, R + " WebView"], f], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [f, [u, "Android " + S]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [u, f], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [f, [u, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [f, u], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [u, [f, K, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [u, f], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[u, "Netscape"], f], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [f, [u, T + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [u, f], [/(cobalt)\/([\w\.]+)/i], [u, [f, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[p, "amd64"]], [/(ia32(?=;))/i], [[p, F]], [/((?:i[346]|x)86)[;\)]/i], [[p, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[p, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[p, "armhf"]], [/windows (ce|mobile); ppc;/i], [[p, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[p, /ower/, "", F]], [/(sun4\w)[;\)]/i], [[p, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[p, F]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [d, [h, L], [c, m]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [d, [h, L], [c, g]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [d, [h, x], [c, g]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [d, [h, x], [c, m]], [/(macintosh);/i], [d, [h, x]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [d, [h, M], [c, g]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [d, [h, P], [c, m]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [d, [h, P], [c, g]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[d, /_/g, " "], [h, q], [c, g]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[d, /_/g, " "], [h, q], [c, m]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [d, [h, "OPPO"], [c, g]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [d, [h, "Vivo"], [c, g]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [d, [h, "Realme"], [c, g]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [d, [h, k], [c, g]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [d, [h, k], [c, m]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [d, [h, "LG"], [c, m]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [d, [h, "LG"], [c, g]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [d, [h, "Lenovo"], [c, m]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[d, /_/g, " "], [h, "Nokia"], [c, g]], [/(pixel c)\b/i], [d, [h, O], [c, m]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [d, [h, O], [c, g]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [d, [h, I], [c, g]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[d, "Xperia Tablet"], [h, I], [c, m]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [d, [h, "OnePlus"], [c, g]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [d, [h, b], [c, m]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[d, /(.+)/g, "Fire Phone $1"], [h, b], [c, g]], [/(playbook);[-\w\),; ]+(rim)/i], [d, h, [c, m]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [d, [h, C], [c, g]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [d, [h, E], [c, m]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [d, [h, E], [c, g]], [/(nexus 9)/i], [d, [h, "HTC"], [c, m]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [h, [d, /_/g, " "], [c, g]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [d, [h, "Acer"], [c, m]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [d, [h, "Meizu"], [c, g]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [h, d, [c, g]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [h, d, [c, m]], [/(surface duo)/i], [d, [h, A], [c, m]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [d, [h, "Fairphone"], [c, g]], [/(u304aa)/i], [d, [h, "AT&T"], [c, g]], [/\bsie-(\w*)/i], [d, [h, "Siemens"], [c, g]], [/\b(rct\w+) b/i], [d, [h, "RCA"], [c, m]], [/\b(venue[\d ]{2,7}) b/i], [d, [h, "Dell"], [c, m]], [/\b(q(?:mv|ta)\w+) b/i], [d, [h, "Verizon"], [c, m]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [d, [h, "Barnes & Noble"], [c, m]], [/\b(tm\d{3}\w+) b/i], [d, [h, "NuVision"], [c, m]], [/\b(k88) b/i], [d, [h, "ZTE"], [c, m]], [/\b(nx\d{3}j) b/i], [d, [h, "ZTE"], [c, g]], [/\b(gen\d{3}) b.+49h/i], [d, [h, "Swiss"], [c, g]], [/\b(zur\d{3}) b/i], [d, [h, "Swiss"], [c, m]], [/\b((zeki)?tb.*\b) b/i], [d, [h, "Zeki"], [c, m]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[h, "Dragon Touch"], d, [c, m]], [/\b(ns-?\w{0,9}) b/i], [d, [h, "Insignia"], [c, m]], [/\b((nxa|next)-?\w{0,9}) b/i], [d, [h, "NextBook"], [c, m]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[h, "Voice"], d, [c, g]], [/\b(lvtel\-)?(v1[12]) b/i], [[h, "LvTel"], d, [c, g]], [/\b(ph-1) /i], [d, [h, "Essential"], [c, g]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [d, [h, "Envizen"], [c, m]], [/\b(trio[-\w\. ]+) b/i], [d, [h, "MachSpeed"], [c, m]], [/\btu_(1491) b/i], [d, [h, "Rotor"], [c, m]], [/(shield[\w ]+) b/i], [d, [h, "Nvidia"], [c, m]], [/(sprint) (\w+)/i], [h, d, [c, g]], [/(kin\.[onetw]{3})/i], [[d, /\./g, " "], [h, A], [c, g]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [d, [h, D], [c, m]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [d, [h, D], [c, g]], [/smart-tv.+(samsung)/i], [h, [c, y]], [/hbbtv.+maple;(\d+)/i], [[d, /^/, "SmartTV"], [h, L], [c, y]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[h, "LG"], [c, y]], [/(apple) ?tv/i], [h, [d, x + " TV"], [c, y]], [/crkey/i], [[d, R + "cast"], [h, O], [c, y]], [/droid.+aft(\w)( bui|\))/i], [d, [h, b], [c, y]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [d, [h, M], [c, y]], [/(bravia[\w ]+)( bui|\))/i], [d, [h, I], [c, y]], [/(mitv-\w{5}) bui/i], [d, [h, q], [c, y]], [/Hbbtv.*(technisat) (.*);/i], [h, d, [c, y]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[h, z], [d, z], [c, y]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[c, y]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [h, d, [c, _]], [/droid.+; (shield) bui/i], [d, [h, "Nvidia"], [c, _]], [/(playstation [345portablevi]+)/i], [d, [h, I], [c, _]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [d, [h, A], [c, _]], [/((pebble))app/i], [h, d, [c, w]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [d, [h, x], [c, w]], [/droid.+; (glass) \d/i], [d, [h, O], [c, w]], [/droid.+; (wt63?0{2,3})\)/i], [d, [h, D], [c, w]], [/(quest( 2| pro)?)/i], [d, [h, j], [c, w]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [h, [c, v]], [/(aeobc)\b/i], [d, [h, b], [c, v]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [d, [c, g]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [d, [c, m]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[c, m]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[c, g]], [/(android[-\w\. ]{0,9});.+buil/i], [d, [h, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [f, [u, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [f, [u, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [u, f], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [f, u]], os: [[/microsoft (windows) (vista|xp)/i], [u, f], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [u, [f, K, W]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[u, "Windows"], [f, K, W]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[f, /_/g, "."], [u, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[u, B], [f, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [f, u], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [u, f], [/\(bb(10);/i], [f, [u, C]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [f, [u, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [f, [u, T + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [f, [u, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [f, [u, "watchOS"]], [/crkey\/([\d\.]+)/i], [f, [u, R + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[u, U], f], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [u, f], [/(sunos) ?([\w\.\d]*)/i], [[u, "Solaris"], f], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [u, f]] }, Z = function(e2, t3) {
            if (typeof e2 === s && (t3 = e2, e2 = void 0), !(this instanceof Z)) return new Z(e2, t3).getResult();
            var r3 = typeof n2 !== a2 && n2.navigator ? n2.navigator : void 0, _2 = e2 || (r3 && r3.userAgent ? r3.userAgent : ""), y2 = r3 && r3.userAgentData ? r3.userAgentData : void 0, w2 = t3 ? G(X, t3) : X, v2 = r3 && r3.userAgent == _2;
            return this.getBrowser = function() {
              var e3, t4 = {};
              return t4[u] = void 0, t4[f] = void 0, V.call(t4, _2, w2.browser), t4[l] = typeof (e3 = t4[f]) === o ? e3.replace(/[^\d\.]/g, "").split(".")[0] : void 0, v2 && r3 && r3.brave && typeof r3.brave.isBrave == i2 && (t4[u] = "Brave"), t4;
            }, this.getCPU = function() {
              var e3 = {};
              return e3[p] = void 0, V.call(e3, _2, w2.cpu), e3;
            }, this.getDevice = function() {
              var e3 = {};
              return e3[h] = void 0, e3[d] = void 0, e3[c] = void 0, V.call(e3, _2, w2.device), v2 && !e3[c] && y2 && y2.mobile && (e3[c] = g), v2 && "Macintosh" == e3[d] && r3 && typeof r3.standalone !== a2 && r3.maxTouchPoints && r3.maxTouchPoints > 2 && (e3[d] = "iPad", e3[c] = m), e3;
            }, this.getEngine = function() {
              var e3 = {};
              return e3[u] = void 0, e3[f] = void 0, V.call(e3, _2, w2.engine), e3;
            }, this.getOS = function() {
              var e3 = {};
              return e3[u] = void 0, e3[f] = void 0, V.call(e3, _2, w2.os), v2 && !e3[u] && y2 && "Unknown" != y2.platform && (e3[u] = y2.platform.replace(/chrome os/i, U).replace(/macos/i, B)), e3;
            }, this.getResult = function() {
              return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
            }, this.getUA = function() {
              return _2;
            }, this.setUA = function(e3) {
              return _2 = typeof e3 === o && e3.length > 350 ? z(e3, 350) : e3, this;
            }, this.setUA(_2), this;
          };
          if (Z.VERSION = "1.0.35", Z.BROWSER = H([u, f, l]), Z.CPU = H([p]), Z.DEVICE = H([d, h, c, _, g, y, m, w, v]), Z.ENGINE = Z.OS = H([u, f]), typeof r2 !== a2) t2.exports && (r2 = t2.exports = Z), r2.UAParser = Z;
          else if (typeof define === i2 && define.amd) e.r, void 0 !== Z && e.v(Z);
          else typeof n2 !== a2 && (n2.UAParser = Z);
          var J = typeof n2 !== a2 && (n2.jQuery || n2.Zepto);
          if (J && !J.ua) {
            var Y = new Z();
            J.ua = Y.getResult(), J.ua.get = function() {
              return Y.getUA();
            }, J.ua.set = function(e2) {
              Y.setUA(e2);
              var t3 = Y.getResult();
              for (var r3 in t3) J.ua[r3] = t3[r3];
            };
          }
        }(this);
      } }, i = {};
      function a(e2) {
        var t2 = i[e2];
        if (void 0 !== t2) return t2.exports;
        var r2 = i[e2] = { exports: {} }, s = true;
        try {
          n[e2].call(r2.exports, r2, r2.exports, a), s = false;
        } finally {
          s && delete i[e2];
        }
        return r2.exports;
      }
      a.ab = "/ROOT/node_modules/next/dist/compiled/ua-parser-js/", t.exports = a(943);
    }, 8946, (e, t, r) => {
      "use strict";
      var n = { H: null, A: null };
      function i(e2) {
        var t2 = "https://react.dev/errors/" + e2;
        if (1 < arguments.length) {
          t2 += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var r2 = 2; r2 < arguments.length; r2++) t2 += "&args[]=" + encodeURIComponent(arguments[r2]);
        }
        return "Minified React error #" + e2 + "; visit " + t2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var a = Array.isArray;
      function s() {
      }
      var o = Symbol.for("react.transitional.element"), l = Symbol.for("react.portal"), d = Symbol.for("react.fragment"), u = Symbol.for("react.strict_mode"), c = Symbol.for("react.profiler"), h = Symbol.for("react.forward_ref"), f = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), _ = Symbol.for("react.lazy"), g = Symbol.for("react.activity"), m = Symbol.for("react.view_transition"), y = Symbol.iterator, w = Object.prototype.hasOwnProperty, v = Object.assign;
      function b(e2, t2, r2) {
        var n2 = r2.ref;
        return { $$typeof: o, type: e2, key: t2, ref: void 0 !== n2 ? n2 : null, props: r2 };
      }
      function x(e2) {
        return "object" == typeof e2 && null !== e2 && e2.$$typeof === o;
      }
      var E = /\/+/g;
      function C(e2, t2) {
        var r2, n2;
        return "object" == typeof e2 && null !== e2 && null != e2.key ? (r2 = "" + e2.key, n2 = { "=": "=0", ":": "=2" }, "$" + r2.replace(/[=:]/g, function(e3) {
          return n2[e3];
        })) : t2.toString(36);
      }
      function S(e2, t2, r2) {
        if (null == e2) return e2;
        var n2 = [], d2 = 0;
        return !function e3(t3, r3, n3, d3, u2) {
          var c2, h2, f2, p2 = typeof t3;
          ("undefined" === p2 || "boolean" === p2) && (t3 = null);
          var g2 = false;
          if (null === t3) g2 = true;
          else switch (p2) {
            case "bigint":
            case "string":
            case "number":
              g2 = true;
              break;
            case "object":
              switch (t3.$$typeof) {
                case o:
                case l:
                  g2 = true;
                  break;
                case _:
                  return e3((g2 = t3._init)(t3._payload), r3, n3, d3, u2);
              }
          }
          if (g2) return u2 = u2(t3), g2 = "" === d3 ? "." + C(t3, 0) : d3, a(u2) ? (n3 = "", null != g2 && (n3 = g2.replace(E, "$&/") + "/"), e3(u2, r3, n3, "", function(e4) {
            return e4;
          })) : null != u2 && (x(u2) && (c2 = u2, h2 = n3 + (null == u2.key || t3 && t3.key === u2.key ? "" : ("" + u2.key).replace(E, "$&/") + "/") + g2, u2 = b(c2.type, h2, c2.props)), r3.push(u2)), 1;
          g2 = 0;
          var m2 = "" === d3 ? "." : d3 + ":";
          if (a(t3)) for (var w2 = 0; w2 < t3.length; w2++) p2 = m2 + C(d3 = t3[w2], w2), g2 += e3(d3, r3, n3, p2, u2);
          else if ("function" == typeof (w2 = null === (f2 = t3) || "object" != typeof f2 ? null : "function" == typeof (f2 = y && f2[y] || f2["@@iterator"]) ? f2 : null)) for (t3 = w2.call(t3), w2 = 0; !(d3 = t3.next()).done; ) p2 = m2 + C(d3 = d3.value, w2++), g2 += e3(d3, r3, n3, p2, u2);
          else if ("object" === p2) {
            if ("function" == typeof t3.then) return e3(function(e4) {
              switch (e4.status) {
                case "fulfilled":
                  return e4.value;
                case "rejected":
                  throw e4.reason;
                default:
                  switch ("string" == typeof e4.status ? e4.then(s, s) : (e4.status = "pending", e4.then(function(t4) {
                    "pending" === e4.status && (e4.status = "fulfilled", e4.value = t4);
                  }, function(t4) {
                    "pending" === e4.status && (e4.status = "rejected", e4.reason = t4);
                  })), e4.status) {
                    case "fulfilled":
                      return e4.value;
                    case "rejected":
                      throw e4.reason;
                  }
              }
              throw e4;
            }(t3), r3, n3, d3, u2);
            throw Error(i(31, "[object Object]" === (r3 = String(t3)) ? "object with keys {" + Object.keys(t3).join(", ") + "}" : r3));
          }
          return g2;
        }(e2, n2, "", "", function(e3) {
          return t2.call(r2, e3, d2++);
        }), n2;
      }
      function R(e2) {
        if (-1 === e2._status) {
          var t2 = (0, e2._result)();
          t2.then(function(r2) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 1, e2._result = r2, void 0 === t2.status && (t2.status = "fulfilled", t2.value = r2));
          }, function(r2) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 2, e2._result = r2, void 0 === t2.status && (t2.status = "rejected", t2.reason = r2));
          }), -1 === e2._status && (e2._status = 0, e2._result = t2);
        }
        if (1 === e2._status) return e2._result.default;
        throw e2._result;
      }
      function T() {
        return /* @__PURE__ */ new WeakMap();
      }
      function O() {
        return { s: 0, v: void 0, o: null, p: null };
      }
      r.Activity = g, r.Children = { map: S, forEach: function(e2, t2, r2) {
        S(e2, function() {
          t2.apply(this, arguments);
        }, r2);
      }, count: function(e2) {
        var t2 = 0;
        return S(e2, function() {
          t2++;
        }), t2;
      }, toArray: function(e2) {
        return S(e2, function(e3) {
          return e3;
        }) || [];
      }, only: function(e2) {
        if (!x(e2)) throw Error(i(143));
        return e2;
      } }, r.Fragment = d, r.Profiler = c, r.StrictMode = u, r.Suspense = f, r.ViewTransition = m, r.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = n, r.cache = function(e2) {
        return function() {
          var t2 = n.A;
          if (!t2) return e2.apply(null, arguments);
          var r2 = t2.getCacheForType(T);
          void 0 === (t2 = r2.get(e2)) && (t2 = O(), r2.set(e2, t2)), r2 = 0;
          for (var i2 = arguments.length; r2 < i2; r2++) {
            var a2 = arguments[r2];
            if ("function" == typeof a2 || "object" == typeof a2 && null !== a2) {
              var s2 = t2.o;
              null === s2 && (t2.o = s2 = /* @__PURE__ */ new WeakMap()), void 0 === (t2 = s2.get(a2)) && (t2 = O(), s2.set(a2, t2));
            } else null === (s2 = t2.p) && (t2.p = s2 = /* @__PURE__ */ new Map()), void 0 === (t2 = s2.get(a2)) && (t2 = O(), s2.set(a2, t2));
          }
          if (1 === t2.s) return t2.v;
          if (2 === t2.s) throw t2.v;
          try {
            var o2 = e2.apply(null, arguments);
            return (r2 = t2).s = 1, r2.v = o2;
          } catch (e3) {
            throw (o2 = t2).s = 2, o2.v = e3, e3;
          }
        };
      }, r.cacheSignal = function() {
        var e2 = n.A;
        return e2 ? e2.cacheSignal() : null;
      }, r.captureOwnerStack = function() {
        return null;
      }, r.cloneElement = function(e2, t2, r2) {
        if (null == e2) throw Error(i(267, e2));
        var n2 = v({}, e2.props), a2 = e2.key;
        if (null != t2) for (s2 in void 0 !== t2.key && (a2 = "" + t2.key), t2) w.call(t2, s2) && "key" !== s2 && "__self" !== s2 && "__source" !== s2 && ("ref" !== s2 || void 0 !== t2.ref) && (n2[s2] = t2[s2]);
        var s2 = arguments.length - 2;
        if (1 === s2) n2.children = r2;
        else if (1 < s2) {
          for (var o2 = Array(s2), l2 = 0; l2 < s2; l2++) o2[l2] = arguments[l2 + 2];
          n2.children = o2;
        }
        return b(e2.type, a2, n2);
      }, r.createElement = function(e2, t2, r2) {
        var n2, i2 = {}, a2 = null;
        if (null != t2) for (n2 in void 0 !== t2.key && (a2 = "" + t2.key), t2) w.call(t2, n2) && "key" !== n2 && "__self" !== n2 && "__source" !== n2 && (i2[n2] = t2[n2]);
        var s2 = arguments.length - 2;
        if (1 === s2) i2.children = r2;
        else if (1 < s2) {
          for (var o2 = Array(s2), l2 = 0; l2 < s2; l2++) o2[l2] = arguments[l2 + 2];
          i2.children = o2;
        }
        if (e2 && e2.defaultProps) for (n2 in s2 = e2.defaultProps) void 0 === i2[n2] && (i2[n2] = s2[n2]);
        return b(e2, a2, i2);
      }, r.createRef = function() {
        return { current: null };
      }, r.forwardRef = function(e2) {
        return { $$typeof: h, render: e2 };
      }, r.isValidElement = x, r.lazy = function(e2) {
        return { $$typeof: _, _payload: { _status: -1, _result: e2 }, _init: R };
      }, r.memo = function(e2, t2) {
        return { $$typeof: p, type: e2, compare: void 0 === t2 ? null : t2 };
      }, r.use = function(e2) {
        return n.H.use(e2);
      }, r.useCallback = function(e2, t2) {
        return n.H.useCallback(e2, t2);
      }, r.useDebugValue = function() {
      }, r.useId = function() {
        return n.H.useId();
      }, r.useMemo = function(e2, t2) {
        return n.H.useMemo(e2, t2);
      }, r.version = "19.3.0-canary-cbb046ab-20260731";
    }, 40049, (e, t, r) => {
      "use strict";
      t.exports = e.r(8946);
    }, 15737, (e, t, r) => {
      "use strict";
      t.exports = i, t.exports.preferredCharsets = i;
      var n = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
      function i(e2, t2) {
        var r2 = function(e3) {
          for (var t3 = e3.split(","), r3 = 0, i3 = 0; r3 < t3.length; r3++) {
            var a2 = function(e4, t4) {
              var r4 = n.exec(e4);
              if (!r4) return null;
              var i4 = r4[1], a3 = 1;
              if (r4[2]) for (var s2 = r4[2].split(";"), o2 = 0; o2 < s2.length; o2++) {
                var l = s2[o2].trim().split("=");
                if ("q" === l[0]) {
                  a3 = parseFloat(l[1]);
                  break;
                }
              }
              return { charset: i4, q: a3, i: t4 };
            }(t3[r3].trim(), r3);
            a2 && (t3[i3++] = a2);
          }
          return t3.length = i3, t3;
        }(void 0 === e2 ? "*" : e2 || "");
        if (!t2) return r2.filter(o).sort(a).map(s);
        var i2 = t2.map(function(e3, t3) {
          for (var n2 = { o: -1, q: 0, s: 0 }, i3 = 0; i3 < r2.length; i3++) {
            var a2 = function(e4, t4, r3) {
              var n3 = 0;
              if (t4.charset.toLowerCase() === e4.toLowerCase()) n3 |= 1;
              else if ("*" !== t4.charset) return null;
              return { i: r3, o: t4.i, q: t4.q, s: n3 };
            }(e3, r2[i3], t3);
            a2 && 0 > (n2.s - a2.s || n2.q - a2.q || n2.o - a2.o) && (n2 = a2);
          }
          return n2;
        });
        return i2.filter(o).sort(a).map(function(e3) {
          return t2[i2.indexOf(e3)];
        });
      }
      function a(e2, t2) {
        return t2.q - e2.q || t2.s - e2.s || e2.o - t2.o || e2.i - t2.i || 0;
      }
      function s(e2) {
        return e2.charset;
      }
      function o(e2) {
        return e2.q > 0;
      }
    }, 27819, (e, t, r) => {
      "use strict";
      t.exports = a, t.exports.preferredEncodings = a;
      var n = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
      function i(e2, t2, r2) {
        var n2 = 0;
        if (t2.encoding.toLowerCase() === e2.toLowerCase()) n2 |= 1;
        else if ("*" !== t2.encoding) return null;
        return { encoding: e2, i: r2, o: t2.i, q: t2.q, s: n2 };
      }
      function a(e2, t2, r2) {
        var a2 = function(e3) {
          for (var t3 = e3.split(","), r3 = false, a3 = 1, s2 = 0, o2 = 0; s2 < t3.length; s2++) {
            var l2 = function(e4, t4) {
              var r4 = n.exec(e4);
              if (!r4) return null;
              var i2 = r4[1], a4 = 1;
              if (r4[2]) for (var s3 = r4[2].split(";"), o3 = 0; o3 < s3.length; o3++) {
                var l3 = s3[o3].trim().split("=");
                if ("q" === l3[0]) {
                  a4 = parseFloat(l3[1]);
                  break;
                }
              }
              return { encoding: i2, q: a4, i: t4 };
            }(t3[s2].trim(), s2);
            l2 && (t3[o2++] = l2, r3 = r3 || i("identity", l2), a3 = Math.min(a3, l2.q || 1));
          }
          return r3 || (t3[o2++] = { encoding: "identity", q: a3, i: s2 }), t3.length = o2, t3;
        }(e2 || ""), d = r2 ? function(e3, t3) {
          if (e3.q !== t3.q) return t3.q - e3.q;
          var n2 = r2.indexOf(e3.encoding), i2 = r2.indexOf(t3.encoding);
          return -1 === n2 && -1 === i2 ? t3.s - e3.s || e3.o - t3.o || e3.i - t3.i : -1 !== n2 && -1 !== i2 ? n2 - i2 : -1 === n2 ? 1 : -1;
        } : s;
        if (!t2) return a2.filter(l).sort(d).map(o);
        var u = t2.map(function(e3, t3) {
          for (var r3 = { encoding: e3, o: -1, q: 0, s: 0 }, n2 = 0; n2 < a2.length; n2++) {
            var s2 = i(e3, a2[n2], t3);
            s2 && 0 > (r3.s - s2.s || r3.q - s2.q || r3.o - s2.o) && (r3 = s2);
          }
          return r3;
        });
        return u.filter(l).sort(d).map(function(e3) {
          return t2[u.indexOf(e3)];
        });
      }
      function s(e2, t2) {
        return t2.q - e2.q || t2.s - e2.s || e2.o - t2.o || e2.i - t2.i;
      }
      function o(e2) {
        return e2.encoding;
      }
      function l(e2) {
        return e2.q > 0;
      }
    }, 1980, (e, t, r) => {
      "use strict";
      t.exports = a, t.exports.preferredLanguages = a;
      var n = /^\s*([^\s\-;]+)(?:-([^\s;]+))?\s*(?:;(.*))?$/;
      function i(e2, t2) {
        var r2 = n.exec(e2);
        if (!r2) return null;
        var i2 = r2[1], a2 = r2[2], s2 = i2;
        a2 && (s2 += "-" + a2);
        var o2 = 1;
        if (r2[3]) for (var l2 = r2[3].split(";"), d = 0; d < l2.length; d++) {
          var u = l2[d].split("=");
          "q" === u[0] && (o2 = parseFloat(u[1]));
        }
        return { prefix: i2, suffix: a2, q: o2, i: t2, full: s2 };
      }
      function a(e2, t2) {
        var r2 = function(e3) {
          for (var t3 = e3.split(","), r3 = 0, n3 = 0; r3 < t3.length; r3++) {
            var a2 = i(t3[r3].trim(), r3);
            a2 && (t3[n3++] = a2);
          }
          return t3.length = n3, t3;
        }(void 0 === e2 ? "*" : e2 || "");
        if (!t2) return r2.filter(l).sort(s).map(o);
        var n2 = t2.map(function(e3, t3) {
          for (var n3 = { o: -1, q: 0, s: 0 }, a2 = 0; a2 < r2.length; a2++) {
            var s2 = function(e4, t4, r3) {
              var n4 = i(e4);
              if (!n4) return null;
              var a3 = 0;
              if (t4.full.toLowerCase() === n4.full.toLowerCase()) a3 |= 4;
              else if (t4.prefix.toLowerCase() === n4.full.toLowerCase()) a3 |= 2;
              else if (t4.full.toLowerCase() === n4.prefix.toLowerCase()) a3 |= 1;
              else if ("*" !== t4.full) return null;
              return { i: r3, o: t4.i, q: t4.q, s: a3 };
            }(e3, r2[a2], t3);
            s2 && 0 > (n3.s - s2.s || n3.q - s2.q || n3.o - s2.o) && (n3 = s2);
          }
          return n3;
        });
        return n2.filter(l).sort(s).map(function(e3) {
          return t2[n2.indexOf(e3)];
        });
      }
      function s(e2, t2) {
        return t2.q - e2.q || t2.s - e2.s || e2.o - t2.o || e2.i - t2.i || 0;
      }
      function o(e2) {
        return e2.full;
      }
      function l(e2) {
        return e2.q > 0;
      }
    }, 84974, (e, t, r) => {
      "use strict";
      t.exports = a, t.exports.preferredMediaTypes = a;
      var n = /^\s*([^\s\/;]+)\/([^;\s]+)\s*(?:;(.*))?$/;
      function i(e2, t2) {
        var r2 = n.exec(e2);
        if (!r2) return null;
        var i2 = /* @__PURE__ */ Object.create(null), a2 = 1, s2 = r2[2], o2 = r2[1];
        if (r2[3]) for (var l2 = function(e3) {
          for (var t3 = e3.split(";"), r3 = 1, n2 = 0; r3 < t3.length; r3++) d(t3[n2]) % 2 == 0 ? t3[++n2] = t3[r3] : t3[n2] += ";" + t3[r3];
          t3.length = n2 + 1;
          for (var r3 = 0; r3 < t3.length; r3++) t3[r3] = t3[r3].trim();
          return t3;
        }(r2[3]).map(u), c = 0; c < l2.length; c++) {
          var h = l2[c], f = h[0].toLowerCase(), p = h[1], _ = p && '"' === p[0] && '"' === p[p.length - 1] ? p.slice(1, -1) : p;
          if ("q" === f) {
            a2 = parseFloat(_);
            break;
          }
          i2[f] = _;
        }
        return { type: o2, subtype: s2, params: i2, q: a2, i: t2 };
      }
      function a(e2, t2) {
        var r2 = function(e3) {
          for (var t3 = function(e4) {
            for (var t4 = e4.split(","), r4 = 1, n4 = 0; r4 < t4.length; r4++) d(t4[n4]) % 2 == 0 ? t4[++n4] = t4[r4] : t4[n4] += "," + t4[r4];
            return t4.length = n4 + 1, t4;
          }(e3), r3 = 0, n3 = 0; r3 < t3.length; r3++) {
            var a2 = i(t3[r3].trim(), r3);
            a2 && (t3[n3++] = a2);
          }
          return t3.length = n3, t3;
        }(void 0 === e2 ? "*/*" : e2 || "");
        if (!t2) return r2.filter(l).sort(s).map(o);
        var n2 = t2.map(function(e3, t3) {
          for (var n3 = { o: -1, q: 0, s: 0 }, a2 = 0; a2 < r2.length; a2++) {
            var s2 = function(e4, t4, r3) {
              var n4 = i(e4), a3 = 0;
              if (!n4) return null;
              if (t4.type.toLowerCase() == n4.type.toLowerCase()) a3 |= 4;
              else if ("*" != t4.type) return null;
              if (t4.subtype.toLowerCase() == n4.subtype.toLowerCase()) a3 |= 2;
              else if ("*" != t4.subtype) return null;
              var s3 = Object.keys(t4.params);
              if (s3.length > 0) if (!s3.every(function(e5) {
                return "*" == t4.params[e5] || (t4.params[e5] || "").toLowerCase() == (n4.params[e5] || "").toLowerCase();
              })) return null;
              else a3 |= 1;
              return { i: r3, o: t4.i, q: t4.q, s: a3 };
            }(e3, r2[a2], t3);
            s2 && 0 > (n3.s - s2.s || n3.q - s2.q || n3.o - s2.o) && (n3 = s2);
          }
          return n3;
        });
        return n2.filter(l).sort(s).map(function(e3) {
          return t2[n2.indexOf(e3)];
        });
      }
      function s(e2, t2) {
        return t2.q - e2.q || t2.s - e2.s || e2.o - t2.o || e2.i - t2.i || 0;
      }
      function o(e2) {
        return e2.type + "/" + e2.subtype;
      }
      function l(e2) {
        return e2.q > 0;
      }
      function d(e2) {
        for (var t2 = 0, r2 = 0; -1 !== (r2 = e2.indexOf('"', r2)); ) t2++, r2++;
        return t2;
      }
      function u(e2) {
        var t2, r2, n2 = e2.indexOf("=");
        return -1 === n2 ? t2 = e2 : (t2 = e2.slice(0, n2), r2 = e2.slice(n2 + 1)), [t2, r2];
      }
    }, 29300, (e, t, r) => {
      "use strict";
      var n = e.r(15737), i = e.r(27819), a = e.r(1980), s = e.r(84974);
      function o(e2) {
        if (!(this instanceof o)) return new o(e2);
        this.request = e2;
      }
      t.exports = o, t.exports.Negotiator = o, o.prototype.charset = function(e2) {
        var t2 = this.charsets(e2);
        return t2 && t2[0];
      }, o.prototype.charsets = function(e2) {
        return n(this.request.headers["accept-charset"], e2);
      }, o.prototype.encoding = function(e2, t2) {
        var r2 = this.encodings(e2, t2);
        return r2 && r2[0];
      }, o.prototype.encodings = function(e2, t2) {
        return i(this.request.headers["accept-encoding"], e2, (t2 || {}).preferred);
      }, o.prototype.language = function(e2) {
        var t2 = this.languages(e2);
        return t2 && t2[0];
      }, o.prototype.languages = function(e2) {
        return a(this.request.headers["accept-language"], e2);
      }, o.prototype.mediaType = function(e2) {
        var t2 = this.mediaTypes(e2);
        return t2 && t2[0];
      }, o.prototype.mediaTypes = function(e2) {
        return s(this.request.headers.accept, e2);
      }, o.prototype.preferredCharset = o.prototype.charset, o.prototype.preferredCharsets = o.prototype.charsets, o.prototype.preferredEncoding = o.prototype.encoding, o.prototype.preferredEncodings = o.prototype.encodings, o.prototype.preferredLanguage = o.prototype.language, o.prototype.preferredLanguages = o.prototype.languages, o.prototype.preferredMediaType = o.prototype.mediaType, o.prototype.preferredMediaTypes = o.prototype.mediaTypes;
    }, 58217, (e) => {
      "use strict";
      let t, r, n, i, a, s, o;
      async function l() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      e.i(74398);
      let d = null;
      async function u() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        d || (d = l());
        let e10 = await d;
        if (null == e10 ? void 0 : e10.register) try {
          await e10.register();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      async function c(...e10) {
        let t10 = await l();
        try {
          var r10;
          await (null == t10 || null == (r10 = t10.onRequestError) ? void 0 : r10.call(t10, ...e10));
        } catch (e11) {
          console.error("Error in instrumentation.onRequestError:", e11);
        }
      }
      let h = null;
      function f() {
        return h || (h = u()), h;
      }
      function p(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== e.g.process && (process.env = e.g.process.env, e.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
          let t10 = new Proxy(function() {
          }, { get(t11, r10) {
            if ("then" === r10) return {};
            throw Object.defineProperty(Error(p(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(p(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(r10, n2, i2) {
            if ("function" == typeof i2[0]) return i2[0](t10);
            throw Object.defineProperty(Error(p(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => t10 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      f();
      class _ extends Error {
        constructor({ page: e10 }) {
          super(`The middleware "${e10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1177", enumerable: false, configurable: true });
        }
      }
      class g extends Error {
        constructor() {
          super("The request.page has been deprecated in favour of `URLPattern`.\n  Read more: https://nextjs.org/docs/messages/middleware-request-page\n  "), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1178", enumerable: false, configurable: true });
        }
      }
      class m extends Error {
        constructor() {
          super("The request.ua has been removed in favour of `userAgent` function.\n  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent\n  "), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1172", enumerable: false, configurable: true });
        }
      }
      let y = "x-prerender-revalidate", w = "x-prerender-revalidate-if-generated", v = ".meta", b = "x-next-cache-tags", x = "x-next-revalidated-tags", E = "_N_T_", C = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function S(e10) {
        var t10, r10, n2, i2, a2, s2 = [], o2 = 0;
        function l2() {
          for (; o2 < e10.length && /\s/.test(e10.charAt(o2)); ) o2 += 1;
          return o2 < e10.length;
        }
        for (; o2 < e10.length; ) {
          for (t10 = o2, a2 = false; l2(); ) if ("," === (r10 = e10.charAt(o2))) {
            for (n2 = o2, o2 += 1, l2(), i2 = o2; o2 < e10.length && "=" !== (r10 = e10.charAt(o2)) && ";" !== r10 && "," !== r10; ) o2 += 1;
            o2 < e10.length && "=" === e10.charAt(o2) ? (a2 = true, o2 = i2, s2.push(e10.substring(t10, n2)), t10 = o2) : o2 = n2 + 1;
          } else o2 += 1;
          (!a2 || o2 >= e10.length) && s2.push(e10.substring(t10, e10.length));
        }
        return s2;
      }
      function R(e10) {
        let t10 = {}, r10 = [];
        if (e10) for (let [n2, i2] of e10.entries()) "set-cookie" === n2.toLowerCase() ? (r10.push(...S(i2)), t10[n2] = 1 === r10.length ? r10[0] : r10) : t10[n2] = i2;
        return t10;
      }
      function T(e10) {
        try {
          return String(new URL(String(e10)));
        } catch (t10) {
          throw Object.defineProperty(Error(`URL is malformed "${String(e10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t10 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...C, GROUP: { builtinReact: [C.reactServerComponents, C.actionBrowser], serverOnly: [C.reactServerComponents, C.actionBrowser, C.instrument, C.middleware], neutralTarget: [C.apiNode, C.apiEdge], clientOnly: [C.serverSideRendering, C.appPagesBrowser], bundled: [C.reactServerComponents, C.actionBrowser, C.serverSideRendering, C.appPagesBrowser, C.shared, C.instrument, C.middleware], appPages: [C.reactServerComponents, C.serverSideRendering, C.appPagesBrowser, C.actionBrowser] } });
      let O = Symbol("response"), P = Symbol("passThrough"), A = Symbol("waitUntil");
      class k {
        constructor(e10, t10) {
          this[P] = false, this[A] = t10 ? { kind: "external", function: t10 } : { kind: "internal", promises: [] };
        }
        respondWith(e10) {
          this[O] || (this[O] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[P] = true;
        }
        waitUntil(e10) {
          if ("external" === this[A].kind) return (0, this[A].function)(e10);
          this[A].promises.push(e10);
        }
      }
      class N extends k {
        constructor(e10) {
          var t10;
          super(e10.request, null == (t10 = e10.context) ? void 0 : t10.waitUntil), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new _({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new _({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function L(e10) {
        return 47 === e10.charCodeAt(e10.length - 1) && e10.length > 1 ? e10.slice(0, -1) : e10;
      }
      function M(e10) {
        let t10 = e10.indexOf("#"), r10 = e10.indexOf("?"), n2 = r10 > -1 && (t10 < 0 || r10 < t10);
        return n2 || t10 > -1 ? { pathname: e10.substring(0, n2 ? r10 : t10), query: n2 ? e10.substring(r10, t10 > -1 ? t10 : void 0) : "", hash: t10 > -1 ? e10.slice(t10) : "" } : { pathname: e10, query: "", hash: "" };
      }
      function I(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: n2, hash: i2 } = M(e10);
        return `${t10}${r10}${n2}${i2}`;
      }
      function q(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: n2, hash: i2 } = M(e10);
        return `${r10}${t10}${n2}${i2}`;
      }
      function D(e10, t10) {
        if ("string" != typeof e10) return false;
        let { pathname: r10 } = M(e10);
        return r10 === t10 || r10.startsWith(t10 + "/");
      }
      let j = /* @__PURE__ */ new WeakMap();
      function U(e10, t10) {
        let r10;
        if (!t10) return { pathname: e10 };
        let n2 = j.get(t10);
        n2 || (n2 = t10.map((e11) => e11.toLowerCase()), j.set(t10, n2));
        let i2 = e10.split("/", 2);
        if (!i2[1]) return { pathname: e10 };
        let a2 = i2[1].toLowerCase(), s2 = n2.indexOf(a2);
        return s2 < 0 ? { pathname: e10 } : (r10 = t10[s2], { pathname: e10 = e10.slice(r10.length + 1) || "/", detectedLocale: r10 });
      }
      let B = /^(?:127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)$/;
      function G(e10, t10) {
        let r10 = new URL(String(e10), t10 && String(t10));
        return B.test(r10.hostname) && (r10.hostname = "localhost"), r10;
      }
      let H = Symbol("NextURLInternal");
      class $ {
        constructor(e10, t10, r10) {
          let n2, i2;
          "object" == typeof t10 && "pathname" in t10 || "string" == typeof t10 ? (n2 = t10, i2 = r10 || {}) : i2 = r10 || t10 || {}, this[H] = { url: G(e10, n2 ?? i2.base), options: i2, basePath: "" }, this.analyze();
        }
        analyze() {
          var e10, t10, r10, n2, i2;
          let a2 = function(e11, t11) {
            let { basePath: r11, i18n: n3, trailingSlash: i3 } = t11.nextConfig ?? {}, a3 = { pathname: e11, trailingSlash: "/" !== e11 ? e11.endsWith("/") : i3 };
            r11 && D(a3.pathname, r11) && (a3.pathname = function(e12, t12) {
              if (!D(e12, t12)) return e12;
              let r12 = e12.slice(t12.length);
              return r12.startsWith("/") ? r12 : `/${r12}`;
            }(a3.pathname, r11), a3.basePath = r11);
            let s3 = a3.pathname;
            if (a3.pathname.startsWith("/_next/data/") && a3.pathname.endsWith(".json")) {
              let e12 = a3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              a3.buildId = e12[0], s3 = "index" !== e12[1] ? `/${e12.slice(1).join("/")}` : "/", true === t11.parseData && (a3.pathname = s3);
            }
            if (n3) {
              let e12 = t11.i18nProvider ? t11.i18nProvider.analyze(a3.pathname) : U(a3.pathname, n3.locales);
              a3.locale = e12.detectedLocale, a3.pathname = e12.pathname ?? a3.pathname, !e12.detectedLocale && a3.buildId && (e12 = t11.i18nProvider ? t11.i18nProvider.analyze(s3) : U(s3, n3.locales)).detectedLocale && (a3.locale = e12.detectedLocale);
            }
            return a3;
          }(this[H].url.pathname, { nextConfig: this[H].options.nextConfig, parseData: true, i18nProvider: this[H].options.i18nProvider }), s2 = function(e11, t11) {
            let r11;
            if (t11?.host && !Array.isArray(t11.host)) r11 = t11.host.toString().split(":", 1)[0];
            else {
              if (!e11.hostname) return;
              r11 = e11.hostname;
            }
            return r11.toLowerCase();
          }(this[H].url, this[H].options.headers);
          this[H].domainLocale = this[H].options.i18nProvider ? this[H].options.i18nProvider.detectDomainLocale(s2) : function(e11, t11, r11) {
            if (e11) {
              for (let n3 of (r11 && (r11 = r11.toLowerCase()), e11)) if (t11 === n3.domain?.split(":", 1)[0].toLowerCase() || r11 === n3.defaultLocale.toLowerCase() || n3.locales?.some((e12) => e12.toLowerCase() === r11)) return n3;
            }
          }(null == (t10 = this[H].options.nextConfig) || null == (e10 = t10.i18n) ? void 0 : e10.domains, s2);
          let o2 = (null == (r10 = this[H].domainLocale) ? void 0 : r10.defaultLocale) || (null == (i2 = this[H].options.nextConfig) || null == (n2 = i2.i18n) ? void 0 : n2.defaultLocale);
          this[H].url.pathname = a2.pathname, this[H].defaultLocale = o2, this[H].basePath = a2.basePath ?? "", this[H].buildId = a2.buildId, this[H].locale = a2.locale ?? o2, this[H].trailingSlash = a2.trailingSlash;
        }
        formatPathname() {
          var e10;
          let t10;
          return t10 = function(e11, t11, r10, n2) {
            if (!t11 || t11 === r10) return e11;
            let i2 = e11.toLowerCase();
            return !n2 && (D(i2, "/api") || D(i2, `/${t11.toLowerCase()}`)) ? e11 : I(e11, `/${t11}`);
          }((e10 = { basePath: this[H].basePath, buildId: this[H].buildId, defaultLocale: this[H].options.forceLocale ? void 0 : this[H].defaultLocale, locale: this[H].locale, pathname: this[H].url.pathname, trailingSlash: this[H].trailingSlash }).pathname, e10.locale, e10.buildId ? void 0 : e10.defaultLocale, e10.ignorePrefix), (e10.buildId || !e10.trailingSlash) && (t10 = L(t10)), e10.buildId && (t10 = q(I(t10, `/_next/data/${e10.buildId}`), "/" === e10.pathname ? "index.json" : ".json")), t10 = I(t10, e10.basePath), !e10.buildId && e10.trailingSlash ? t10.endsWith("/") ? t10 : q(t10, "/") : L(t10);
        }
        formatSearch() {
          return this[H].url.search;
        }
        get buildId() {
          return this[H].buildId;
        }
        set buildId(e10) {
          this[H].buildId = e10;
        }
        get locale() {
          return this[H].locale ?? "";
        }
        set locale(e10) {
          var t10, r10;
          if (!this[H].locale || !(null == (r10 = this[H].options.nextConfig) || null == (t10 = r10.i18n) ? void 0 : t10.locales.includes(e10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${e10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[H].locale = e10;
        }
        get defaultLocale() {
          return this[H].defaultLocale;
        }
        get domainLocale() {
          return this[H].domainLocale;
        }
        get searchParams() {
          return this[H].url.searchParams;
        }
        get host() {
          return this[H].url.host;
        }
        set host(e10) {
          this[H].url.host = e10;
        }
        get hostname() {
          return this[H].url.hostname;
        }
        set hostname(e10) {
          this[H].url.hostname = e10;
        }
        get port() {
          return this[H].url.port;
        }
        set port(e10) {
          this[H].url.port = e10;
        }
        get protocol() {
          return this[H].url.protocol;
        }
        set protocol(e10) {
          this[H].url.protocol = e10;
        }
        get href() {
          let e10 = this.formatPathname(), t10 = this.formatSearch();
          return `${this.protocol}//${this.host}${e10}${t10}${this.hash}`;
        }
        set href(e10) {
          this[H].url = G(e10), this.analyze();
        }
        get origin() {
          return this[H].url.origin;
        }
        get pathname() {
          return this[H].url.pathname;
        }
        set pathname(e10) {
          this[H].url.pathname = e10;
        }
        get hash() {
          return this[H].url.hash;
        }
        set hash(e10) {
          this[H].url.hash = e10;
        }
        get search() {
          return this[H].url.search;
        }
        set search(e10) {
          this[H].url.search = e10;
        }
        get password() {
          return this[H].url.password;
        }
        set password(e10) {
          this[H].url.password = e10;
        }
        get username() {
          return this[H].url.username;
        }
        set username(e10) {
          this[H].url.username = e10;
        }
        get basePath() {
          return this[H].basePath;
        }
        set basePath(e10) {
          this[H].basePath = e10.startsWith("/") ? e10 : `/${e10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new $(String(this), this[H].options);
        }
      }
      var F, z, V, K, W, X, Z, J, Y, Q, ee, et, er, en, ei, ea, es, eo, el, ed, eu = e.i(28042);
      let ec = Symbol("internal request");
      class eh extends Request {
        constructor(e10, t10 = {}) {
          const r10 = "string" != typeof e10 && "url" in e10 ? e10.url : String(e10);
          T(r10), e10 instanceof Request ? super(e10, t10) : super(r10, t10);
          const n2 = new $(r10, { headers: R(this.headers), nextConfig: t10.nextConfig });
          this[ec] = { cookies: new eu.RequestCookies(this.headers), nextUrl: n2, url: n2.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[ec].cookies;
        }
        get nextUrl() {
          return this[ec].nextUrl;
        }
        get page() {
          throw new g();
        }
        get ua() {
          throw new m();
        }
        get url() {
          return this[ec].url;
        }
      }
      class ef {
        static get(e10, t10, r10) {
          let n2 = Reflect.get(e10, t10, r10);
          return "function" == typeof n2 ? n2.bind(e10) : n2;
        }
        static set(e10, t10, r10, n2) {
          return Reflect.set(e10, t10, r10, n2);
        }
        static has(e10, t10) {
          return Reflect.has(e10, t10);
        }
        static deleteProperty(e10, t10) {
          return Reflect.deleteProperty(e10, t10);
        }
      }
      let ep = Symbol("internal response"), e_ = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function eg(e10, t10) {
        var r10;
        if (null == e10 || null == (r10 = e10.request) ? void 0 : r10.headers) {
          if (!(e10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let r11 = [];
          for (let [n2, i2] of e10.request.headers) t10.set("x-middleware-request-" + n2, i2), r11.push(n2);
          t10.set("x-middleware-override-headers", r11.join(","));
        }
      }
      class em extends Response {
        constructor(e10, t10 = {}) {
          super(e10, t10);
          const r10 = this.headers, n2 = new Proxy(new eu.ResponseCookies(r10), { get(e11, n3, i2) {
            switch (n3) {
              case "delete":
              case "set":
                return (...i3) => {
                  let a2 = Reflect.apply(e11[n3], e11, i3), s2 = new Headers(r10);
                  return a2 instanceof eu.ResponseCookies && r10.set("x-middleware-set-cookie", a2.getAll().map((e12) => (0, eu.stringifyCookie)(e12)).join(",")), eg(t10, s2), a2;
                };
              default:
                return ef.get(e11, n3, i2);
            }
          } });
          this[ep] = { cookies: n2, url: t10.url ? new $(t10.url, { headers: R(r10), nextConfig: t10.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[ep].cookies;
        }
        static json(e10, t10) {
          let r10 = Response.json(e10, t10);
          return new em(r10.body, r10);
        }
        static redirect(e10, t10) {
          let r10 = "number" == typeof t10 ? t10 : (null == t10 ? void 0 : t10.status) ?? 307;
          if (!e_.has(r10)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let n2 = "object" == typeof t10 ? t10 : {}, i2 = new Headers(null == n2 ? void 0 : n2.headers);
          return i2.set("Location", T(e10)), new em(null, { ...n2, headers: i2, status: r10 });
        }
        static rewrite(e10, t10) {
          let r10 = new Headers(null == t10 ? void 0 : t10.headers);
          return r10.set("x-middleware-rewrite", T(e10)), eg(t10, r10), new em(null, { ...t10, headers: r10 });
        }
        static next(e10) {
          let t10 = new Headers(null == e10 ? void 0 : e10.headers);
          return t10.set("x-middleware-next", "1"), eg(e10, t10), new em(null, { ...e10, headers: t10 });
        }
      }
      function ey(e10, t10) {
        let r10 = "string" == typeof t10 ? new URL(t10) : t10, n2 = new URL(e10, t10), i2 = n2.origin === r10.origin;
        return { url: i2 ? n2.toString().slice(r10.origin.length) : n2.toString(), isRelative: i2 };
      }
      let ew = "next-router-prefetch", ev = ["rsc", "next-router-state-tree", ew, "next-hmr-refresh", "next-router-segment-prefetch"], eb = "_rsc";
      function ex(e10) {
        return e10.startsWith("/") ? e10 : `/${e10}`;
      }
      function eE(e10) {
        return ex(e10.split("/").reduce((e11, t10, r10, n2) => t10 ? "(" === t10[0] && t10.endsWith(")") || "@" === t10[0] || ("page" === t10 || "route" === t10) && r10 === n2.length - 1 ? e11 : `${e11}/${t10}` : e11, ""));
      }
      class eC extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers"), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1176", enumerable: false, configurable: true });
        }
        static callable() {
          throw new eC();
        }
      }
      class eS extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t10, r10, n2) {
            if ("symbol" == typeof r10) return ef.get(t10, r10, n2);
            let i2 = r10.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === i2);
            if (void 0 !== a2) return ef.get(t10, a2, n2);
          }, set(t10, r10, n2, i2) {
            if ("symbol" == typeof r10) return ef.set(t10, r10, n2, i2);
            let a2 = r10.toLowerCase(), s2 = Object.keys(e10).find((e11) => e11.toLowerCase() === a2);
            return ef.set(t10, s2 ?? r10, n2, i2);
          }, has(t10, r10) {
            if ("symbol" == typeof r10) return ef.has(t10, r10);
            let n2 = r10.toLowerCase(), i2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 !== i2 && ef.has(t10, i2);
          }, deleteProperty(t10, r10) {
            if ("symbol" == typeof r10) return ef.deleteProperty(t10, r10);
            let n2 = r10.toLowerCase(), i2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 === i2 || ef.deleteProperty(t10, i2);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "append":
              case "delete":
              case "set":
                return eC.callable;
              default:
                return ef.get(e11, t10, r10);
            }
          } });
        }
        static fresh(e10) {
          return new Proxy(e10, { get: (e11, t10, r10) => ef.get(e11, t10, r10) });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new eS(e10);
        }
        append(e10, t10) {
          let r10 = this.headers[e10];
          "string" == typeof r10 ? this.headers[e10] = [r10, t10] : Array.isArray(r10) ? r10.push(t10) : this.headers[e10] = t10;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t10 = this.headers[e10];
          return void 0 !== t10 ? this.merge(t10) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t10) {
          this.headers[e10] = t10;
        }
        forEach(e10, t10) {
          for (let [r10, n2] of this.entries()) e10.call(t10, n2, r10, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase(), r10 = this.get(t10);
            yield [t10, r10];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase();
            yield t10;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = this.get(e10);
            yield t10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let eR = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class eT {
        disable() {
          throw eR;
        }
        getStore() {
        }
        run() {
          throw eR;
        }
        exit() {
          throw eR;
        }
        enterWith() {
          throw eR;
        }
        static bind(e10) {
          return e10;
        }
      }
      let eO = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function eP() {
        return eO ? new eO() : new eT();
      }
      let eA = eP();
      class ek extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options"), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1180", enumerable: false, configurable: true });
        }
        static callable() {
          throw new ek();
        }
      }
      class eN {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "clear":
              case "delete":
              case "set":
                return ek.callable;
              default:
                return ef.get(e11, t10, r10);
            }
          } });
        }
        static fresh(e10) {
          return new Proxy(e10, { get: (e11, t10, r10) => ef.get(e11, t10, r10) });
        }
      }
      let eL = Symbol.for("next.mutated.cookies");
      class eM {
        static wrap(e10, t10) {
          let r10 = new eu.ResponseCookies(new Headers());
          for (let t11 of e10.getAll()) r10.set(t11);
          let n2 = [], i2 = /* @__PURE__ */ new Set(), a2 = () => {
            let e11 = eA.getStore();
            if (e11 && (e11.pathWasRevalidated = 1), n2 = r10.getAll().filter((e12) => i2.has(e12.name)), t10) {
              let e12 = [];
              for (let t11 of n2) {
                let r11 = new eu.ResponseCookies(new Headers());
                r11.set(t11), e12.push(r11.toString());
              }
              t10(e12);
            }
          }, s2 = new Proxy(r10, { get(e11, t11, r11) {
            switch (t11) {
              case eL:
                return n2;
              case "delete":
                return function(...t12) {
                  i2.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.delete(...t12), s2;
                  } finally {
                    a2();
                  }
                };
              case "set":
                return function(...t12) {
                  i2.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.set(...t12), s2;
                  } finally {
                    a2();
                  }
                };
              default:
                return ef.get(e11, t11, r11);
            }
          } });
          return s2;
        }
      }
      function eI(e10, t10) {
        if ("action" !== e10.phase) throw new ek();
      }
      var eq = ((F = eq || {}).handleRequest = "BaseServer.handleRequest", F.run = "BaseServer.run", F.pipe = "BaseServer.pipe", F.getStaticHTML = "BaseServer.getStaticHTML", F.render = "BaseServer.render", F.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", F.renderToResponse = "BaseServer.renderToResponse", F.renderToHTML = "BaseServer.renderToHTML", F.renderError = "BaseServer.renderError", F.renderErrorToResponse = "BaseServer.renderErrorToResponse", F.renderErrorToHTML = "BaseServer.renderErrorToHTML", F.render404 = "BaseServer.render404", F), eD = ((z = eD || {}).loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", z.loadComponents = "LoadComponents.loadComponents", z), ej = ((V = ej || {}).getRequestHandler = "NextServer.getRequestHandler", V.getRequestHandlerWithMetadata = "NextServer.getRequestHandlerWithMetadata", V.getServer = "NextServer.getServer", V.getServerRequestHandler = "NextServer.getServerRequestHandler", V.createServer = "createServer.createServer", V), eU = ((K = eU || {}).compression = "NextNodeServer.compression", K.getBuildId = "NextNodeServer.getBuildId", K.createComponentTree = "NextNodeServer.createComponentTree", K.clientComponentLoading = "NextNodeServer.clientComponentLoading", K.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", K.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", K.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", K.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", K.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", K.sendRenderResult = "NextNodeServer.sendRenderResult", K.proxyRequest = "NextNodeServer.proxyRequest", K.runApi = "NextNodeServer.runApi", K.render = "NextNodeServer.render", K.renderHTML = "NextNodeServer.renderHTML", K.imageOptimizer = "NextNodeServer.imageOptimizer", K.getPagePath = "NextNodeServer.getPagePath", K.getRoutesManifest = "NextNodeServer.getRoutesManifest", K.findPageComponents = "NextNodeServer.findPageComponents", K.getFontManifest = "NextNodeServer.getFontManifest", K.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", K.getRequestHandler = "NextNodeServer.getRequestHandler", K.renderToHTML = "NextNodeServer.renderToHTML", K.renderError = "NextNodeServer.renderError", K.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", K.render404 = "NextNodeServer.render404", K.startResponse = "NextNodeServer.startResponse", K.route = "route", K.onProxyReq = "onProxyReq", K.apiResolver = "apiResolver", K.internalFetch = "internalFetch", K), eB = ((W = eB || {}).startServer = "startServer.startServer", W), eG = ((X = eG || {}).getServerSideProps = "Render.getServerSideProps", X.getStaticProps = "Render.getStaticProps", X.renderToString = "Render.renderToString", X.renderDocument = "Render.renderDocument", X.createBodyResult = "Render.createBodyResult", X), eH = ((Z = eH || {}).renderToString = "AppRender.renderToString", Z.renderToReadableStream = "AppRender.renderToReadableStream", Z.getBodyResult = "AppRender.getBodyResult", Z.fetch = "AppRender.fetch", Z.waitShellReady = "AppRender.waitShellReady", Z.renderToNodeFizzStream = "AppRender.renderToNodeFizzStream", Z.instantInsights = "AppRender.instantInsights", Z.instantInsightsPrepareValidation = "AppRender.instantInsights.prepareValidation", Z.instantInsightsRunValidation = "AppRender.instantInsights.runValidation", Z), e$ = ((J = e$ || {}).executeRoute = "Router.executeRoute", J), eF = ((Y = eF || {}).runHandler = "Node.runHandler", Y), ez = ((Q = ez || {}).runHandler = "AppRouteRouteHandlers.runHandler", Q), eV = ((ee = eV || {}).generateMetadata = "ResolveMetadata.generateMetadata", ee.generateViewport = "ResolveMetadata.generateViewport", ee), eK = ((et = eK || {}).execute = "Middleware.execute", et);
      let eW = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), eX = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function eZ(e10) {
        return null !== e10 && "object" == typeof e10 && "then" in e10 && "function" == typeof e10.then;
      }
      let eJ = process.env.NEXT_OTEL_PERFORMANCE_PREFIX;
      function eY() {
      }
      Symbol.for("@next/local-span-recorder");
      let { context: eQ, propagation: e0, trace: e1, SpanStatusCode: e3, SpanKind: e2, ROOT_CONTEXT: e4 } = t = e.r(11646);
      class e5 extends Error {
        constructor(e10, t10) {
          super(), this.bubble = e10, this.result = t10;
        }
      }
      let e9 = (e10, t10) => {
        "object" == typeof t10 && null !== t10 && t10 instanceof e5 && t10.bubble ? e10.setAttribute("next.bubble", true) : (t10 && (e10.recordException(t10), e10.setAttribute("error.type", t10.name)), e10.setStatus({ code: e3.ERROR, message: null == t10 ? void 0 : t10.message })), e10.end();
      }, e6 = /* @__PURE__ */ new Map(), e7 = t.createContextKey("next.rootSpanId"), e8 = 0, te = { set(e10, t10, r10) {
        e10.push({ key: t10, value: r10 });
      } }, tt = (i = new class e {
        getTracerInstance() {
          return e1.getTracer("next.js", "0.0.1");
        }
        isOpenTelemetryEnabled() {
          var e10, t10;
          let r10 = e1.getSpan(eQ.active());
          if (null == r10 ? void 0 : r10.isRecording()) return true;
          let n2 = e1.getTracerProvider();
          return !("getDelegate" in n2) || (null == n2.getDelegate || null == (t10 = n2.getDelegate.call(n2)) || null == (e10 = t10.constructor) ? void 0 : e10.name) !== "NoopTracerProvider";
        }
        getContext() {
          return eQ;
        }
        getTracePropagationData() {
          let e10 = eQ.active(), t10 = [];
          return e0.inject(e10, t10, te), t10;
        }
        getActiveScopeSpan() {
          let e10 = eY(), t10 = null == e10 ? void 0 : e10.getActiveLocalSpan();
          return t10 && (null == e10 ? void 0 : e10.isOpenTelemetryIsolatedSpan(t10)) ? t10 : e1.getSpan(eQ.active());
        }
        runWithDetachedContext(e10) {
          return eJ || this.isOpenTelemetryEnabled() ? eQ.with(e4, e10) : e10();
        }
        withPropagatedContext(e10, t10, r10, n2 = false) {
          let i2 = eQ.active();
          if (!eJ && !this.isOpenTelemetryEnabled() && !e1.getSpanContext(i2)) return t10();
          if (n2) {
            let n3 = e0.extract(e4, e10, r10);
            if (e1.getSpanContext(n3)) return eQ.with(n3, t10);
            let a3 = e0.extract(i2, e10, r10);
            return eQ.with(a3, t10);
          }
          if (e1.getSpanContext(i2)) return t10();
          let a2 = e0.extract(i2, e10, r10);
          return eQ.with(a2, t10);
        }
        trace(...e10) {
          let [t10, r10, n2] = e10, i2 = !!eJ || this.isOpenTelemetryEnabled(), a2 = eY(), s2 = (null == a2 ? void 0 : a2.isLocalSpanRecordingEnabled()) ?? false;
          if (!i2 && !s2) return "function" == typeof r10 ? r10() : n2();
          let { fn: o2, options: l2 } = "function" == typeof r10 ? { fn: r10, options: {} } : { fn: n2, options: { ...r10 } }, d2 = l2.spanName ?? t10, u2 = l2.parentSpan ?? this.getActiveScopeSpan(), c2 = u2 && (null == a2 ? void 0 : a2.isOpenTelemetryIsolatedSpan(u2)) ? u2 : void 0, h2 = !c2 && (eW.has(t10) || "1" === process.env.NEXT_OTEL_VERBOSE);
          if (!(h2 || (null == a2 ? void 0 : a2.isRequestInsightsEnabled())) || l2.hideSpan) return o2();
          let f2 = c2 ? eQ.active() : this.getSpanContext(u2);
          f2 || (f2 = (null == eQ ? void 0 : eQ.active()) ?? e4);
          let p2 = f2.getValue(e7), _2 = "number" != typeof p2 || !e6.has(p2), g2 = e8++;
          return l2.attributes = { "next.span_category": "nextjs", "next.span_name": d2, "next.span_type": t10, ...l2.attributes }, eQ.with(f2.setValue(e7, g2), () => this.runWithActiveSpan(d2, l2, f2, i2 && h2, s2, c2, (e11) => {
            let r11;
            eJ && t10 && eX.has(t10) && (r11 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let n3 = false, i3 = () => {
              !n3 && (n3 = true, e6.delete(g2), r11 && performance.measure(`${eJ}:next-${(t10.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: r11, end: performance.now() }));
            };
            if (_2 && e6.set(g2, new Map(Object.entries(l2.attributes ?? {}))), o2.length > 1) try {
              return o2(e11, (t11) => {
                t11 ? e9(e11, t11) : e11.end();
              });
            } catch (t11) {
              throw e9(e11, t11), t11;
            } finally {
              i3();
            }
            try {
              let t11 = o2(e11);
              if (eZ(t11)) return t11.then((t12) => (e11.end(), t12)).catch((t12) => {
                throw e9(e11, t12), t12;
              }).finally(i3);
              return e11.end(), i3(), t11;
            } catch (t11) {
              throw e9(e11, t11), i3(), t11;
            }
          }));
        }
        runWithActiveSpan(e10, t10, r10, n2, i2, a2, s2) {
          if (n2) return this.getTracerInstance().startActiveSpan(e10, t10, (n3) => s2(i2 ? this.createLocalRecordingSpan(e10, t10, r10, n3, a2) : n3));
          let o2 = this.createLocalRecordingSpan(e10, t10, r10, void 0, a2), l2 = eY();
          return l2.withLocalSpan(o2, () => l2.isOpenTelemetryIsolatedSpan(o2) ? s2(o2) : eQ.with(e1.setSpan(eQ.active(), o2), s2, void 0, o2));
        }
        createLocalRecordingSpan(e10, t10, r10, n2, i2) {
          let a2 = (null == i2 ? void 0 : i2.spanContext()) ?? e1.getSpanContext(r10), s2 = null == n2 ? void 0 : n2.spanContext();
          return eY().createLocalSpan({ name: e10, attributes: t10.attributes, links: t10.links, startTime: t10.startTime, delegateSpan: n2, traceId: (null == s2 ? void 0 : s2.traceId) ?? (null == a2 ? void 0 : a2.traceId), spanId: null == s2 ? void 0 : s2.spanId, parentSpanId: null == a2 ? void 0 : a2.spanId, isolateOpenTelemetry: void 0 !== i2 });
        }
        wrap(...e10) {
          let t10 = this, [r10, n2, i2] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return eW.has(r10) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = n2;
            "function" == typeof e11 && "function" == typeof i2 && (e11 = e11.apply(this, arguments));
            let a2 = arguments.length - 1, s2 = arguments[a2];
            if ("function" != typeof s2) return t10.trace(r10, e11, () => i2.apply(this, arguments));
            {
              let n3 = t10.getContext().bind(eQ.active(), s2);
              return t10.trace(r10, e11, (e12, t11) => (arguments[a2] = function(e13) {
                return null == t11 || t11(e13), n3.apply(this, arguments);
              }, i2.apply(this, arguments)));
            }
          } : i2;
        }
        startSpan(...e10) {
          let [t10, r10] = e10, n2 = r10 ? { ...r10, attributes: { "next.span_category": "nextjs", ...r10.attributes } } : { attributes: { "next.span_category": "nextjs" } }, i2 = eY(), a2 = n2.parentSpan ?? this.getActiveScopeSpan(), s2 = a2 && (null == i2 ? void 0 : i2.isOpenTelemetryIsolatedSpan(a2)) ? a2 : void 0, o2 = (s2 ? void 0 : this.getSpanContext(a2)) ?? eQ.active();
          if (!(null == i2 ? void 0 : i2.isLocalSpanRecordingEnabled())) return this.getTracerInstance().startSpan(t10, n2, o2);
          let l2 = !s2 && this.isOpenTelemetryEnabled() ? this.getTracerInstance().startSpan(t10, n2, o2) : void 0;
          return this.createLocalRecordingSpan(t10, n2, o2, l2, s2);
        }
        getSpanContext(e10) {
          return e10 ? e1.setSpan(eQ.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = eQ.active().getValue(e7);
          return e6.get(e10);
        }
        setRootSpanAttribute(e10, t10) {
          let r10 = eQ.active().getValue(e7), n2 = e6.get(r10);
          n2 && !n2.has(e10) && n2.set(e10, t10);
        }
        withSpan(e10, t10) {
          let r10 = eY();
          return (null == r10 ? void 0 : r10.isLocalRecordingSpan(e10)) ? r10.withLocalSpan(e10, () => r10.isOpenTelemetryIsolatedSpan(e10) ? t10() : eQ.with(e1.setSpan(eQ.active(), e10), t10)) : eQ.with(e1.setSpan(eQ.active(), e10), t10);
        }
      }(), () => i), tr = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(tr);
      class tn {
        constructor(e10, t10, r10, n2) {
          var i2;
          const a2 = e10 && function(e11, t11) {
            if ("function" == typeof e11.get) {
              let r11 = eS.from(e11);
              return { isOnDemandRevalidate: r11.get(y) === t11.previewModeId, revalidateOnlyGenerated: r11.has(w) };
            }
            return { isOnDemandRevalidate: e11[y] === t11.previewModeId, revalidateOnlyGenerated: e11.hasOwnProperty(w) };
          }(t10, e10).isOnDemandRevalidate, s2 = null == (i2 = r10.get(tr)) ? void 0 : i2.value;
          this._isEnabled = !!(!a2 && s2 && e10 && s2 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = n2;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: tr, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: tr, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function ti(e10, t10) {
        if ("x-middleware-set-cookie" in e10 && "string" == typeof e10["x-middleware-set-cookie"]) {
          let r10 = e10["x-middleware-set-cookie"], n2 = new Headers();
          for (let e11 of S(r10)) n2.append("set-cookie", e11);
          for (let e11 of new eu.ResponseCookies(n2).getAll()) t10.set(e11);
        }
      }
      let ta = eP();
      function ts(e10) {
        switch (e10.type) {
          case "request":
          case "prerender":
          case "prerender-runtime":
          case "prerender-client":
          case "validation-client":
          case "prerender-ppr":
            return e10.resumeDataCache;
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "prerender-legacy":
          case "generate-static-params":
            return null;
          default:
            return e10;
        }
      }
      var to = e.i(99734);
      class tl extends Error {
        constructor(e10, t10) {
          super(`Invariant: ${e10.endsWith(".") ? e10 : e10 + "."} This is a bug in Next.js.`, t10), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1179", enumerable: false, configurable: true }), this.name = "InvariantError";
        }
      }
      var td = e.i(51615);
      process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let tu = Symbol.for("@next/cache-handlers-map"), tc = Symbol.for("@next/cache-handlers-set");
      Symbol.for("@next/cache-handlers-private"), Symbol.for("@next/cache-handlers-dev-fronts"), Symbol.for("@next/cache-handlers-dev-tiered"), Symbol.for("@next/cache-handlers-memory-disabled");
      let th = globalThis;
      function tf() {
        let e10 = th[tu];
        if (e10) return e10.entries();
      }
      async function tp(e10, t10) {
        if (!e10) return t10();
        let r10 = t_(e10);
        try {
          return await t10();
        } finally {
          var n2, i2, a2, s2;
          let t11, o2, l2, d2, u2 = (n2 = r10, i2 = t_(e10), t11 = new Set(n2.pendingRevalidatedTags.map((e11) => {
            let t12 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return `${e11.tag}:${t12}`;
          })), o2 = new Set(n2.pendingRevalidateWrites), { pendingRevalidatedTags: i2.pendingRevalidatedTags.filter((e11) => {
            let r11 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return !t11.has(`${e11.tag}:${r11}`);
          }), pendingRevalidates: Object.fromEntries(Object.entries(i2.pendingRevalidates).filter(([e11]) => !(e11 in n2.pendingRevalidates))), pendingRevalidateWrites: i2.pendingRevalidateWrites.filter((e11) => !o2.has(e11)) });
          await (a2 = e10, l2 = [], (d2 = (null == (s2 = u2) ? void 0 : s2.pendingRevalidatedTags) ?? a2.pendingRevalidatedTags ?? []).length > 0 && l2.push(tg(d2, a2.incrementalCache, a2)), l2.push(...Object.values((null == s2 ? void 0 : s2.pendingRevalidates) ?? a2.pendingRevalidates ?? {})), l2.push(...(null == s2 ? void 0 : s2.pendingRevalidateWrites) ?? a2.pendingRevalidateWrites ?? []), 0 !== l2.length && Promise.all(l2).then(() => void 0));
        }
      }
      function t_(e10) {
        return { pendingRevalidatedTags: e10.pendingRevalidatedTags ? [...e10.pendingRevalidatedTags] : [], pendingRevalidates: { ...e10.pendingRevalidates }, pendingRevalidateWrites: e10.pendingRevalidateWrites ? [...e10.pendingRevalidateWrites] : [] };
      }
      async function tg(e10, t10, r10) {
        if (0 === e10.length) return;
        let n2 = function() {
          let e11 = th[tc];
          if (e11) return e11.values();
        }(), i2 = [], a2 = /* @__PURE__ */ new Map();
        for (let t11 of e10) {
          let e11, r11 = t11.profile;
          for (let [t12] of a2) if ("string" == typeof t12 && "string" == typeof r11 && t12 === r11 || "object" == typeof t12 && "object" == typeof r11 && JSON.stringify(t12) === JSON.stringify(r11) || t12 === r11) {
            e11 = t12;
            break;
          }
          let n3 = e11 || r11;
          a2.has(n3) || a2.set(n3, []), a2.get(n3).push(t11.tag);
        }
        for (let [e11, s2] of a2) {
          let a3;
          if (e11) {
            let t11;
            if ("object" == typeof e11) t11 = e11;
            else if ("string" == typeof e11 && !(t11 = null == r10 ? void 0 : r10.cacheLifeProfiles[e11])) throw Object.defineProperty(Error(`Invalid profile provided "${e11}" must be configured under cacheLife in next.config or be "max"`), "__NEXT_ERROR_CODE", { value: "E873", enumerable: false, configurable: true });
            t11 && (a3 = { expire: t11.expire });
          }
          for (let t11 of n2 || []) e11 ? i2.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, s2, a3)) : i2.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, s2));
          t10 && i2.push(t10.revalidateTag(s2, a3));
        }
        await Promise.all(i2);
      }
      let tm = eP();
      class ty {
        constructor({ waitUntil: e10, onClose: t10, onTaskError: r10 }) {
          this.isRequestClosed = false, this.initialOnCloseError = null, this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = e10, this.onClose = t10, this.onTaskError = r10, this.callbackQueue = new to.default(), this.callbackQueue.pause();
          try {
            t10(() => {
              for (let e11 of (this.isRequestClosed = true, this.workUnitStores)) e11.phase = "after";
            });
          } catch (e11) {
            this.initialOnCloseError = { error: e11 };
          }
        }
        after(e10, t10) {
          if (this.initialOnCloseError) throw Object.defineProperty(new tl("An onClose call failed, which means after() can't work correctly.", { cause: this.initialOnCloseError.error }), "__NEXT_ERROR_CODE", { value: "E1376", enumerable: false, configurable: true });
          if (this.workUnitStores.add(t10), eZ(e10)) this.addThenable(e10);
          else if ("function" == typeof e10) this.addCallback(e10, t10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addThenable(e10) {
          this.waitUntil || tw(), this.waitUntil(new Promise((t10) => {
            e10.then(() => {
              t10();
            }, (e11) => {
              t10(), this.reportTaskError("promise", e11);
            });
          }));
        }
        addCallback(e10, t10) {
          var r10;
          this.waitUntil || tw();
          let n2 = tm.getStore(), i2 = n2 ? n2.rootTaskSpawnPhase : t10.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let a2 = (r10 = async () => {
            try {
              await tm.run({ rootTaskSpawnPhase: i2 }, () => e10());
            } catch (e11) {
              this.reportTaskError("function", e11);
            }
          }, eO ? eO.bind(r10) : eT.bind(r10));
          this.callbackQueue.add(a2);
        }
        async runCallbacksOnClose() {
          return this.isRequestClosed ? await new Promise((e10) => {
            setTimeout(e10, 0);
          }) : await new Promise((e10) => this.onClose(e10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          let e10 = eA.getStore();
          if (!e10) throw Object.defineProperty(new tl("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return tp(e10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(e10, t10) {
          if (console.error("promise" === e10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", t10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, t10);
          } catch (e11) {
            console.error(Object.defineProperty(new tl("`onTaskError` threw while handling an error thrown from an `after` task", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function tw() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function tv(e10) {
        let t10, r10 = { then: (n2, i2) => (t10 || (t10 = Promise.resolve(e10())), t10.then((e11) => {
          r10.value = e11;
        }).catch(() => {
        }), t10.then(n2, i2)) };
        return r10;
      }
      class tb {
        onClose(e10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", e10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function tx() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let tE = Symbol.for("@next/request-context"), tC = /[^\t\x20-\x7e]/, tS = /[^\t\x20-\x7e]+/g;
      function tR(e10) {
        return tC.test(e10) ? e10.replace(tS, (e11) => encodeURIComponent(e11)) : e10;
      }
      async function tT(e10, t10, r10) {
        let n2 = /* @__PURE__ */ new Set();
        for (let t11 of ((e11) => {
          let t12 = ["/layout"];
          if (e11.startsWith("/")) {
            let r11 = e11.indexOf("/", 1);
            for (; ; ) {
              -1 === r11 && (r11 = e11.length);
              let n3 = e11.slice(0, r11);
              if (n3 && (n3.endsWith("/page") || n3.endsWith("/route") || (n3 = `${n3}${!n3.endsWith("/") ? "/" : ""}layout`), t12.push(n3)), r11 === e11.length) break;
              r11 = e11.indexOf("/", r11 + 1);
            }
          }
          return t12;
        })(e10)) t11 = tR(`${E}${t11}`), n2.add(t11);
        if (t10 && (!r10 || 0 === r10.size)) {
          let e11 = tR(`${E}${t10}`);
          n2.add(e11);
        }
        n2.has(`${E}/`) && n2.add(`${E}/index`), n2.has(`${E}/index`) && n2.add(`${E}/`);
        let i2 = Array.from(n2);
        return { tags: i2, expirationsByCacheKind: function(e11) {
          let t11 = /* @__PURE__ */ new Map(), r11 = tf();
          if (r11) for (let [n3, i3] of r11) "getExpiration" in i3 && t11.set(n3, tv(async () => i3.getExpiration(e11)));
          return t11;
        }(i2) };
      }
      let tO = Symbol.for("NextInternalRequestMeta"), tP = { get default() {
        throw Object.defineProperty(new tl("Proxy does not support `use cache`, so reading its `default` cacheLife profile is unexpected."), "__NEXT_ERROR_CODE", { value: "E1406", enumerable: false, configurable: true });
      } };
      class tA extends eh {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new _({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new _({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new _({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let tk = { keys: (e10) => Array.from(e10.keys()), get: (e10, t10) => e10.get(t10) ?? void 0 }, tN = (e10, t10) => tt().withPropagatedContext(e10.headers, t10, tk), tL = false;
      async function tM(t10) {
        var r10, n2, i2, a2, s2;
        let o2, l2, d2, u2, c2;
        !function() {
          if (!tL && (tL = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: t11, wrapRequestHandler: r11 } = e.r(94165);
            t11(), tN = r11(tN);
          }
        }(), await f();
        let h2 = void 0 !== globalThis.__BUILD_MANIFEST;
        t10.request.url = t10.request.url.replace(/\.rsc($|\?)/, "$1");
        let p2 = t10.bypassNextUrl ? new URL(t10.request.url) : new $(t10.request.url, { headers: t10.request.headers, nextConfig: t10.request.nextConfig });
        for (let e10 of [...p2.searchParams.keys()]) {
          let t11 = p2.searchParams.getAll(e10), r11 = function(e11) {
            for (let t12 of ["nxtP", "nxtI"]) if (e11 !== t12 && e11.startsWith(t12)) return e11.substring(t12.length);
            return null;
          }(e10);
          if (r11) {
            for (let e11 of (p2.searchParams.delete(r11), t11)) p2.searchParams.append(r11, e11);
            p2.searchParams.delete(e10);
          }
        }
        let _2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in p2 && (_2 = p2.buildId || "", p2.buildId = "");
        let g2 = function(e10) {
          let t11 = new Headers();
          for (let [r11, n3] of Object.entries(e10)) for (let e11 of Array.isArray(n3) ? n3 : [n3]) void 0 !== e11 && ("number" == typeof e11 && (e11 = e11.toString()), t11.append(r11, e11));
          return t11;
        }(t10.request.headers), m2 = g2.has("x-nextjs-data"), y2 = "1" === g2.get("rsc");
        m2 && "/index" === p2.pathname && (p2.pathname = "/");
        let w2 = /* @__PURE__ */ new Map();
        if (!h2) for (let e10 of ev) {
          let t11 = g2.get(e10);
          null !== t11 && (w2.set(e10, t11), g2.delete(e10));
        }
        let v2 = p2.searchParams.get(eb), b2 = new tA({ page: t10.page, input: ((u2 = (d2 = "string" == typeof p2) ? new URL(p2) : p2).searchParams.delete(eb), d2 ? u2.toString() : u2).toString(), init: { body: t10.request.body, headers: g2, method: t10.request.method, nextConfig: t10.request.nextConfig, signal: t10.request.signal } });
        t10.request.requestMeta && (s2 = t10.request.requestMeta, b2[tO] = s2), m2 && Object.defineProperty(b2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && t10.IncrementalCache && (globalThis.__incrementalCache = new t10.IncrementalCache({ CurCacheHandler: t10.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: t10.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: tx() }) }));
        let x2 = t10.request.waitUntil ?? (null == (r10 = null == (c2 = globalThis[tE]) ? void 0 : c2.get()) ? void 0 : r10.waitUntil), E2 = new N({ request: b2, page: t10.page, context: x2 ? { waitUntil: x2 } : void 0 });
        if ((o2 = await tN(b2, () => {
          if ("/middleware" === t10.page || "/src/middleware" === t10.page || "/proxy" === t10.page || "/src/proxy" === t10.page) {
            let e10 = E2.waitUntil.bind(E2), r11 = new tb();
            return tt().trace(eK.execute, { spanName: `middleware ${b2.method}`, attributes: { "http.target": b2.nextUrl.pathname, "http.method": b2.method } }, async () => {
              try {
                var n3, i3, a3, s3, o3;
                let d3 = tx(), u3 = await tT("/", b2.nextUrl.pathname, null), c3 = (a3 = b2.nextUrl, s3 = (e11) => {
                  l2 = e11;
                }, o3 = void 0, function(e11) {
                  let { phase: t11, headers: r12, onUpdateCookies: n4, url: i4, rootParams: a4, implicitTags: s4, resumeDataCache: o4, previewProps: l3, isHmrRefresh: d4, serverComponentsHmrCache: u4, hmrRefreshHash: c4, fallbackParams: h4 } = e11, f2 = {};
                  return { type: "request", phase: t11, implicitTags: s4, url: { pathname: i4.pathname, search: i4.search ?? "" }, rootParams: a4, get headers() {
                    return f2.headers || (f2.headers = function(e12) {
                      let t12 = eS.from(e12 instanceof Headers ? new Headers(e12) : { ...e12 });
                      for (let e13 of ev) t12.delete(e13);
                      return t12.delete("x-nextjs-request-id"), t12.delete("x-nextjs-html-request-id"), eS.seal(t12);
                    }(r12)), f2.headers;
                  }, get cookies() {
                    if (!f2.cookies) {
                      let e12 = new eu.RequestCookies(eS.from(r12));
                      ti(r12, e12), f2.cookies = eN.seal(e12);
                    }
                    return f2.cookies;
                  }, set cookies(value) {
                    f2.cookies = value;
                  }, get mutableCookies() {
                    if (!f2.mutableCookies) {
                      let e12, t12 = (e12 = new eu.RequestCookies(eS.from(r12)), eM.wrap(e12, n4));
                      ti(r12, t12), f2.mutableCookies = t12;
                    }
                    return f2.mutableCookies;
                  }, get userspaceMutableCookies() {
                    if (!f2.userspaceMutableCookies) {
                      var p3;
                      let e12;
                      p3 = this, f2.userspaceMutableCookies = e12 = new Proxy(p3.mutableCookies, { get(t12, r13, n5) {
                        switch (r13) {
                          case "delete":
                            return function(...r14) {
                              return eI(p3, "cookies().delete"), t12.delete(...r14), e12;
                            };
                          case "set":
                            return function(...r14) {
                              return eI(p3, "cookies().set"), t12.set(...r14), e12;
                            };
                          default:
                            return ef.get(t12, r13, n5);
                        }
                      } });
                    }
                    return f2.userspaceMutableCookies;
                  }, get draftMode() {
                    return f2.draftMode || (f2.draftMode = new tn(l3, r12, this.cookies, this.mutableCookies)), f2.draftMode;
                  }, resumeDataCache: o4 ?? null, isHmrRefresh: d4, serverComponentsHmrCache: u4 || globalThis.__serverComponentsHmrCache, hmrRefreshHash: c4, fallbackParams: h4 };
                }({ phase: "action", headers: b2.headers, onUpdateCookies: s3, url: a3, rootParams: {}, implicitTags: u3, resumeDataCache: null, previewProps: d3, isHmrRefresh: false, serverComponentsHmrCache: void 0, hmrRefreshHash: o3, fallbackParams: null })), h3 = function({ page: e11, renderOpts: t11, isPrefetchRequest: r12, buildId: n4, deploymentId: i4, previouslyRevalidatedTags: a4, nonce: s4 }) {
                  let o4 = !t11.supportsDynamicResponse && !t11.isDraftMode && !t11.isPossibleServerAction, l3 = o4 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), d4 = { isStaticGeneration: o4, page: e11, route: eE(e11), incrementalCache: t11.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: t11.cacheLifeProfiles, useCacheTimeout: t11.experimental.useCacheTimeout, staticPageGenerationTimeout: t11.staticPageGenerationTimeout, isBuildTimePrerendering: t11.isBuildTimePrerendering, fetchCache: t11.fetchCache, isOnDemandRevalidate: t11.isOnDemandRevalidate, requestId: void 0, htmlRequestId: void 0, isDraftMode: t11.isDraftMode, isPrefetchRequest: r12, buildId: n4, deploymentId: i4, reactLoadableManifest: (null == t11 ? void 0 : t11.reactLoadableManifest) || {}, assetPrefix: (null == t11 ? void 0 : t11.assetPrefix) || "", nonce: s4, afterContext: function(e12) {
                    let { waitUntil: t12, onClose: r13, onAfterTaskError: n5 } = e12;
                    return new ty({ waitUntil: t12, onClose: r13, onTaskError: n5 });
                  }(t11), cacheComponentsEnabled: t11.cacheComponents, validationLevel: t11.validationLevel, previouslyRevalidatedTags: a4, refreshTagsByCacheKind: function() {
                    let e12 = /* @__PURE__ */ new Map(), t12 = tf();
                    if (t12) for (let [r13, n5] of t12) "refreshTags" in n5 && e12.set(r13, tv(async () => n5.refreshTags()));
                    return e12;
                  }(), runInCleanSnapshot: eO ? eO.snapshot() : function(e12, ...t12) {
                    return e12(...t12);
                  }, shouldTrackFetchMetrics: l3, reactServerErrorsByDigest: /* @__PURE__ */ new Map() };
                  return t11.store = d4, d4;
                }({ page: "/", renderOpts: { cacheLifeProfiles: tP, staticPageGenerationTimeout: 0, cacheComponents: false, validationLevel: "warning", experimental: { isRoutePPREnabled: false, authInterrupts: !!(null == (i3 = t10.request.nextConfig) || null == (n3 = i3.experimental) ? void 0 : n3.authInterrupts), useCacheTimeout: 0 }, supportsDynamicResponse: true, waitUntil: e10, onClose: r11.onClose.bind(r11), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === b2.headers.get(ew), buildId: _2 ?? "", deploymentId: false, previouslyRevalidatedTags: [] });
                return await eA.run(h3, () => ta.run(c3, t10.handler, b2, E2));
              } finally {
                setTimeout(() => {
                  r11.dispatchClose();
                }, 0);
              }
            });
          }
          return t10.handler(b2, E2);
        })) && !(o2 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        o2 && l2 && o2.headers.set("set-cookie", l2);
        let C2 = null == o2 ? void 0 : o2.headers.get("x-middleware-rewrite");
        if (o2 && C2 && (y2 || !h2)) {
          let e10 = new $(C2, { forceLocale: true, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          h2 || e10.host !== b2.nextUrl.host || (e10.buildId = _2 || e10.buildId, o2.headers.set("x-middleware-rewrite", String(e10)));
          let { url: r11, isRelative: s3 } = ey(e10.toString(), p2.toString());
          !h2 && m2 && o2.headers.set("x-nextjs-rewrite", r11);
          let l3 = !s3 && (null == (a2 = t10.request.nextConfig) || null == (i2 = a2.experimental) || null == (n2 = i2.clientParamParsingOrigins) ? void 0 : n2.some((t11) => new RegExp(t11).test(e10.origin)));
          y2 && (s3 || l3) && (p2.pathname !== e10.pathname && o2.headers.set("x-nextjs-rewritten-path", e10.pathname), p2.search !== e10.search && o2.headers.set("x-nextjs-rewritten-query", e10.search.slice(1)));
        }
        if (o2 && C2 && y2 && v2) {
          let e10 = new URL(C2);
          e10.searchParams.has(eb) || (e10.searchParams.set(eb, v2), o2.headers.set("x-middleware-rewrite", e10.toString()));
        }
        let S2 = null == o2 ? void 0 : o2.headers.get("Location");
        if (o2 && S2 && !h2) {
          let e10 = new $(S2, { forceLocale: false, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          o2 = new Response(o2.body, o2), e10.host === p2.host && (e10.buildId = _2 || e10.buildId, o2.headers.set("Location", ey(e10, p2).url)), m2 && (o2.headers.delete("Location"), o2.headers.set("x-nextjs-redirect", ey(e10.toString(), p2.toString()).url));
        }
        let R2 = o2 || em.next(), T2 = R2.headers.get("x-middleware-override-headers"), O2 = [];
        if (T2) {
          for (let [e10, t11] of w2) R2.headers.set(`x-middleware-request-${e10}`, t11), O2.push(e10);
          O2.length > 0 && R2.headers.set("x-middleware-override-headers", T2 + "," + O2.join(","));
        }
        return { response: R2, waitUntil: ("internal" === E2[A].kind ? Promise.all(E2[A].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: b2.fetchMetrics };
      }
      class tI {
        constructor() {
          let e10, t10;
          this.promise = new Promise((r10, n2) => {
            e10 = r10, t10 = n2;
          }), this.resolve = e10, this.reject = t10;
        }
      }
      class tq {
        constructor(e10, t10, r10) {
          this.prev = null, this.next = null, this.key = e10, this.data = t10, this.size = r10;
        }
      }
      class tD {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class tj {
        constructor(e10, t10, r10) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = e10, this.calculateSize = t10, this.onEvict = r10, this.head = new tD(), this.tail = new tD(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(e10) {
          e10.prev = this.head, e10.next = this.head.next, this.head.next.prev = e10, this.head.next = e10;
        }
        removeNode(e10) {
          e10.prev.next = e10.next, e10.next.prev = e10.prev;
        }
        moveToHead(e10) {
          this.removeNode(e10), this.addToHead(e10);
        }
        removeTail() {
          let e10 = this.tail.prev;
          return this.removeNode(e10), e10;
        }
        set(e10, t10) {
          let r10 = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, t10, e10)) ?? 1;
          if (r10 <= 0) throw Object.defineProperty(Error(`LRUCache: calculateSize returned ${r10}, but size must be > 0. Items with size 0 would never be evicted, causing unbounded cache growth.`), "__NEXT_ERROR_CODE", { value: "E1045", enumerable: false, configurable: true });
          if (r10 > this.maxSize) return console.warn("Single item size exceeds maxSize"), false;
          let n2 = this.cache.get(e10);
          if (n2) n2.data = t10, this.totalSize = this.totalSize - n2.size + r10, n2.size = r10, this.moveToHead(n2);
          else {
            let n3 = new tq(e10, t10, r10);
            this.cache.set(e10, n3), this.addToHead(n3), this.totalSize += r10;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let e11 = this.removeTail();
            this.cache.delete(e11.key), this.totalSize -= e11.size, null == this.onEvict || this.onEvict.call(this, e11.key, e11.data);
          }
          return true;
        }
        has(e10) {
          return this.cache.has(e10);
        }
        get(e10) {
          let t10 = this.cache.get(e10);
          if (t10) return this.moveToHead(t10), t10.data;
        }
        *[Symbol.iterator]() {
          let e10 = this.head.next;
          for (; e10 && e10 !== this.tail; ) {
            let t10 = e10;
            yield [t10.key, t10.data], e10 = e10.next;
          }
        }
        remove(e10) {
          let t10 = this.cache.get(e10);
          t10 && (this.removeNode(t10), this.cache.delete(e10), this.totalSize -= t10.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      let { env: tU, stdout: tB } = (null == (ed = globalThis) ? void 0 : ed.process) ?? {}, tG = tU && !tU.NO_COLOR && (tU.FORCE_COLOR || (null == tB ? void 0 : tB.isTTY) && !tU.CI && "dumb" !== tU.TERM), tH = (e10, t10, r10, n2) => {
        let i2 = e10.substring(0, n2) + r10, a2 = e10.substring(n2 + t10.length), s2 = a2.indexOf(t10);
        return ~s2 ? i2 + tH(a2, t10, r10, s2) : i2 + a2;
      }, t$ = (e10, t10, r10 = e10) => tG ? (n2) => {
        let i2 = "" + n2, a2 = i2.indexOf(t10, e10.length);
        return ~a2 ? e10 + tH(i2, t10, r10, a2) + t10 : e10 + i2 + t10;
      } : String, tF = t$("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      t$("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"), t$("\x1B[3m", "\x1B[23m"), t$("\x1B[4m", "\x1B[24m"), t$("\x1B[7m", "\x1B[27m"), t$("\x1B[8m", "\x1B[28m"), t$("\x1B[9m", "\x1B[29m"), t$("\x1B[30m", "\x1B[39m");
      let tz = t$("\x1B[31m", "\x1B[39m"), tV = t$("\x1B[32m", "\x1B[39m"), tK = t$("\x1B[33m", "\x1B[39m");
      t$("\x1B[34m", "\x1B[39m");
      let tW = t$("\x1B[35m", "\x1B[39m");
      t$("\x1B[38;2;173;127;168m", "\x1B[39m"), t$("\x1B[36m", "\x1B[39m");
      let tX = t$("\x1B[37m", "\x1B[39m");
      t$("\x1B[90m", "\x1B[39m"), t$("\x1B[40m", "\x1B[49m"), t$("\x1B[41m", "\x1B[49m"), t$("\x1B[42m", "\x1B[49m"), t$("\x1B[43m", "\x1B[49m"), t$("\x1B[44m", "\x1B[49m"), t$("\x1B[45m", "\x1B[49m"), t$("\x1B[46m", "\x1B[49m"), t$("\x1B[47m", "\x1B[49m"), tX(tF("\u25CB")), tz(tF("\u2A2F")), tK(tF("\u26A0")), tX(tF(" ")), tV(tF("\u2713")), tW(tF("\xBB")), new tj(1e4, (e10) => e10.length), new tj(1e4, (e10) => e10.length);
      var tZ = ((er = {}).APP_PAGE = "APP_PAGE", er.APP_ROUTE = "APP_ROUTE", er.PAGES = "PAGES", er.FETCH = "FETCH", er.REDIRECT = "REDIRECT", er.IMAGE = "IMAGE", er), tJ = ((en = {}).APP_PAGE = "APP_PAGE", en.APP_ROUTE = "APP_ROUTE", en.PAGES = "PAGES", en.FETCH = "FETCH", en.IMAGE = "IMAGE", en);
      function tY() {
      }
      new TextEncoder();
      let tQ = new TextEncoder();
      function t0(e10) {
        return new ReadableStream({ start(t10) {
          t10.enqueue(tQ.encode(e10)), t10.close();
        } });
      }
      function t1(e10) {
        return new ReadableStream({ start(t10) {
          t10.enqueue(e10), t10.close();
        } });
      }
      async function t3(e10, t10) {
        let r10 = new TextDecoder("utf-8", { fatal: true }), n2 = "";
        for await (let i2 of e10) {
          if (null == t10 ? void 0 : t10.aborted) return n2;
          n2 += r10.decode(i2, { stream: true });
        }
        return n2 + r10.decode();
      }
      let t2 = "ResponseAborted";
      class t4 extends Error {
        constructor(...e10) {
          super(...e10), this.name = t2;
        }
      }
      let t5 = 0, t9 = 0, t6 = 0;
      function t7(e10 = {}) {
        let t10 = 0 === t5 ? void 0 : { clientComponentLoadStart: t5, clientComponentLoadTimes: t9, clientComponentLoadCount: t6 };
        return e10.reset && (t5 = 0, t9 = 0, t6 = 0), t10;
      }
      function t8(e10) {
        return (null == e10 ? void 0 : e10.name) === "AbortError" || (null == e10 ? void 0 : e10.name) === t2;
      }
      let re = "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX;
      async function rt(e10, t10, r10) {
        try {
          let n2, { errored: i2, destroyed: a2 } = t10;
          if (i2 || a2) return;
          let s2 = (n2 = new AbortController(), t10.once("close", () => {
            t10.writableFinished || n2.abort(new t4());
          }), n2), o2 = function(e11, t11) {
            let r11 = false, n3 = new tI();
            function i3() {
              n3.resolve();
            }
            e11.on("drain", i3), e11.once("close", () => {
              e11.off("drain", i3), n3.resolve();
            });
            let a3 = new tI();
            return e11.once("finish", () => {
              a3.resolve();
            }), new WritableStream({ write: async (t12) => {
              if (!r11) {
                if (r11 = true, re) {
                  let e12 = t7();
                  e12 && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: e12.clientComponentLoadStart, end: e12.clientComponentLoadStart + e12.clientComponentLoadTimes });
                }
                e11.flushHeaders(), tt().trace(eU.startResponse, { spanName: "start response" }, () => void 0);
              }
              try {
                let r12 = e11.write(t12);
                "flush" in e11 && "function" == typeof e11.flush && e11.flush(), r12 || (await n3.promise, n3 = new tI());
              } catch (t13) {
                throw e11.end(), Object.defineProperty(Error("failed to write chunk to response", { cause: t13 }), "__NEXT_ERROR_CODE", { value: "E321", enumerable: false, configurable: true });
              }
            }, abort: (t12) => {
              e11.writableFinished || e11.destroy(t12);
            }, close: async () => {
              if (t11 && await t11, !e11.writableFinished) return e11.end(), a3.promise;
            } });
          }(t10, r10);
          await e10.pipeTo(o2, { signal: s2.signal });
        } catch (e11) {
          if (t8(e11)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      async function rr(e10, t10, r10) {
        try {
          let { errored: n2, destroyed: i2 } = t10;
          if (n2 || i2) return;
          let a2 = false, s2 = new tI();
          t10.once("close", () => {
            e10.destroy(), s2.resolve();
          }), e10.on("data", (r11) => {
            if (!a2) {
              if (a2 = true, "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX) {
                let e11 = t7();
                e11 && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: e11.clientComponentLoadStart, end: e11.clientComponentLoadStart + e11.clientComponentLoadTimes });
              }
              t10.flushHeaders(), tt().trace(eU.startResponse, { spanName: "start response" }, () => void 0);
            }
            let n3 = t10.write(r11);
            "flush" in t10 && "function" == typeof t10.flush && t10.flush(), n3 || (e10.pause(), t10.once("drain", () => {
              e10.resume();
            }));
          }), e10.on("end", async () => {
            r10 && await r10, t10.writableFinished || t10.end(), s2.resolve();
          }), e10.on("error", (e11) => {
            t8(e11) || t10.destroy(e11), s2.resolve();
          }), await s2.promise;
        } catch (e11) {
          if (t8(e11)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      function rn(e10) {
        return null !== e10 && "object" == typeof e10 && "function" == typeof e10.pipe && "function" == typeof e10.on && !(e10 instanceof ReadableStream);
      }
      class ri {
        static #e = this.EMPTY = new ri(null, { metadata: {}, contentType: null });
        static fromStatic(e10, t10) {
          return new ri(e10, { metadata: {}, contentType: t10 });
        }
        constructor(e10, { contentType: t10, waitUntil: r10, metadata: n2 }) {
          this.response = e10, this.contentType = t10, this.metadata = n2, this.waitUntil = r10;
        }
        assignMetadata(e10) {
          Object.assign(this.metadata, e10);
        }
        get isNull() {
          return null === this.response;
        }
        get isDynamic() {
          return "string" != typeof this.response;
        }
        toUnchunkedString(e10 = false) {
          if (null === this.response) return "";
          if ("string" != typeof this.response) {
            if (!e10) throw Object.defineProperty(new tl("dynamic responses cannot be unchunked. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E732", enumerable: false, configurable: true });
            return t3(this.readable);
          }
          return this.response;
        }
        get readable() {
          if (null === this.response) return new ReadableStream({ start(e10) {
            e10.close();
          } });
          if ("string" == typeof this.response) return t0(this.response);
          if (td.Buffer.isBuffer(this.response)) return t1(this.response);
          if (Array.isArray(this.response)) return function(...e10) {
            if (0 === e10.length) return new ReadableStream({ start(e11) {
              e11.close();
            } });
            if (1 === e10.length) return e10[0];
            let { readable: t10, writable: r10 } = new TransformStream(), n2 = e10[0].pipeTo(r10, { preventClose: true }), i2 = 1;
            for (; i2 < e10.length - 1; i2++) {
              let t11 = e10[i2];
              n2 = n2.then(() => t11.pipeTo(r10, { preventClose: true }));
            }
            let a2 = e10[i2];
            return (n2 = n2.then(() => a2.pipeTo(r10))).catch(tY), t10;
          }(...this.response);
          if (rn(this.response)) throw Object.defineProperty(new tl("Node.js Readable cannot be converted to a web stream in the edge runtime"), "__NEXT_ERROR_CODE", { value: "E1150", enumerable: false, configurable: true });
          return this.response;
        }
        coerce() {
          if (null === this.response) return [];
          if ("string" == typeof this.response) return [t0(this.response)];
          if (Array.isArray(this.response)) return this.response;
          if (td.Buffer.isBuffer(this.response)) return [t1(this.response)];
          if (!rn(this.response)) return [this.response];
          throw Object.defineProperty(new tl("Node.js Readable cannot be converted to a web stream in the edge runtime"), "__NEXT_ERROR_CODE", { value: "E1150", enumerable: false, configurable: true });
        }
        pipeThrough(e10) {
          this.response = this.readable.pipeThrough(e10);
        }
        unshift(e10) {
          this.response = this.coerce(), this.response.unshift(e10);
        }
        push(e10) {
          this.response = this.coerce(), this.response.push(e10);
        }
        async pipeTo(e10) {
          try {
            await this.readable.pipeTo(e10, { preventClose: true }), this.waitUntil && await this.waitUntil, await e10.close();
          } catch (t10) {
            if (t8(t10)) return void await e10.abort(t10);
            throw t10;
          }
        }
        async pipeToNodeResponse(e10) {
          null !== this.response && "string" != typeof this.response && !td.Buffer.isBuffer(this.response) && !Array.isArray(this.response) && rn(this.response) ? await rr(this.response, e10, this.waitUntil) : await rt(this.readable, e10, this.waitUntil);
        }
      }
      function ra(e10, t10) {
        if (!e10) return t10;
        let r10 = parseInt(e10, 10);
        return Number.isFinite(r10) && r10 > 0 ? r10 : t10;
      }
      ra(process.env.NEXT_PRIVATE_RESPONSE_CACHE_TTL, 1e4), ra(process.env.NEXT_PRIVATE_RESPONSE_CACHE_MAX_SIZE, 150);
      var rs = e.i(68886);
      let ro = /* @__PURE__ */ new Map(), rl = (e10, t10) => {
        for (let r10 of e10) {
          let e11 = ro.get(r10), n2 = null == e11 ? void 0 : e11.expired;
          if ("number" == typeof n2 && n2 <= performance.timeOrigin + performance.now() && n2 > t10) return true;
        }
        return false;
      }, rd = (e10, t10) => {
        for (let r10 of e10) {
          let e11 = ro.get(r10), n2 = (null == e11 ? void 0 : e11.stale) ?? 0;
          if ("number" == typeof n2 && n2 > t10) return true;
        }
        return false;
      };
      class ru {
        constructor(e10) {
          this.fs = e10, this.tasks = [];
        }
        findOrCreateTask(e10) {
          for (let t11 of this.tasks) if (t11[0] === e10) return t11;
          let t10 = this.fs.mkdir(e10);
          t10.catch(() => {
          });
          let r10 = [e10, t10, []];
          return this.tasks.push(r10), r10;
        }
        append(e10, t10) {
          let r10 = this.findOrCreateTask(rs.default.dirname(e10)), n2 = r10[1].then(() => this.fs.writeFile(e10, t10));
          n2.catch(() => {
          }), r10[2].push(n2);
        }
        wait() {
          return Promise.all(this.tasks.flatMap((e10) => e10[2]));
        }
      }
      function rc(e10) {
        return (null == e10 ? void 0 : e10.length) || 0;
      }
      class rh {
        static #e = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor(e10) {
          this.fs = e10.fs, this.flushToDisk = e10.flushToDisk, this.serverDistDir = e10.serverDistDir, this.revalidatedTags = e10.revalidatedTags, e10.maxMemoryCacheSize ? rh.memoryCache ? rh.debug && console.log("FileSystemCache: memory store already initialized") : (rh.debug && console.log("FileSystemCache: using memory store for fetch cache"), rh.memoryCache = function(e11) {
            return r || (r = new tj(e11, function({ value: e12 }, t10) {
              var r10, n2;
              let i2;
              if (e12) if (e12.kind === tZ.REDIRECT) i2 = JSON.stringify(e12.props).length;
              else if (e12.kind === tZ.IMAGE) throw Object.defineProperty(Error("invariant image should not be incremental-cache"), "__NEXT_ERROR_CODE", { value: "E501", enumerable: false, configurable: true });
              else i2 = e12.kind === tZ.FETCH ? JSON.stringify(e12.data || "").length : e12.kind === tZ.APP_ROUTE ? e12.body.length : e12.kind === tZ.APP_PAGE ? Math.max(1, e12.html.length + rc(e12.rscData) + ((null == (r10 = e12.postponed) ? void 0 : r10.length) || 0) + function(e13) {
                if (!e13) return 0;
                let t11 = 0;
                for (let [r11, n3] of e13) t11 += r11.length + rc(n3);
                return t11;
              }(e12.segmentData)) : e12.html.length + ((null == (n2 = JSON.stringify(e12.pageData)) ? void 0 : n2.length) || 0);
              else i2 = 25;
              return t10.length + i2;
            })), r;
          }(e10.maxMemoryCacheSize)) : rh.debug && console.log("FileSystemCache: not using memory store for fetch cache");
        }
        resetRequestCache() {
        }
        async revalidateTag(e10, t10) {
          if (e10 = "string" == typeof e10 ? [e10] : e10, rh.debug && console.log("FileSystemCache: revalidateTag", e10, t10), 0 === e10.length) return;
          let r10 = Date.now();
          for (let n2 of e10) {
            let e11 = ro.get(n2) || {};
            if (t10) {
              let i2 = { ...e11 };
              i2.stale = r10, void 0 !== t10.expire && (i2.expired = r10 + 1e3 * t10.expire), ro.set(n2, i2);
            } else ro.set(n2, { ...e11, expired: r10 });
          }
        }
        async get(...e10) {
          var t10, r10, n2, i2, a2, s2;
          let [o2, l2] = e10, { kind: d2 } = l2, u2 = null == (t10 = rh.memoryCache) ? void 0 : t10.get(o2);
          if (rh.debug && (d2 === tJ.FETCH ? console.log("FileSystemCache: get", o2, l2.tags, d2, !!u2) : console.log("FileSystemCache: get", o2, d2, !!u2)), (null == u2 || null == (r10 = u2.value) ? void 0 : r10.kind) === tZ.APP_PAGE || (null == u2 || null == (n2 = u2.value) ? void 0 : n2.kind) === tZ.APP_ROUTE || (null == u2 || null == (i2 = u2.value) ? void 0 : i2.kind) === tZ.PAGES) {
            let e11 = null == (s2 = u2.value.headers) ? void 0 : s2[b];
            if ("string" == typeof e11) {
              let t11 = e11.split(",");
              if (t11.length > 0 && rl(t11, u2.lastModified)) return rh.debug && console.log("FileSystemCache: expired tags", t11), null;
            }
          } else if ((null == u2 || null == (a2 = u2.value) ? void 0 : a2.kind) === tZ.FETCH) {
            let e11 = l2.kind === tJ.FETCH ? [...l2.tags || [], ...l2.softTags || []] : [];
            if (e11.some((e12) => this.revalidatedTags.includes(e12))) return rh.debug && console.log("FileSystemCache: was revalidated", e11), null;
            if (rl(e11, u2.lastModified)) return rh.debug && console.log("FileSystemCache: expired tags", e11), null;
          }
          return u2 ?? null;
        }
        async set(e10, t10, r10) {
          var n2;
          if (null == (n2 = rh.memoryCache) || n2.set(e10, { value: t10, lastModified: Date.now() }), rh.debug && console.log("FileSystemCache: set", e10), !this.flushToDisk || !t10) return;
          let i2 = new ru(this.fs);
          if (t10.kind === tZ.APP_ROUTE) {
            let r11 = this.getFilePath(`${e10}.body`, tJ.APP_ROUTE);
            i2.append(r11, t10.body);
            let n3 = { headers: t10.headers, status: t10.status, postponed: void 0, segmentPaths: void 0, prefetchHints: void 0 };
            i2.append(r11.replace(/\.body$/, v), JSON.stringify(n3, null, 2));
          } else if (t10.kind === tZ.PAGES || t10.kind === tZ.APP_PAGE) {
            let n3 = t10.kind === tZ.APP_PAGE, a2 = this.getFilePath(`${e10}.html`, n3 ? tJ.APP_PAGE : tJ.PAGES);
            if (i2.append(a2, t10.html), r10.fetchCache || r10.isFallback || r10.isRoutePPREnabled || i2.append(this.getFilePath(`${e10}${n3 ? ".rsc" : ".json"}`, n3 ? tJ.APP_PAGE : tJ.PAGES), n3 ? t10.rscData : JSON.stringify(t10.pageData)), (null == t10 ? void 0 : t10.kind) === tZ.APP_PAGE) {
              let e11;
              if (t10.segmentData) {
                e11 = [];
                let r12 = a2.replace(/\.html$/, ".segments");
                for (let [n4, a3] of t10.segmentData) {
                  e11.push(n4);
                  let t11 = r12 + n4 + ".segment.rsc";
                  i2.append(t11, a3);
                }
              }
              let r11 = { headers: t10.headers, status: t10.status, postponed: t10.postponed, segmentPaths: e11, prefetchHints: void 0 };
              i2.append(a2.replace(/\.html$/, v), JSON.stringify(r11));
            }
          } else if (t10.kind === tZ.FETCH) {
            let n3 = this.getFilePath(e10, tJ.FETCH);
            i2.append(n3, JSON.stringify({ ...t10, tags: r10.fetchCache ? r10.tags : [] }));
          }
          await i2.wait();
        }
        getFilePath(e10, t10) {
          switch (t10) {
            case tJ.FETCH:
              return rs.default.join(this.serverDistDir, "..", "cache", "fetch-cache", e10);
            case tJ.PAGES:
              return rs.default.join(this.serverDistDir, "pages", e10);
            case tJ.IMAGE:
            case tJ.APP_PAGE:
            case tJ.APP_ROUTE:
              return rs.default.join(this.serverDistDir, "app", e10);
            default:
              throw Object.defineProperty(Error(`Unexpected file path kind: ${t10}`), "__NEXT_ERROR_CODE", { value: "E479", enumerable: false, configurable: true });
          }
        }
      }
      let rf = ["(..)(..)", "(.)", "(..)", "(...)"], rp = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/, r_ = /\/\[[^/]+\](?=\/|$)/;
      function rg(e10) {
        return e10.replace(/(?:\/index)?\/?$/, "") || "/";
      }
      class rm {
        static #e = this.cacheControls = /* @__PURE__ */ new Map();
        constructor(e10) {
          this.prerenderManifest = e10;
        }
        get(e10) {
          let t10 = rm.cacheControls.get(e10);
          if (t10) return t10;
          let r10 = this.prerenderManifest.routes[e10];
          if (r10) {
            let { initialRevalidateSeconds: e11, initialExpireSeconds: t11 } = r10;
            if (void 0 !== e11) return { revalidate: e11, expire: t11 };
          }
          let n2 = this.prerenderManifest.dynamicRoutes[e10];
          if (n2) {
            let { fallbackRevalidate: e11, fallbackExpire: t11 } = n2;
            if (void 0 !== e11) return { revalidate: e11, expire: t11 };
          }
        }
        set(e10, t10) {
          rm.cacheControls.set(e10, t10);
        }
        clear() {
          rm.cacheControls.clear();
        }
      }
      function ry(e10) {
        let t10 = "buffer" in e10 ? new Uint8Array(e10.buffer, e10.byteOffset, e10.byteLength) : new Uint8Array(e10), r10 = "";
        for (let e11 of t10) r10 += e11.toString(16).padStart(2, "0");
        return r10;
      }
      async function rw(e10) {
        {
          let t10 = new TextEncoder().encode(e10);
          return ry(await crypto.subtle.digest("SHA-256", t10));
        }
      }
      e.i(67914);
      class rv {
        static #e = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor({ fs: e10, dev: t10, flushToDisk: r10, minimalMode: n2, serverDistDir: i2, requestHeaders: a2, maxMemoryCacheSize: s2, getPrerenderManifest: o2, fetchCacheKeyPrefix: l2, CurCacheHandler: d2, allowedRevalidateHeaderKeys: u2 }) {
          var c2, h2, f2, p2;
          this.locks = /* @__PURE__ */ new Map(), this.hasCustomCacheHandler = !!d2;
          const _2 = Symbol.for("@next/cache-handlers"), g2 = globalThis;
          if (d2) rv.debug && console.log("IncrementalCache: using custom cache handler", d2.name);
          else {
            const t11 = g2[_2];
            (null == t11 ? void 0 : t11.FetchCache) ? (d2 = t11.FetchCache, rv.debug && console.log("IncrementalCache: using global FetchCache cache handler")) : e10 && i2 && (rv.debug && console.log("IncrementalCache: using filesystem cache handler"), d2 = rh);
          }
          process.env.__NEXT_TEST_MAX_ISR_CACHE && (s2 = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10)), this.dev = t10, this.disableForTestmode = "true" === process.env.NEXT_PRIVATE_TEST_PROXY, this.minimalMode = n2, this.requestHeaders = a2, this.allowedRevalidateHeaderKeys = u2, this.prerenderManifest = o2(), this.cacheControls = new rm(this.prerenderManifest), this.fetchCacheKeyPrefix = l2;
          let m2 = [];
          a2[y] === (null == (h2 = this.prerenderManifest) || null == (c2 = h2.preview) ? void 0 : c2.previewModeId) && (this.isOnDemandRevalidate = true), n2 && (m2 = this.revalidatedTags = function(e11, t11) {
            return "string" == typeof e11[x] && e11["x-next-revalidate-tag-token"] === t11 ? e11[x].split(",") : [];
          }(a2, null == (p2 = this.prerenderManifest) || null == (f2 = p2.preview) ? void 0 : f2.previewModeId)), d2 && (this.cacheHandler = new d2({ dev: t10, fs: e10, flushToDisk: r10, serverDistDir: i2, revalidatedTags: m2, maxMemoryCacheSize: s2, _requestHeaders: a2, fetchCacheKeyPrefix: l2 }));
        }
        calculateRevalidate(e10, t10, r10, n2) {
          if (r10) return Math.floor(performance.timeOrigin + performance.now() - 1e3);
          let i2 = this.cacheControls.get(rg(e10)), a2 = i2 ? i2.revalidate : !n2 && 1;
          return "number" == typeof a2 ? 1e3 * a2 + t10 : a2;
        }
        _getPathname(e10, t10) {
          return t10 ? e10 : /^\/index(\/|$)/.test(e10) && !function(e11, t11 = true) {
            return (void 0 !== e11.split("/").find((e12) => rf.find((t12) => e12.startsWith(t12))) && (e11 = function(e12) {
              let t12, r10, n2;
              for (let i2 of e12.split("/")) if (r10 = rf.find((e13) => i2.startsWith(e13))) {
                [t12, n2] = e12.split(r10, 2);
                break;
              }
              if (!t12 || !r10 || !n2) throw Object.defineProperty(Error(`Invalid interception route: ${e12}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", { value: "E269", enumerable: false, configurable: true });
              switch (t12 = eE(t12), r10) {
                case "(.)":
                  n2 = "/" === t12 ? `/${n2}` : t12 + "/" + n2;
                  break;
                case "(..)":
                  if ("/" === t12) throw Object.defineProperty(Error(`Invalid interception route: ${e12}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", { value: "E207", enumerable: false, configurable: true });
                  n2 = t12.split("/").slice(0, -1).concat(n2).join("/");
                  break;
                case "(...)":
                  n2 = "/" + n2;
                  break;
                case "(..)(..)":
                  let i2 = t12.split("/");
                  if (i2.length <= 2) throw Object.defineProperty(Error(`Invalid interception route: ${e12}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", { value: "E486", enumerable: false, configurable: true });
                  n2 = i2.slice(0, -2).concat(n2).join("/");
                  break;
                default:
                  throw Object.defineProperty(Error("Invariant: unexpected marker"), "__NEXT_ERROR_CODE", { value: "E112", enumerable: false, configurable: true });
              }
              return { interceptingRoute: t12, interceptedRoute: n2 };
            }(e11).interceptedRoute), t11) ? r_.test(e11) : rp.test(e11);
          }(e10) ? `/index${e10}` : "/" === e10 ? "/index" : ex(e10);
        }
        resetRequestCache() {
          var e10, t10;
          null == (t10 = this.cacheHandler) || null == (e10 = t10.resetRequestCache) || e10.call(t10);
        }
        async lock(e10) {
          for (; ; ) {
            let t11 = this.locks.get(e10);
            if (rv.debug && console.log("IncrementalCache: lock get", e10, !!t11), !t11) break;
            await t11;
          }
          let { resolve: t10, promise: r10 } = new tI();
          return rv.debug && console.log("IncrementalCache: successfully locked", e10), this.locks.set(e10, r10), () => {
            t10(), this.locks.delete(e10);
          };
        }
        async revalidateTag(e10, t10) {
          var r10;
          return null == (r10 = this.cacheHandler) ? void 0 : r10.revalidateTag(e10, t10);
        }
        async generateSimpleCacheKey(e10) {
          return rw(JSON.stringify(["v4", this.fetchCacheKeyPrefix || "", e10]));
        }
        async generateCacheKey(e10, t10 = {}) {
          let r10 = [], n2 = new TextEncoder(), i2 = null, a2 = t10.body;
          if (a2) if ("object" == typeof a2 && "byteLength" in a2) r10.push(`bytes:${ry(a2)}`), t10._ogBody = a2;
          else if ("function" == typeof a2.getReader) {
            let e11 = [];
            try {
              await a2.pipeTo(new WritableStream({ write(t11) {
                e11.push("string" == typeof t11 ? n2.encode(t11) : t11);
              } }));
              let i3 = e11.reduce((e12, t11) => e12 + t11.length, 0), s3 = new Uint8Array(i3), o2 = 0;
              for (let t11 of e11) s3.set(t11, o2), o2 += t11.length;
              r10.push(`bytes:${ry(s3)}`), t10._ogBody = s3;
            } catch (e12) {
              console.error("Problem reading body", e12);
            }
          } else if ("function" == typeof a2.keys) for (let [e11, n3] of (i2 = "[object FormData]" === String(a2) ? "multipart/form-data; boundary=" : "application/x-www-form-urlencoded;charset=UTF-8", t10._ogBody = a2, a2.entries())) r10.push(`key:${e11}`), "string" == typeof n3 ? r10.push(`str:${n3}`) : r10.push("file", n3.name, n3.type, `bytes:${ry(await n3.arrayBuffer())}`);
          else if ("function" == typeof a2.arrayBuffer) {
            let e11 = await a2.arrayBuffer();
            r10.push("blob", a2.type, `bytes:${ry(e11)}`), t10._ogBody = new Blob([e11], { type: a2.type }), i2 = a2.type;
          } else if ("string" == typeof a2) r10.push(`str:${a2}`), t10._ogBody = a2, i2 = "text/plain;charset=UTF-8";
          else throw Object.defineProperty(Error(`Unsupported body type: ${typeof a2}`), "__NEXT_ERROR_CODE", { value: "E1443", enumerable: false, configurable: true });
          let s2 = "function" == typeof (t10.headers || {}).keys ? Object.fromEntries(t10.headers) : Object.assign({}, t10.headers);
          return "traceparent" in s2 && delete s2.traceparent, "tracestate" in s2 && delete s2.tracestate, rw(JSON.stringify(["v4", this.fetchCacheKeyPrefix || "", e10, t10.method, i2, s2, t10.mode, t10.redirect, t10.credentials, t10.referrer, t10.referrerPolicy, t10.integrity, t10.cache, r10]));
        }
        async get(e10, t10) {
          var r10, n2, i2, a2, s2, o2, l2;
          let d2, u2;
          if (t10.kind === tJ.FETCH) {
            let r11 = ta.getStore(), n3 = r11 ? ts(r11) : null;
            if (n3) {
              let r12 = n3.fetch.get(e10);
              if ((null == r12 ? void 0 : r12.kind) === tZ.FETCH) {
                let n4 = eA.getStore();
                if (![...t10.tags || [], ...t10.softTags || []].some((e11) => {
                  var t11, r13;
                  return (null == (t11 = this.revalidatedTags) ? void 0 : t11.includes(e11)) || (null == n4 || null == (r13 = n4.pendingRevalidatedTags) ? void 0 : r13.some((t12) => t12.tag === e11));
                })) return rv.debug && console.log("IncrementalCache: rdc:hit", e10), { isStale: false, value: r12 };
                rv.debug && console.log("IncrementalCache: rdc:revalidated-tag", e10);
              } else rv.debug && console.log("IncrementalCache: rdc:miss", e10);
            } else rv.debug && console.log("IncrementalCache: rdc:no-resume-data");
          }
          if (this.disableForTestmode || this.dev && (t10.kind !== tJ.FETCH || "no-cache" === this.requestHeaders["cache-control"])) return null;
          e10 = this._getPathname(e10, t10.kind === tJ.FETCH);
          let c2 = await (null == (r10 = this.cacheHandler) ? void 0 : r10.get(e10, t10));
          if (t10.kind === tJ.FETCH) {
            if (!c2) return null;
            if ((null == (i2 = c2.value) ? void 0 : i2.kind) !== tZ.FETCH) throw Object.defineProperty(new tl(`Expected cached value for cache key ${JSON.stringify(e10)} to be a "FETCH" kind, got ${JSON.stringify(null == (a2 = c2.value) ? void 0 : a2.kind)} instead.`), "__NEXT_ERROR_CODE", { value: "E653", enumerable: false, configurable: true });
            let r11 = eA.getStore(), n3 = [...t10.tags || [], ...t10.softTags || []];
            if (n3.some((e11) => {
              var t11, n4;
              return (null == (t11 = this.revalidatedTags) ? void 0 : t11.includes(e11)) || (null == r11 || null == (n4 = r11.pendingRevalidatedTags) ? void 0 : n4.some((t12) => t12.tag === e11));
            })) return rv.debug && console.log("IncrementalCache: expired tag", e10), null;
            let s3 = ta.getStore();
            if (s3) {
              let t11 = ts(s3);
              (null == t11 ? void 0 : t11.mutable) && (rv.debug && console.log("IncrementalCache: rdc:set", e10), t11.fetch.set(e10, c2.value));
            }
            let o3 = t10.revalidate || c2.value.revalidate, l3 = (performance.timeOrigin + performance.now() - (c2.lastModified || 0)) / 1e3 > o3, d3 = c2.value.data;
            return rl(n3, c2.lastModified) ? null : (rd(n3, c2.lastModified) && (l3 = true), { isStale: l3, value: { kind: tZ.FETCH, data: d3, revalidate: o3 } });
          }
          if ((null == c2 || null == (n2 = c2.value) ? void 0 : n2.kind) === tZ.FETCH) throw Object.defineProperty(new tl(`Expected cached value for cache key ${JSON.stringify(e10)} not to be a ${JSON.stringify(t10.kind)} kind, got "FETCH" instead.`), "__NEXT_ERROR_CODE", { value: "E652", enumerable: false, configurable: true });
          let h2 = null, { isFallback: f2 } = t10, p2 = this.cacheControls.get(rg(e10));
          if ((null == c2 ? void 0 : c2.lastModified) === -1) d2 = -1, u2 = -31536e6;
          else {
            let r11 = performance.timeOrigin + performance.now(), n3 = (null == c2 ? void 0 : c2.lastModified) || r11;
            u2 = this.calculateRevalidate(e10, n3, this.dev ?? false, t10.isFallback);
            let i3 = "number" == typeof (null == p2 ? void 0 : p2.expire) ? 1e3 * p2.expire + n3 : void 0;
            if (void 0 !== i3 && i3 < r11) d2 = -1;
            else if (void 0 === (d2 = false !== u2 && u2 < r11 || void 0) && ((null == c2 || null == (s2 = c2.value) ? void 0 : s2.kind) === tZ.APP_PAGE || (null == c2 || null == (o2 = c2.value) ? void 0 : o2.kind) === tZ.APP_ROUTE)) {
              let e11 = null == (l2 = c2.value.headers) ? void 0 : l2[b];
              if ("string" == typeof e11) {
                let t11 = e11.split(",");
                t11.length > 0 && (rl(t11, n3) ? d2 = -1 : rd(t11, n3) && (d2 = true));
              }
            }
          }
          return c2 && (h2 = { isStale: d2, cacheControl: p2, revalidateAfter: u2, value: c2.value, isFallback: f2 }), !c2 && this.prerenderManifest.notFoundRoutes.includes(e10) && (h2 = { isStale: d2, value: null, cacheControl: p2, revalidateAfter: u2, isFallback: f2 }, this.set(e10, h2.value, { ...t10, cacheControl: p2 })), h2;
        }
        async set(e10, t10, r10) {
          if ((null == t10 ? void 0 : t10.kind) === tZ.FETCH) {
            let r11 = ta.getStore(), n3 = r11 ? ts(r11) : null;
            (null == n3 ? void 0 : n3.mutable) && (rv.debug && console.log("IncrementalCache: rdc:set", e10), n3.fetch.set(e10, t10));
          }
          if (this.disableForTestmode || this.dev && !r10.fetchCache) return;
          e10 = this._getPathname(e10, r10.fetchCache);
          let n2 = JSON.stringify(t10).length;
          if (r10.fetchCache && n2 > 2097152 && !this.hasCustomCacheHandler && !r10.isImplicitBuildTimeCache) {
            let t11 = `Failed to set Next.js data cache for ${r10.fetchUrl || e10}, items over 2MB can not be cached (${n2} bytes)`;
            if (this.dev) throw Object.defineProperty(Error(t11), "__NEXT_ERROR_CODE", { value: "E1003", enumerable: false, configurable: true });
            console.warn(t11);
            return;
          }
          try {
            var i2;
            !r10.fetchCache && r10.cacheControl && this.cacheControls.set(rg(e10), r10.cacheControl), await (null == (i2 = this.cacheHandler) ? void 0 : i2.set(e10, t10, r10));
          } catch (t11) {
            console.warn("Failed to update prerender cache for", e10, t11);
          }
        }
      }
      e.i(64445);
      var rb = e.i(40049), rx = ((ei = {})[ei.Before = 1] = "Before", ei[ei.ShellStatic = 11] = "ShellStatic", ei[ei.Static = 13] = "Static", ei[ei.ShellRuntime = 21] = "ShellRuntime", ei[ei.Runtime = 23] = "Runtime", ei[ei.Dynamic = 30] = "Dynamic", ei[ei.Abandoned = 40] = "Abandoned", ei);
      if (/* @__PURE__ */ new WeakMap(), rx.ShellRuntime, rx.Static, rx.Runtime, rb.default.unstable_postpone, false === ("Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("needs to bail out of prerendering at this point because it used") && "Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      function rE(e10, t10, r10) {
        return "string" == typeof e10 ? e10 : e10[t10] || r10;
      }
      function rC(e10) {
        let t10 = function() {
          try {
            return "true" === process.env._next_intl_trailing_slash;
          } catch {
            return false;
          }
        }(), [r10, ...n2] = e10.split("#"), i2 = n2.join("#"), a2 = r10;
        if ("/" !== a2) {
          let e11 = a2.endsWith("/");
          t10 && !e11 ? a2 += "/" : !t10 && e11 && (a2 = a2.slice(0, -1));
        }
        return i2 && (a2 += "#" + i2), a2;
      }
      function rS(e10, t10) {
        let r10 = rC(e10), n2 = rC(t10);
        return rT(r10).test(n2);
      }
      function rR(e10, t10) {
        return "never" !== t10.mode && t10.prefixes?.[e10] || "/" + e10;
      }
      function rT(e10) {
        let t10 = e10.replace(/\/\[\[(\.\.\.[^\]]+)\]\]/g, "(?:/(.*))?").replace(/\[\[(\.\.\.[^\]]+)\]\]/g, "(?:/(.*))?").replace(/\[(\.\.\.[^\]]+)\]/g, "(.+)").replace(/\[([^\]]+)\]/g, "([^/]+)");
        return RegExp(`^${t10}$`);
      }
      function rO(e10) {
        return e10.includes("[[...");
      }
      function rP(e10) {
        return e10.includes("[...");
      }
      function rA(e10) {
        return e10.includes("[");
      }
      function rk(e10, t10) {
        let r10 = e10.split("/"), n2 = t10.split("/"), i2 = Math.max(r10.length, n2.length);
        for (let e11 = 0; e11 < i2; e11++) {
          let t11 = r10[e11], i3 = n2[e11];
          if (!t11 && i3) return -1;
          if (t11 && !i3) return 1;
          if (t11 || i3) {
            if (!rA(t11) && rA(i3)) return -1;
            if (rA(t11) && !rA(i3)) return 1;
            if (!rP(t11) && rP(i3)) return -1;
            if (rP(t11) && !rP(i3)) return 1;
            if (!rO(t11) && rO(i3)) return -1;
            if (rO(t11) && !rO(i3)) return 1;
          }
        }
        return 0;
      }
      function rN(e10, t10, r10, n2) {
        let i2 = "";
        return i2 += function(e11, t11) {
          if (!t11) return e11;
          let r11 = e11 = e11.replace(/\[\[/g, "[").replace(/\]\]/g, "]");
          return Object.entries(t11).forEach(([e12, t12]) => {
            r11 = r11.replace(`[${e12}]`, t12);
          }), r11;
        }(r10, function(e11, t11) {
          let r11 = rC(t11), n3 = rC(e11), i3 = rT(n3).exec(r11);
          if (!i3) return;
          let a2 = {}, s2 = n3.match(/\[([^\]]+)\]/g) ?? [];
          for (let e12 = 1; e12 < i3.length; e12++) {
            let t12 = s2[e12 - 1];
            if (!t12) continue;
            let r12 = t12.replace(/[[\]]/g, ""), n4 = i3[e12] ?? "";
            a2[r12] = n4;
          }
          return a2;
        }(t10, e10)), i2 = rC(i2);
      }
      function rL(e10, t10, r10) {
        e10.endsWith("/") || (e10 += "/");
        let n2 = rM(t10, r10), i2 = RegExp(`^(${n2.map(([, e11]) => e11.replaceAll("/", "\\/")).join("|")})/(.*)`, "i"), a2 = e10.match(i2), s2 = a2 ? "/" + a2[2] : e10;
        return "/" !== s2 && (s2 = rC(s2)), s2;
      }
      function rM(e10, t10, r10 = true) {
        let n2 = e10.map((e11) => [e11, rR(e11, t10)]);
        return r10 && n2.sort((e11, t11) => t11[1].length - e11[1].length), n2;
      }
      function rI(e10, t10, r10, n2) {
        let i2 = rM(t10, r10);
        for (let [t11, r11] of (n2 && i2.sort(([e11], [t12]) => {
          if (e11 === n2.defaultLocale) return -1;
          if (t12 === n2.defaultLocale) return 1;
          let r12 = n2.locales.includes(e11), i3 = n2.locales.includes(t12);
          return r12 && !i3 ? -1 : !r12 && i3 ? 1 : 0;
        }), i2)) {
          let n3, i3;
          if (e10 === r11 || e10.startsWith(r11 + "/")) n3 = i3 = true;
          else {
            let t12 = e10.toLowerCase(), a2 = r11.toLowerCase();
            (t12 === a2 || t12.startsWith(a2 + "/")) && (n3 = false, i3 = true);
          }
          if (i3) return { locale: t11, prefix: r11, matchedPrefix: e10.slice(0, r11.length), exact: n3 };
        }
      }
      function rq(e10, t10, r10) {
        var n2;
        let i2, a2 = e10;
        return t10 && (n2 = a2, i2 = t10, /^\/(\?.*)?$/.test(n2) && (n2 = n2.slice(1)), a2 = i2 += n2), r10 && (a2 += r10), a2;
      }
      function rD(e10) {
        return e10.get("x-forwarded-host") ?? e10.get("host") ?? void 0;
      }
      function rj(e10, t10) {
        return t10.defaultLocale === e10 || t10.locales.includes(e10);
      }
      function rU(e10, t10, r10) {
        let n2;
        return e10 && rj(t10, e10) && (n2 = e10), n2 || (n2 = r10.find((e11) => e11.defaultLocale === t10)), n2 || (n2 = r10.find((e11) => e11.locales.includes(t10))), n2;
      }
      RegExp("\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)"), RegExp("\\n\\s+at __next_metadata_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_viewport_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_outlet_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_instant_validation_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_instant_slot_(\\d+)__[\\n\\s]"), eP();
      function rB(e10, t10, r10, n2) {
        let i2 = null == n2 || "number" == typeof n2 || "boolean" == typeof n2 ? n2 : r10(n2), a2 = t10.get(i2);
        return void 0 === a2 && (a2 = e10.call(this, n2), t10.set(i2, a2)), a2;
      }
      function rG(e10, t10, r10) {
        let n2 = Array.prototype.slice.call(arguments, 3), i2 = r10(n2), a2 = t10.get(i2);
        return void 0 === a2 && (a2 = e10.apply(this, n2), t10.set(i2, a2)), a2;
      }
      var rH = class {
        constructor() {
          this.cache = /* @__PURE__ */ Object.create(null);
        }
        get(e10) {
          return this.cache[e10];
        }
        set(e10, t10) {
          this.cache[e10] = t10;
        }
      };
      let r$ = { "written-new": [{ paradigmLocales: { _locales: "en en_GB es es_419 pt_BR pt_PT" } }, { $enUS: { _value: "AS+CA+GU+MH+MP+PH+PR+UM+US+VI" } }, { $cnsar: { _value: "HK+MO" } }, { $americas: { _value: "019" } }, { $maghreb: { _value: "MA+DZ+TN+LY+MR+EH" } }, { no: { _desired: "nb", _distance: "1" } }, { bs: { _desired: "hr", _distance: "4" } }, { bs: { _desired: "sh", _distance: "4" } }, { hr: { _desired: "sh", _distance: "4" } }, { sr: { _desired: "sh", _distance: "4" } }, { aa: { _desired: "ssy", _distance: "4" } }, { de: { _desired: "gsw", _distance: "4", _oneway: "true" } }, { de: { _desired: "lb", _distance: "4", _oneway: "true" } }, { no: { _desired: "da", _distance: "8" } }, { nb: { _desired: "da", _distance: "8" } }, { ru: { _desired: "ab", _distance: "30", _oneway: "true" } }, { en: { _desired: "ach", _distance: "30", _oneway: "true" } }, { nl: { _desired: "af", _distance: "20", _oneway: "true" } }, { en: { _desired: "ak", _distance: "30", _oneway: "true" } }, { en: { _desired: "am", _distance: "30", _oneway: "true" } }, { es: { _desired: "ay", _distance: "20", _oneway: "true" } }, { ru: { _desired: "az", _distance: "30", _oneway: "true" } }, { ur: { _desired: "bal", _distance: "20", _oneway: "true" } }, { ru: { _desired: "be", _distance: "20", _oneway: "true" } }, { en: { _desired: "bem", _distance: "30", _oneway: "true" } }, { hi: { _desired: "bh", _distance: "30", _oneway: "true" } }, { en: { _desired: "bn", _distance: "30", _oneway: "true" } }, { zh: { _desired: "bo", _distance: "20", _oneway: "true" } }, { fr: { _desired: "br", _distance: "20", _oneway: "true" } }, { es: { _desired: "ca", _distance: "20", _oneway: "true" } }, { fil: { _desired: "ceb", _distance: "30", _oneway: "true" } }, { en: { _desired: "chr", _distance: "20", _oneway: "true" } }, { ar: { _desired: "ckb", _distance: "30", _oneway: "true" } }, { fr: { _desired: "co", _distance: "20", _oneway: "true" } }, { fr: { _desired: "crs", _distance: "20", _oneway: "true" } }, { sk: { _desired: "cs", _distance: "20" } }, { en: { _desired: "cy", _distance: "20", _oneway: "true" } }, { en: { _desired: "ee", _distance: "30", _oneway: "true" } }, { en: { _desired: "eo", _distance: "30", _oneway: "true" } }, { es: { _desired: "eu", _distance: "20", _oneway: "true" } }, { da: { _desired: "fo", _distance: "20", _oneway: "true" } }, { nl: { _desired: "fy", _distance: "20", _oneway: "true" } }, { en: { _desired: "ga", _distance: "20", _oneway: "true" } }, { en: { _desired: "gaa", _distance: "30", _oneway: "true" } }, { en: { _desired: "gd", _distance: "20", _oneway: "true" } }, { es: { _desired: "gl", _distance: "20", _oneway: "true" } }, { es: { _desired: "gn", _distance: "20", _oneway: "true" } }, { hi: { _desired: "gu", _distance: "30", _oneway: "true" } }, { en: { _desired: "ha", _distance: "30", _oneway: "true" } }, { en: { _desired: "haw", _distance: "20", _oneway: "true" } }, { fr: { _desired: "ht", _distance: "20", _oneway: "true" } }, { ru: { _desired: "hy", _distance: "30", _oneway: "true" } }, { en: { _desired: "ia", _distance: "30", _oneway: "true" } }, { en: { _desired: "ig", _distance: "30", _oneway: "true" } }, { en: { _desired: "is", _distance: "20", _oneway: "true" } }, { id: { _desired: "jv", _distance: "20", _oneway: "true" } }, { en: { _desired: "ka", _distance: "30", _oneway: "true" } }, { fr: { _desired: "kg", _distance: "30", _oneway: "true" } }, { ru: { _desired: "kk", _distance: "30", _oneway: "true" } }, { en: { _desired: "km", _distance: "30", _oneway: "true" } }, { en: { _desired: "kn", _distance: "30", _oneway: "true" } }, { en: { _desired: "kri", _distance: "30", _oneway: "true" } }, { tr: { _desired: "ku", _distance: "30", _oneway: "true" } }, { ru: { _desired: "ky", _distance: "30", _oneway: "true" } }, { it: { _desired: "la", _distance: "20", _oneway: "true" } }, { en: { _desired: "lg", _distance: "30", _oneway: "true" } }, { fr: { _desired: "ln", _distance: "30", _oneway: "true" } }, { en: { _desired: "lo", _distance: "30", _oneway: "true" } }, { en: { _desired: "loz", _distance: "30", _oneway: "true" } }, { fr: { _desired: "lua", _distance: "30", _oneway: "true" } }, { hi: { _desired: "mai", _distance: "20", _oneway: "true" } }, { en: { _desired: "mfe", _distance: "30", _oneway: "true" } }, { fr: { _desired: "mg", _distance: "30", _oneway: "true" } }, { en: { _desired: "mi", _distance: "20", _oneway: "true" } }, { en: { _desired: "ml", _distance: "30", _oneway: "true" } }, { ru: { _desired: "mn", _distance: "30", _oneway: "true" } }, { hi: { _desired: "mr", _distance: "30", _oneway: "true" } }, { id: { _desired: "ms", _distance: "30", _oneway: "true" } }, { en: { _desired: "mt", _distance: "30", _oneway: "true" } }, { en: { _desired: "my", _distance: "30", _oneway: "true" } }, { en: { _desired: "ne", _distance: "30", _oneway: "true" } }, { nb: { _desired: "nn", _distance: "20" } }, { no: { _desired: "nn", _distance: "20" } }, { en: { _desired: "nso", _distance: "30", _oneway: "true" } }, { en: { _desired: "ny", _distance: "30", _oneway: "true" } }, { en: { _desired: "nyn", _distance: "30", _oneway: "true" } }, { fr: { _desired: "oc", _distance: "20", _oneway: "true" } }, { en: { _desired: "om", _distance: "30", _oneway: "true" } }, { en: { _desired: "or", _distance: "30", _oneway: "true" } }, { en: { _desired: "pa", _distance: "30", _oneway: "true" } }, { en: { _desired: "pcm", _distance: "20", _oneway: "true" } }, { en: { _desired: "ps", _distance: "30", _oneway: "true" } }, { es: { _desired: "qu", _distance: "30", _oneway: "true" } }, { de: { _desired: "rm", _distance: "20", _oneway: "true" } }, { en: { _desired: "rn", _distance: "30", _oneway: "true" } }, { fr: { _desired: "rw", _distance: "30", _oneway: "true" } }, { hi: { _desired: "sa", _distance: "30", _oneway: "true" } }, { en: { _desired: "sd", _distance: "30", _oneway: "true" } }, { en: { _desired: "si", _distance: "30", _oneway: "true" } }, { en: { _desired: "sn", _distance: "30", _oneway: "true" } }, { en: { _desired: "so", _distance: "30", _oneway: "true" } }, { en: { _desired: "sq", _distance: "30", _oneway: "true" } }, { en: { _desired: "st", _distance: "30", _oneway: "true" } }, { id: { _desired: "su", _distance: "20", _oneway: "true" } }, { en: { _desired: "sw", _distance: "30", _oneway: "true" } }, { en: { _desired: "ta", _distance: "30", _oneway: "true" } }, { en: { _desired: "te", _distance: "30", _oneway: "true" } }, { ru: { _desired: "tg", _distance: "30", _oneway: "true" } }, { en: { _desired: "ti", _distance: "30", _oneway: "true" } }, { ru: { _desired: "tk", _distance: "30", _oneway: "true" } }, { en: { _desired: "tlh", _distance: "30", _oneway: "true" } }, { en: { _desired: "tn", _distance: "30", _oneway: "true" } }, { en: { _desired: "to", _distance: "30", _oneway: "true" } }, { ru: { _desired: "tt", _distance: "30", _oneway: "true" } }, { en: { _desired: "tum", _distance: "30", _oneway: "true" } }, { zh: { _desired: "ug", _distance: "20", _oneway: "true" } }, { ru: { _desired: "uk", _distance: "20", _oneway: "true" } }, { en: { _desired: "ur", _distance: "30", _oneway: "true" } }, { ru: { _desired: "uz", _distance: "30", _oneway: "true" } }, { fr: { _desired: "wo", _distance: "30", _oneway: "true" } }, { en: { _desired: "xh", _distance: "30", _oneway: "true" } }, { en: { _desired: "yi", _distance: "30", _oneway: "true" } }, { en: { _desired: "yo", _distance: "30", _oneway: "true" } }, { zh: { _desired: "za", _distance: "20", _oneway: "true" } }, { en: { _desired: "zu", _distance: "30", _oneway: "true" } }, { ar: { _desired: "aao", _distance: "10", _oneway: "true" } }, { ar: { _desired: "abh", _distance: "10", _oneway: "true" } }, { ar: { _desired: "abv", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acm", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acq", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acw", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acx", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acy", _distance: "10", _oneway: "true" } }, { ar: { _desired: "adf", _distance: "10", _oneway: "true" } }, { ar: { _desired: "aeb", _distance: "10", _oneway: "true" } }, { ar: { _desired: "aec", _distance: "10", _oneway: "true" } }, { ar: { _desired: "afb", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ajp", _distance: "10", _oneway: "true" } }, { ar: { _desired: "apc", _distance: "10", _oneway: "true" } }, { ar: { _desired: "apd", _distance: "10", _oneway: "true" } }, { ar: { _desired: "arq", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ars", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ary", _distance: "10", _oneway: "true" } }, { ar: { _desired: "arz", _distance: "10", _oneway: "true" } }, { ar: { _desired: "auz", _distance: "10", _oneway: "true" } }, { ar: { _desired: "avl", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ayh", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ayl", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ayn", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ayp", _distance: "10", _oneway: "true" } }, { ar: { _desired: "bbz", _distance: "10", _oneway: "true" } }, { ar: { _desired: "pga", _distance: "10", _oneway: "true" } }, { ar: { _desired: "shu", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ssh", _distance: "10", _oneway: "true" } }, { az: { _desired: "azb", _distance: "10", _oneway: "true" } }, { et: { _desired: "vro", _distance: "10", _oneway: "true" } }, { ff: { _desired: "ffm", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fub", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fue", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fuf", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fuh", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fui", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fuq", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fuv", _distance: "10", _oneway: "true" } }, { gn: { _desired: "gnw", _distance: "10", _oneway: "true" } }, { gn: { _desired: "gui", _distance: "10", _oneway: "true" } }, { gn: { _desired: "gun", _distance: "10", _oneway: "true" } }, { gn: { _desired: "nhd", _distance: "10", _oneway: "true" } }, { iu: { _desired: "ikt", _distance: "10", _oneway: "true" } }, { kln: { _desired: "enb", _distance: "10", _oneway: "true" } }, { kln: { _desired: "eyo", _distance: "10", _oneway: "true" } }, { kln: { _desired: "niq", _distance: "10", _oneway: "true" } }, { kln: { _desired: "oki", _distance: "10", _oneway: "true" } }, { kln: { _desired: "pko", _distance: "10", _oneway: "true" } }, { kln: { _desired: "sgc", _distance: "10", _oneway: "true" } }, { kln: { _desired: "tec", _distance: "10", _oneway: "true" } }, { kln: { _desired: "tuy", _distance: "10", _oneway: "true" } }, { kok: { _desired: "gom", _distance: "10", _oneway: "true" } }, { kpe: { _desired: "gkp", _distance: "10", _oneway: "true" } }, { luy: { _desired: "ida", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lkb", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lko", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lks", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lri", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lrm", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lsm", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lto", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lts", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lwg", _distance: "10", _oneway: "true" } }, { luy: { _desired: "nle", _distance: "10", _oneway: "true" } }, { luy: { _desired: "nyd", _distance: "10", _oneway: "true" } }, { luy: { _desired: "rag", _distance: "10", _oneway: "true" } }, { lv: { _desired: "ltg", _distance: "10", _oneway: "true" } }, { mg: { _desired: "bhr", _distance: "10", _oneway: "true" } }, { mg: { _desired: "bjq", _distance: "10", _oneway: "true" } }, { mg: { _desired: "bmm", _distance: "10", _oneway: "true" } }, { mg: { _desired: "bzc", _distance: "10", _oneway: "true" } }, { mg: { _desired: "msh", _distance: "10", _oneway: "true" } }, { mg: { _desired: "skg", _distance: "10", _oneway: "true" } }, { mg: { _desired: "tdx", _distance: "10", _oneway: "true" } }, { mg: { _desired: "tkg", _distance: "10", _oneway: "true" } }, { mg: { _desired: "txy", _distance: "10", _oneway: "true" } }, { mg: { _desired: "xmv", _distance: "10", _oneway: "true" } }, { mg: { _desired: "xmw", _distance: "10", _oneway: "true" } }, { mn: { _desired: "mvf", _distance: "10", _oneway: "true" } }, { ms: { _desired: "bjn", _distance: "10", _oneway: "true" } }, { ms: { _desired: "btj", _distance: "10", _oneway: "true" } }, { ms: { _desired: "bve", _distance: "10", _oneway: "true" } }, { ms: { _desired: "bvu", _distance: "10", _oneway: "true" } }, { ms: { _desired: "coa", _distance: "10", _oneway: "true" } }, { ms: { _desired: "dup", _distance: "10", _oneway: "true" } }, { ms: { _desired: "hji", _distance: "10", _oneway: "true" } }, { ms: { _desired: "id", _distance: "10", _oneway: "true" } }, { ms: { _desired: "jak", _distance: "10", _oneway: "true" } }, { ms: { _desired: "jax", _distance: "10", _oneway: "true" } }, { ms: { _desired: "kvb", _distance: "10", _oneway: "true" } }, { ms: { _desired: "kvr", _distance: "10", _oneway: "true" } }, { ms: { _desired: "kxd", _distance: "10", _oneway: "true" } }, { ms: { _desired: "lce", _distance: "10", _oneway: "true" } }, { ms: { _desired: "lcf", _distance: "10", _oneway: "true" } }, { ms: { _desired: "liw", _distance: "10", _oneway: "true" } }, { ms: { _desired: "max", _distance: "10", _oneway: "true" } }, { ms: { _desired: "meo", _distance: "10", _oneway: "true" } }, { ms: { _desired: "mfa", _distance: "10", _oneway: "true" } }, { ms: { _desired: "mfb", _distance: "10", _oneway: "true" } }, { ms: { _desired: "min", _distance: "10", _oneway: "true" } }, { ms: { _desired: "mqg", _distance: "10", _oneway: "true" } }, { ms: { _desired: "msi", _distance: "10", _oneway: "true" } }, { ms: { _desired: "mui", _distance: "10", _oneway: "true" } }, { ms: { _desired: "orn", _distance: "10", _oneway: "true" } }, { ms: { _desired: "ors", _distance: "10", _oneway: "true" } }, { ms: { _desired: "pel", _distance: "10", _oneway: "true" } }, { ms: { _desired: "pse", _distance: "10", _oneway: "true" } }, { ms: { _desired: "tmw", _distance: "10", _oneway: "true" } }, { ms: { _desired: "urk", _distance: "10", _oneway: "true" } }, { ms: { _desired: "vkk", _distance: "10", _oneway: "true" } }, { ms: { _desired: "vkt", _distance: "10", _oneway: "true" } }, { ms: { _desired: "xmm", _distance: "10", _oneway: "true" } }, { ms: { _desired: "zlm", _distance: "10", _oneway: "true" } }, { ms: { _desired: "zmi", _distance: "10", _oneway: "true" } }, { ne: { _desired: "dty", _distance: "10", _oneway: "true" } }, { om: { _desired: "gax", _distance: "10", _oneway: "true" } }, { om: { _desired: "hae", _distance: "10", _oneway: "true" } }, { om: { _desired: "orc", _distance: "10", _oneway: "true" } }, { or: { _desired: "spv", _distance: "10", _oneway: "true" } }, { ps: { _desired: "pbt", _distance: "10", _oneway: "true" } }, { ps: { _desired: "pst", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qub", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qud", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quf", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qug", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quh", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quk", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qul", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qup", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qur", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qus", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quw", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qux", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quy", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qva", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvc", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qve", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvh", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvi", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvj", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvl", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvm", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvn", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvo", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvp", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvs", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvw", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvz", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qwa", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qwc", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qwh", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qws", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxa", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxc", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxh", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxl", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxn", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxo", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxp", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxr", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxt", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxu", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxw", _distance: "10", _oneway: "true" } }, { sc: { _desired: "sdc", _distance: "10", _oneway: "true" } }, { sc: { _desired: "sdn", _distance: "10", _oneway: "true" } }, { sc: { _desired: "sro", _distance: "10", _oneway: "true" } }, { sq: { _desired: "aae", _distance: "10", _oneway: "true" } }, { sq: { _desired: "aat", _distance: "10", _oneway: "true" } }, { sq: { _desired: "aln", _distance: "10", _oneway: "true" } }, { syr: { _desired: "aii", _distance: "10", _oneway: "true" } }, { uz: { _desired: "uzs", _distance: "10", _oneway: "true" } }, { yi: { _desired: "yih", _distance: "10", _oneway: "true" } }, { zh: { _desired: "cdo", _distance: "10", _oneway: "true" } }, { zh: { _desired: "cjy", _distance: "10", _oneway: "true" } }, { zh: { _desired: "cpx", _distance: "10", _oneway: "true" } }, { zh: { _desired: "czh", _distance: "10", _oneway: "true" } }, { zh: { _desired: "czo", _distance: "10", _oneway: "true" } }, { zh: { _desired: "gan", _distance: "10", _oneway: "true" } }, { zh: { _desired: "hak", _distance: "10", _oneway: "true" } }, { zh: { _desired: "hsn", _distance: "10", _oneway: "true" } }, { zh: { _desired: "lzh", _distance: "10", _oneway: "true" } }, { zh: { _desired: "mnp", _distance: "10", _oneway: "true" } }, { zh: { _desired: "nan", _distance: "10", _oneway: "true" } }, { zh: { _desired: "wuu", _distance: "10", _oneway: "true" } }, { zh: { _desired: "yue", _distance: "10", _oneway: "true" } }, { "*": { _desired: "*", _distance: "80" } }, { "en-Latn": { _desired: "am-Ethi", _distance: "10", _oneway: "true" } }, { "ru-Cyrl": { _desired: "az-Latn", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "bn-Beng", _distance: "10", _oneway: "true" } }, { "zh-Hans": { _desired: "bo-Tibt", _distance: "10", _oneway: "true" } }, { "ru-Cyrl": { _desired: "hy-Armn", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ka-Geor", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "km-Khmr", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "kn-Knda", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "lo-Laoo", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ml-Mlym", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "my-Mymr", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ne-Deva", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "or-Orya", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "pa-Guru", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ps-Arab", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "sd-Arab", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "si-Sinh", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ta-Taml", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "te-Telu", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ti-Ethi", _distance: "10", _oneway: "true" } }, { "ru-Cyrl": { _desired: "tk-Latn", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ur-Arab", _distance: "10", _oneway: "true" } }, { "ru-Cyrl": { _desired: "uz-Latn", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "yi-Hebr", _distance: "10", _oneway: "true" } }, { "sr-Cyrl": { _desired: "sr-Latn", _distance: "5" } }, { "zh-Hans": { _desired: "za-Latn", _distance: "10", _oneway: "true" } }, { "zh-Hans": { _desired: "zh-Hani", _distance: "20", _oneway: "true" } }, { "zh-Hant": { _desired: "zh-Hani", _distance: "20", _oneway: "true" } }, { "ar-Arab": { _desired: "ar-Latn", _distance: "20", _oneway: "true" } }, { "bn-Beng": { _desired: "bn-Latn", _distance: "20", _oneway: "true" } }, { "gu-Gujr": { _desired: "gu-Latn", _distance: "20", _oneway: "true" } }, { "hi-Deva": { _desired: "hi-Latn", _distance: "20", _oneway: "true" } }, { "kn-Knda": { _desired: "kn-Latn", _distance: "20", _oneway: "true" } }, { "ml-Mlym": { _desired: "ml-Latn", _distance: "20", _oneway: "true" } }, { "mr-Deva": { _desired: "mr-Latn", _distance: "20", _oneway: "true" } }, { "ta-Taml": { _desired: "ta-Latn", _distance: "20", _oneway: "true" } }, { "te-Telu": { _desired: "te-Latn", _distance: "20", _oneway: "true" } }, { "zh-Hans": { _desired: "zh-Latn", _distance: "20", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Latn", _distance: "5", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Hani", _distance: "5", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Hira", _distance: "5", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Kana", _distance: "5", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Hrkt", _distance: "5", _oneway: "true" } }, { "ja-Hrkt": { _desired: "ja-Hira", _distance: "5", _oneway: "true" } }, { "ja-Hrkt": { _desired: "ja-Kana", _distance: "5", _oneway: "true" } }, { "ko-Kore": { _desired: "ko-Hani", _distance: "5", _oneway: "true" } }, { "ko-Kore": { _desired: "ko-Hang", _distance: "5", _oneway: "true" } }, { "ko-Kore": { _desired: "ko-Jamo", _distance: "5", _oneway: "true" } }, { "ko-Hang": { _desired: "ko-Jamo", _distance: "5", _oneway: "true" } }, { "*-*": { _desired: "*-*", _distance: "50" } }, { "ar-*-$maghreb": { _desired: "ar-*-$maghreb", _distance: "4" } }, { "ar-*-$!maghreb": { _desired: "ar-*-$!maghreb", _distance: "4" } }, { "ar-*-*": { _desired: "ar-*-*", _distance: "5" } }, { "en-*-$enUS": { _desired: "en-*-$enUS", _distance: "4" } }, { "en-*-GB": { _desired: "en-*-$!enUS", _distance: "3" } }, { "en-*-$!enUS": { _desired: "en-*-$!enUS", _distance: "4" } }, { "en-*-*": { _desired: "en-*-*", _distance: "5" } }, { "es-*-$americas": { _desired: "es-*-$americas", _distance: "4" } }, { "es-*-$!americas": { _desired: "es-*-$!americas", _distance: "4" } }, { "es-*-*": { _desired: "es-*-*", _distance: "5" } }, { "pt-*-$americas": { _desired: "pt-*-$americas", _distance: "4" } }, { "pt-*-$!americas": { _desired: "pt-*-$!americas", _distance: "4" } }, { "pt-*-*": { _desired: "pt-*-*", _distance: "5" } }, { "zh-Hant-$cnsar": { _desired: "zh-Hant-$cnsar", _distance: "4" } }, { "zh-Hant-$!cnsar": { _desired: "zh-Hant-$!cnsar", _distance: "4" } }, { "zh-Hant-*": { _desired: "zh-Hant-*", _distance: "5" } }, { "*-*-*": { _desired: "*-*-*", _distance: "4" } }] }, rF = { "001": ["001", "001-status-grouping", "002", "005", "009", "011", "013", "014", "015", "017", "018", "019", "021", "029", "030", "034", "035", "039", "053", "054", "057", "061", "142", "143", "145", "150", "151", "154", "155", "AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DG", "DJ", "DK", "DM", "DO", "DZ", "EA", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "EU", "EZ", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "IC", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "QO", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TA", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "UN", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW"], "002": ["002", "002-status-grouping", "011", "014", "015", "017", "018", "202", "AO", "BF", "BI", "BJ", "BW", "CD", "CF", "CG", "CI", "CM", "CV", "DJ", "DZ", "EA", "EG", "EH", "ER", "ET", "GA", "GH", "GM", "GN", "GQ", "GW", "IC", "IO", "KE", "KM", "LR", "LS", "LY", "MA", "MG", "ML", "MR", "MU", "MW", "MZ", "NA", "NE", "NG", "RE", "RW", "SC", "SD", "SH", "SL", "SN", "SO", "SS", "ST", "SZ", "TD", "TF", "TG", "TN", "TZ", "UG", "YT", "ZA", "ZM", "ZW"], "003": ["003", "013", "021", "029", "AG", "AI", "AW", "BB", "BL", "BM", "BQ", "BS", "BZ", "CA", "CR", "CU", "CW", "DM", "DO", "GD", "GL", "GP", "GT", "HN", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "MX", "NI", "PA", "PM", "PR", "SV", "SX", "TC", "TT", "US", "VC", "VG", "VI"], "005": ["005", "AR", "BO", "BR", "BV", "CL", "CO", "EC", "FK", "GF", "GS", "GY", "PE", "PY", "SR", "UY", "VE"], "009": ["009", "053", "054", "057", "061", "AC", "AQ", "AS", "AU", "CC", "CK", "CP", "CX", "DG", "FJ", "FM", "GU", "HM", "KI", "MH", "MP", "NC", "NF", "NR", "NU", "NZ", "PF", "PG", "PN", "PW", "QO", "SB", "TA", "TK", "TO", "TV", "UM", "VU", "WF", "WS"], "011": ["011", "BF", "BJ", "CI", "CV", "GH", "GM", "GN", "GW", "LR", "ML", "MR", "NE", "NG", "SH", "SL", "SN", "TG"], "013": ["013", "BZ", "CR", "GT", "HN", "MX", "NI", "PA", "SV"], "014": ["014", "BI", "DJ", "ER", "ET", "IO", "KE", "KM", "MG", "MU", "MW", "MZ", "RE", "RW", "SC", "SO", "SS", "TF", "TZ", "UG", "YT", "ZM", "ZW"], "015": ["015", "DZ", "EA", "EG", "EH", "IC", "LY", "MA", "SD", "TN"], "017": ["017", "AO", "CD", "CF", "CG", "CM", "GA", "GQ", "ST", "TD"], "018": ["018", "BW", "LS", "NA", "SZ", "ZA"], "019": ["003", "005", "013", "019", "019-status-grouping", "021", "029", "419", "AG", "AI", "AR", "AW", "BB", "BL", "BM", "BO", "BQ", "BR", "BS", "BV", "BZ", "CA", "CL", "CO", "CR", "CU", "CW", "DM", "DO", "EC", "FK", "GD", "GF", "GL", "GP", "GS", "GT", "GY", "HN", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "MX", "NI", "PA", "PE", "PM", "PR", "PY", "SR", "SV", "SX", "TC", "TT", "US", "UY", "VC", "VE", "VG", "VI"], "021": ["021", "BM", "CA", "GL", "PM", "US"], "029": ["029", "AG", "AI", "AW", "BB", "BL", "BQ", "BS", "CU", "CW", "DM", "DO", "GD", "GP", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "PR", "SX", "TC", "TT", "VC", "VG", "VI"], "030": ["030", "CN", "HK", "JP", "KP", "KR", "MN", "MO", "TW"], "034": ["034", "AF", "BD", "BT", "IN", "IR", "LK", "MV", "NP", "PK"], "035": ["035", "BN", "ID", "KH", "LA", "MM", "MY", "PH", "SG", "TH", "TL", "VN"], "039": ["039", "AD", "AL", "BA", "ES", "GI", "GR", "HR", "IT", "ME", "MK", "MT", "PT", "RS", "SI", "SM", "VA", "XK"], "053": ["053", "AU", "CC", "CX", "HM", "NF", "NZ"], "054": ["054", "FJ", "NC", "PG", "SB", "VU"], "057": ["057", "FM", "GU", "KI", "MH", "MP", "NR", "PW", "UM"], "061": ["061", "AS", "CK", "NU", "PF", "PN", "TK", "TO", "TV", "WF", "WS"], 142: ["030", "034", "035", "142", "143", "145", "AE", "AF", "AM", "AZ", "BD", "BH", "BN", "BT", "CN", "CY", "GE", "HK", "ID", "IL", "IN", "IQ", "IR", "JO", "JP", "KG", "KH", "KP", "KR", "KW", "KZ", "LA", "LB", "LK", "MM", "MN", "MO", "MV", "MY", "NP", "OM", "PH", "PK", "PS", "QA", "SA", "SG", "SY", "TH", "TJ", "TL", "TM", "TR", "TW", "UZ", "VN", "YE"], 143: ["143", "KG", "KZ", "TJ", "TM", "UZ"], 145: ["145", "AE", "AM", "AZ", "BH", "CY", "GE", "IL", "IQ", "JO", "KW", "LB", "OM", "PS", "QA", "SA", "SY", "TR", "YE"], 150: ["039", "150", "151", "154", "155", "AD", "AL", "AT", "AX", "BA", "BE", "BG", "BY", "CH", "CQ", "CZ", "DE", "DK", "EE", "ES", "FI", "FO", "FR", "GB", "GG", "GI", "GR", "HR", "HU", "IE", "IM", "IS", "IT", "JE", "LI", "LT", "LU", "LV", "MC", "MD", "ME", "MK", "MT", "NL", "NO", "PL", "PT", "RO", "RS", "RU", "SE", "SI", "SJ", "SK", "SM", "UA", "VA", "XK"], 151: ["151", "BG", "BY", "CZ", "HU", "MD", "PL", "RO", "RU", "SK", "UA"], 154: ["154", "AX", "CQ", "DK", "EE", "FI", "FO", "GB", "GG", "IE", "IM", "IS", "JE", "LT", "LV", "NO", "SE", "SJ"], 155: ["155", "AT", "BE", "CH", "DE", "FR", "LI", "LU", "MC", "NL"], 202: ["011", "014", "017", "018", "202", "AO", "BF", "BI", "BJ", "BW", "CD", "CF", "CG", "CI", "CM", "CV", "DJ", "ER", "ET", "GA", "GH", "GM", "GN", "GQ", "GW", "IO", "KE", "KM", "LR", "LS", "MG", "ML", "MR", "MU", "MW", "MZ", "NA", "NE", "NG", "RE", "RW", "SC", "SH", "SL", "SN", "SO", "SS", "ST", "SZ", "TD", "TF", "TG", "TZ", "UG", "YT", "ZA", "ZM", "ZW"], 419: ["005", "013", "029", "419", "AG", "AI", "AR", "AW", "BB", "BL", "BO", "BQ", "BR", "BS", "BV", "BZ", "CL", "CO", "CR", "CU", "CW", "DM", "DO", "EC", "FK", "GD", "GF", "GP", "GS", "GT", "GY", "HN", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "MX", "NI", "PA", "PE", "PR", "PY", "SR", "SV", "SX", "TC", "TT", "UY", "VC", "VE", "VG", "VI"], EU: ["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "EU", "FI", "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"], EZ: ["AT", "BE", "CY", "DE", "EE", "ES", "EZ", "FI", "FR", "GR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"], QO: ["AC", "AQ", "CP", "DG", "QO", "TA"], UN: ["AD", "AE", "AF", "AG", "AL", "AM", "AO", "AR", "AT", "AU", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BN", "BO", "BR", "BS", "BT", "BW", "BY", "BZ", "CA", "CD", "CF", "CG", "CH", "CI", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "ER", "ES", "ET", "FI", "FJ", "FM", "FR", "GA", "GB", "GD", "GE", "GH", "GM", "GN", "GQ", "GR", "GT", "GW", "GY", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IN", "IQ", "IR", "IS", "IT", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MG", "MH", "MK", "ML", "MM", "MN", "MR", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NZ", "OM", "PA", "PE", "PG", "PH", "PK", "PL", "PT", "PW", "PY", "QA", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SI", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SY", "SZ", "TD", "TG", "TH", "TJ", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TZ", "UA", "UG", "UN", "US", "UY", "UZ", "VC", "VE", "VN", "VU", "WS", "YE", "ZA", "ZM", "ZW"] }, rz = /-u(?:-[0-9a-z]{2,8})+/gi;
      function rV(e10, t10, r10 = Error) {
        if (!e10) throw new r10(t10);
      }
      function rK(e10, t10, r10) {
        let [n2, i2, a2] = t10.split("-"), s2 = true;
        if (a2 && "$" === a2[0]) {
          let t11 = "!" !== a2[1], n3 = (t11 ? r10[a2.slice(1)] : r10[a2.slice(2)]).map((e11) => rF[e11] || [e11]).reduce((e11, t12) => [...e11, ...t12], []);
          s2 &&= n3.indexOf(e10.region || "") > -1 == t11;
        } else s2 &&= !e10.region || "*" === a2 || a2 === e10.region;
        return s2 &&= !e10.script || "*" === i2 || i2 === e10.script, s2 &&= !e10.language || "*" === n2 || n2 === e10.language;
      }
      function rW(e10) {
        return [e10.language, e10.script, e10.region].filter(Boolean).join("-");
      }
      function rX(e10, t10, r10) {
        for (let n2 of r10.matches) {
          let i2 = rK(e10, n2.desired, r10.matchVariables) && rK(t10, n2.supported, r10.matchVariables);
          if (n2.oneway || i2 || (i2 = rK(e10, n2.supported, r10.matchVariables) && rK(t10, n2.desired, r10.matchVariables)), i2) {
            let i3 = 10 * n2.distance;
            if (r10.paradigmLocales.indexOf(rW(e10)) > -1 != r10.paradigmLocales.indexOf(rW(t10)) > -1) return i3 - 1;
            return i3;
          }
        }
        throw Error("No matching distance found");
      }
      let rZ = (ea = function(e10, t10) {
        let r10 = new Intl.Locale(e10).maximize(), i2 = new Intl.Locale(t10).maximize(), a2 = { language: r10.language, script: r10.script || "", region: r10.region || "" }, s2 = { language: i2.language, script: i2.script || "", region: i2.region || "" }, o2 = 0, l2 = function() {
          if (!n) {
            let e11 = r$["written-new"][0]?.paradigmLocales?._locales.split(" "), t11 = r$["written-new"].slice(1, 5);
            n = { matches: r$["written-new"].slice(5).map((e12) => {
              let t12 = Object.keys(e12)[0], r11 = e12[t12];
              return { supported: t12, desired: r11._desired, distance: +r11._distance, oneway: "true" === r11.oneway };
            }, {}), matchVariables: t11.reduce((e12, t12) => {
              let r11 = Object.keys(t12)[0], n2 = t12[r11];
              return e12[r11.slice(1)] = n2._value.split("+"), e12;
            }, {}), paradigmLocales: [...e11, ...e11.map((e12) => new Intl.Locale(e12.replace(/_/g, "-")).maximize().toString())] };
          }
          return n;
        }();
        return a2.language !== s2.language && (o2 += rX({ language: r10.language, script: "", region: "" }, { language: i2.language, script: "", region: "" }, l2)), a2.script !== s2.script && (o2 += rX({ language: r10.language, script: a2.script, region: "" }, { language: i2.language, script: s2.script, region: "" }, l2)), a2.region !== s2.region && (o2 += rX(a2, s2, l2)), o2;
      }, a = (es = { serializer: (e10) => `${e10[0]}|${e10[1]}` }).cache ? es.cache : { create: function() {
        return new rH();
      } }, s = es && es.serializer ? es.serializer : function() {
        return JSON.stringify(arguments);
      }, (es && es.strategy ? es.strategy : function(e10, t10) {
        var r10, n2;
        let i2 = 1 === e10.length ? rB : rG;
        return r10 = t10.cache.create(), n2 = t10.serializer, i2.bind(this, e10, r10, n2);
      })(ea, { cache: a, serializer: s })), rJ = /* @__PURE__ */ new WeakMap();
      function rY(e10) {
        return Intl.getCanonicalLocales(e10)[0];
      }
      let rQ = /* @__PURE__ */ new WeakMap();
      var r0 = e.i(29300);
      function r1(e10, t10, r10) {
        let n2, i2 = new r0.default({ headers: { "accept-language": e10.get("accept-language") || void 0 } }).languages();
        try {
          var a2;
          let e11 = t10.slice().sort((e12, t11) => t11.length - e12.length);
          a2 = function(e12, t11, r11, n3, i3, a3) {
            let s2, o2;
            if ("lookup" === r11.localeMatcher) s2 = function(e13, t12, r12) {
              let n4 = { locale: "" };
              for (let r13 of t12) {
                let t13 = r13.replace(rz, ""), i4 = function(e14, t14) {
                  let r14 = rQ.get(e14);
                  r14 || (r14 = new Set(e14), rQ.set(e14, r14));
                  let n5 = t14;
                  for (; ; ) {
                    if (r14.has(n5)) return n5;
                    let e15 = n5.lastIndexOf("-");
                    if (!~e15) return;
                    e15 >= 2 && "-" === n5[e15 - 2] && (e15 -= 2), n5 = n5.slice(0, e15);
                  }
                }(e13, t13);
                if (i4) return n4.locale = i4, r13 !== t13 && (n4.extension = r13.slice(t13.length, r13.length)), n4;
              }
              return n4.locale = r12(), n4;
            }(Array.from(e12), t11, a3);
            else {
              var l2;
              let r12, n4, i4, o3, d3;
              l2 = Array.from(e12), i4 = [], o3 = t11.reduce((e13, t12) => {
                let r13 = t12.replace(rz, "");
                return i4.push(r13), e13[r13] = t12, e13;
              }, {}), (d3 = function(e13, t12, r13 = 838) {
                let n5 = 1 / 0, i5 = { matchedDesiredLocale: "", distances: {} }, a4 = rJ.get(t12);
                a4 || (a4 = t12.map((e14) => {
                  try {
                    return Intl.getCanonicalLocales([e14])[0] || e14;
                  } catch {
                    return e14;
                  }
                }), rJ.set(t12, a4));
                let s3 = new Set(a4);
                for (let t13 = 0; t13 < e13.length; t13++) {
                  let r14 = e13[t13];
                  if (s3.has(r14)) {
                    let e14 = 0 + 40 * t13;
                    if (i5.distances[r14] = { [r14]: e14 }, e14 < n5 && (n5 = e14, i5.matchedDesiredLocale = r14, i5.matchedSupportedLocale = r14), 0 === t13) return i5;
                  }
                }
                for (let t13 = 0; t13 < e13.length; t13++) {
                  let r14 = e13[t13];
                  try {
                    let e14 = new Intl.Locale(r14).maximize().toString();
                    if (e14 !== r14) {
                      let a5 = function(e15) {
                        let t14 = [], r15 = e15;
                        for (; r15; ) {
                          t14.push(r15);
                          let e16 = r15.lastIndexOf("-");
                          if (-1 === e16) break;
                          r15 = r15.substring(0, e16);
                        }
                        return t14;
                      }(e14);
                      for (let o4 = 0; o4 < a5.length; o4++) {
                        let l3 = a5[o4];
                        if (l3 !== r14 && s3.has(l3)) {
                          let a6;
                          try {
                            a6 = new Intl.Locale(l3).maximize().toString() === e14 ? 0 + 40 * t13 : 10 * o4 + 40 * t13;
                          } catch {
                            a6 = 10 * o4 + 40 * t13;
                          }
                          i5.distances[r14] || (i5.distances[r14] = {}), i5.distances[r14][l3] = a6, a6 < n5 && (n5 = a6, i5.matchedDesiredLocale = r14, i5.matchedSupportedLocale = l3);
                          break;
                        }
                      }
                    }
                  } catch {
                  }
                }
                return i5.matchedSupportedLocale && 0 === n5 || (n5 = 1 / 0, e13.forEach((e14, r14) => {
                  i5.distances[e14] || (i5.distances[e14] = {}), a4.forEach((a5, s4) => {
                    let o4 = t12[s4], l3 = rZ(e14, a5) + 0 + 40 * r14;
                    i5.distances[e14][o4] = l3, l3 < n5 && (n5 = l3, i5.matchedDesiredLocale = e14, i5.matchedSupportedLocale = o4);
                  });
                }), n5 >= r13 && (i5.matchedDesiredLocale = void 0, i5.matchedSupportedLocale = void 0)), i5;
              }(i4, l2)).matchedSupportedLocale && d3.matchedDesiredLocale && (r12 = d3.matchedSupportedLocale, n4 = o3[d3.matchedDesiredLocale].slice(d3.matchedDesiredLocale.length) || void 0), s2 = r12 ? { locale: r12, extension: n4 } : { locale: a3() };
            }
            null == s2 && (s2 = { locale: a3(), extension: "" });
            let d2 = s2.locale, u2 = i3[d2], c2 = { locale: "en", dataLocale: d2 };
            o2 = s2.extension ? function(e13) {
              let t12;
              rV(e13 === e13.toLowerCase(), "Expected extension to be lowercase"), rV("-u-" === e13.slice(0, 3), "Expected extension to be a Unicode locale extension");
              let r12 = [], n4 = [], i4 = e13.length, a4 = 3;
              for (; a4 < i4; ) {
                let s3, o3 = e13.indexOf("-", a4);
                s3 = -1 === o3 ? i4 - a4 : o3 - a4;
                let l3 = e13.slice(a4, a4 + s3);
                rV(s3 >= 2, "Expected a subtag to have at least 2 characters"), void 0 === t12 && 2 != s3 ? -1 === r12.indexOf(l3) && r12.push(l3) : 2 === s3 ? (t12 = { key: l3, value: "" }, void 0 === n4.find((e14) => e14.key === t12?.key) && n4.push(t12)) : t12?.value === "" ? t12.value = l3 : (rV(void 0 !== t12, "Expected keyword to be defined"), t12.value += "-" + l3), a4 += s3 + 1;
              }
              return { attributes: r12, keywords: n4 };
            }(s2.extension).keywords : [];
            let h2 = [];
            for (let e13 of n3) {
              let t12, n4 = u2?.[e13] ?? [];
              rV(Array.isArray(n4), `keyLocaleData for ${e13} must be an array`);
              let i4 = n4[0];
              rV(void 0 === i4 || "string" == typeof i4, "value must be a string or undefined");
              let a4 = o2.find((t13) => t13.key === e13);
              if (a4) {
                let r12 = a4.value;
                "" !== r12 ? n4.indexOf(r12) > -1 && (t12 = { key: e13, value: i4 = r12 }) : n4.indexOf("true") > -1 && (t12 = { key: e13, value: i4 = "true" });
              }
              let s3 = r11[e13];
              rV(null == s3 || "string" == typeof s3, "optionsValue must be a string or undefined"), "string" == typeof s3 && "" === (s3 = function(e14, t13) {
                let r12 = t13.toLowerCase();
                return rV(void 0 !== e14, "ukey must be defined"), r12;
              }(e13.toLowerCase(), s3)) && (s3 = "true"), s3 !== i4 && n4.indexOf(s3) > -1 && (i4 = s3, t12 = void 0), t12 && h2.push(t12), c2[e13] = i4;
            }
            return h2.length > 0 && (d2 = function(e13, t12, r12) {
              rV(-1 === e13.indexOf("-u-"), "Expected locale to not have a Unicode locale extension");
              let n4 = "-u";
              for (let e14 of t12) n4 += `-${e14}`;
              for (let e14 of r12) {
                let { key: t13, value: r13 } = e14;
                n4 += `-${t13}`, "" !== r13 && (n4 += `-${r13}`);
              }
              if ("-u" === n4) return rY(e13);
              let i4 = e13.indexOf("-x-");
              return rY(-1 === i4 ? e13 + n4 : e13.slice(0, i4) + n4 + e13.slice(i4));
            }(d2, [], h2)), c2.locale = d2, c2;
          }(e11, Intl.getCanonicalLocales(i2), { localeMatcher: "best fit" }, [], {}, () => r10).locale, n2 = t10.find((e12) => e12.toLowerCase() === a2.toLowerCase());
        } catch {
        }
        return n2;
      }
      function r3(e10, t10) {
        if (e10.localeCookie && t10.has(e10.localeCookie.name)) {
          let r10 = t10.get(e10.localeCookie.name)?.value;
          if (r10 && e10.locales.includes(r10)) return r10;
        }
      }
      function r2(e10, t10, r10, n2) {
        let i2;
        return n2 && (i2 = rI(n2, e10.locales, e10.localePrefix)?.locale), !i2 && e10.localeDetection && (i2 = r3(e10, r10)), !i2 && e10.localeDetection && (i2 = r1(t10, e10.locales, e10.defaultLocale)), i2 || (i2 = e10.defaultLocale), i2;
      }
      let r4 = { locales: ["en", "ar"], defaultLocale: "en", localePrefix: "always" }, r5 = (o = { ...r4, localePrefix: "object" == typeof (el = r4.localePrefix) ? el : { mode: el || "always" }, localeCookie: !!((eo = r4.localeCookie) ?? 1) && { name: "NEXT_LOCALE", sameSite: "lax", ..."object" == typeof eo && eo }, localeDetection: r4.localeDetection ?? true, alternateLinks: r4.alternateLinks ?? true }, function(e10) {
        var t10, r10;
        let n2;
        try {
          n2 = decodeURI(e10.nextUrl.pathname);
        } catch {
          return em.next();
        }
        let i2 = n2.replace(/\\/g, "%5C").replace(/[\t\n\r]/g, "").replace(/\/+/g, "/"), { domain: a2, locale: s2 } = (t10 = e10.headers, r10 = e10.cookies, o.domains ? function(e11, t11, r11, n3) {
          let i3, a3 = function(e12, t12) {
            let r12 = rD(e12);
            if (r12) return t12.find((e13) => e13.domain === r12);
          }(t11, e11.domains);
          if (!a3) return { locale: r2(e11, t11, r11, n3) };
          if (n3) {
            let t12 = rI(n3, e11.locales, e11.localePrefix, a3)?.locale;
            if (t12) {
              if (!rj(t12, a3)) return { locale: t12, domain: a3 };
              i3 = t12;
            }
          }
          if (!i3 && e11.localeDetection) {
            let t12 = r3(e11, r11);
            t12 && rj(t12, a3) && (i3 = t12);
          }
          if (!i3 && e11.localeDetection) {
            let e12 = r1(t11, a3.locales, a3.defaultLocale);
            e12 && (i3 = e12);
          }
          return i3 || (i3 = a3.defaultLocale), { locale: i3, domain: a3 };
        }(o, t10, r10, i2) : { locale: r2(o, t10, r10, i2) }), l2 = a2 ? a2.defaultLocale === s2 : s2 === o.defaultLocale, d2 = o.domains?.filter((e11) => rj(s2, e11)) || [], u2 = null != o.domains && !a2;
        function c2(t11) {
          var r11;
          let n3 = new URL(t11, e10.url);
          e10.nextUrl.basePath && (r11 = n3.pathname, n3.pathname = rC(e10.nextUrl.basePath + r11));
          let i3 = new Headers(e10.headers);
          return i3.set("X-NEXT-INTL-LOCALE", s2), rC(e10.nextUrl.pathname) !== rC(n3.pathname) ? em.rewrite(n3, { request: { headers: i3 } }) : em.next({ request: { headers: i3 } });
        }
        function h2(t11, r11) {
          var n3;
          let i3 = new URL(t11, e10.url);
          if (i3.pathname = rC(i3.pathname), d2.length > 0 && !r11 && a2) {
            let e11 = rU(a2, s2, d2);
            if (e11) {
              r11 = e11.domain;
              let t12 = e11.localePrefix || o.localePrefix.mode;
              e11.defaultLocale === s2 && "as-needed" === t12 && (i3.pathname = rL(i3.pathname, o.locales, o.localePrefix));
            }
          }
          return r11 && (i3.host = r11, e10.headers.get("x-forwarded-host")) && (i3.protocol = e10.headers.get("x-forwarded-proto") ?? e10.nextUrl.protocol, i3.port = r11.split(":")[1] ?? e10.headers.get("x-forwarded-port") ?? ""), e10.nextUrl.basePath && (n3 = i3.pathname, i3.pathname = rC(e10.nextUrl.basePath + n3)), v2 = true, em.redirect(i3.toString());
        }
        let f2 = rL(i2, o.locales, o.localePrefix), p2 = rI(i2, o.locales, o.localePrefix, a2), _2 = null != p2, g2 = a2?.localePrefix || o.localePrefix.mode, m2 = "never" === g2 || l2 && "as-needed" === g2, y2, w2, v2, b2 = f2, x2 = o.pathnames;
        if (x2) {
          let t11;
          if ([t11, w2] = function(e11, t12, r11) {
            for (let n3 of Object.keys(e11).sort(rk)) {
              let i3 = e11[n3];
              if ("string" == typeof i3) {
                if (rS(i3, t12)) return [void 0, n3];
              } else {
                let a3 = Object.entries(i3), s3 = a3.findIndex(([e12]) => e12 === r11);
                for (let [r12] of (s3 > 0 && a3.unshift(a3.splice(s3, 1)[0]), a3)) if (rS(rE(e11[n3], r12, n3), t12)) return [r12, n3];
              }
            }
            for (let r12 of Object.keys(e11)) if (rS(r12, t12)) return [void 0, r12];
            return [void 0, void 0];
          }(x2, f2, s2), w2) {
            let r11 = x2[w2], n3 = rE(r11, s2, w2);
            if (rS(n3, f2)) b2 = rN(f2, n3, w2);
            else {
              let i3;
              i3 = t11 ? rE(r11, t11, w2) : w2;
              let a3 = m2 ? void 0 : rR(s2, o.localePrefix);
              y2 = h2(rq(rN(f2, i3, n3), a3, e10.nextUrl.search));
            }
          }
        }
        if (!y2) if ("/" !== b2 || _2) {
          let t11 = rq(b2, `/${s2}`, e10.nextUrl.search);
          if (_2) {
            let r11 = rq(f2, p2.prefix, e10.nextUrl.search);
            if ("never" === g2) y2 = h2(rq(f2, void 0, e10.nextUrl.search));
            else if (p2.exact) if (l2 && m2) y2 = h2(rq(f2, void 0, e10.nextUrl.search));
            else if (o.domains) {
              let e11 = rU(a2, p2.locale, d2);
              y2 = a2?.domain === e11?.domain || u2 ? c2(t11) : h2(r11, e11?.domain);
            } else y2 = c2(t11);
            else y2 = h2(r11);
          } else y2 = m2 ? c2(t11) : h2(rq(f2, rR(s2, o.localePrefix), e10.nextUrl.search));
        } else y2 = m2 ? c2(rq(b2, `/${s2}`, e10.nextUrl.search)) : h2(rq(f2, rR(s2, o.localePrefix), e10.nextUrl.search));
        return function(e11, t11, r11, n3, i3) {
          if (!n3.localeCookie) return;
          let a3 = e11.headers.get("sec-fetch-dest");
          if (null != a3 && "document" !== a3) return;
          let { name: s3, ...o2 } = n3.localeCookie, l3 = e11.cookies.has(s3);
          l3 && e11.cookies.get(s3)?.value !== r11 ? t11.cookies.set(s3, r11, { path: e11.nextUrl.basePath || void 0, ...o2 }) : l3 || r1(e11.headers, i3?.locales || n3.locales, n3.defaultLocale) === r11 || t11.cookies.set(s3, r11, { path: e11.nextUrl.basePath || void 0, ...o2 });
        }(e10, y2, s2, o, a2), !v2 && "never" !== g2 && o.alternateLinks && o.locales.length > 1 && y2.headers.set("Link", function({ internalTemplateName: e11, localizedPathnames: t11, request: r11, resolvedLocale: n3, routing: i3 }) {
          let a3 = r11.nextUrl.clone(), s3 = rD(r11.headers);
          function o2(e12, t12) {
            var n4;
            return e12.pathname = rC(e12.pathname), r11.nextUrl.basePath && ((e12 = new URL(e12)).pathname = (n4 = e12.pathname, rC(r11.nextUrl.basePath + n4))), `<${e12.toString()}>; rel="alternate"; hreflang="${t12}"`;
          }
          function l3(r12, i4) {
            return t11 && "object" == typeof t11 ? rN(r12, t11[n3] ?? e11, t11[i4] ?? e11) : r12;
          }
          s3 && (a3.port = "", a3.host = s3), a3.protocol = r11.headers.get("x-forwarded-proto") ?? a3.protocol, a3.pathname = rL(a3.pathname, i3.locales, i3.localePrefix);
          let d3 = rM(i3.locales, i3.localePrefix, false).flatMap(([e12, r12]) => {
            let n4;
            function s4(e13) {
              return "/" === e13 ? r12 : r12 + e13;
            }
            if (i3.domains) return i3.domains.filter((t12) => rj(e12, t12)).map((t12) => {
              (n4 = new URL(a3)).port = "", n4.host = t12.domain, n4.pathname = l3(a3.pathname, e12);
              let r13 = t12.localePrefix || i3.localePrefix.mode;
              return e12 === t12.defaultLocale && "always" !== r13 || (n4.pathname = s4(n4.pathname)), o2(n4, e12);
            });
            {
              let r13;
              r13 = t11 && "object" == typeof t11 ? l3(a3.pathname, e12) : a3.pathname, e12 === i3.defaultLocale && "always" !== i3.localePrefix.mode || (r13 = s4(r13)), n4 = new URL(r13, a3);
            }
            return o2(n4, e12);
          });
          if (!i3.domains || 0 === i3.domains.length) {
            let e12 = l3(a3.pathname, i3.defaultLocale);
            if (e12) {
              let t12 = new URL(e12, a3);
              d3.push(o2(t12, "x-default"));
            }
          }
          return d3.join(", ");
        }({ routing: o, internalTemplateName: w2, localizedPathnames: null != w2 && x2 ? x2[w2] : void 0, request: e10, resolvedLocale: s2 })), y2;
      }), r9 = RegExp(`^/(${r4.locales.join("|")})/admin(/.*)?$`);
      e.s(["config", 0, { matcher: ["/((?!api|_next|_vercel|admin|.*..*).*)"] }, "default", 0, function(e10) {
        return function(e11) {
          let t10 = e11.nextUrl.pathname.match(r9);
          if (!t10) return;
          let [, , r10] = t10, n2 = e11.nextUrl.clone();
          return n2.pathname = `/admin${r10 ?? ""}`, em.redirect(n2, 308);
        }(e10) ?? r5(e10);
      }], 96592);
      let r6 = { ...e.i(96592) }, r7 = "/middleware", r8 = r6.middleware || r6.default;
      if ("function" != typeof r8) throw new class extends Error {
        constructor(e10) {
          super(e10), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true }), this.stack = "";
        }
      }(`The Middleware file "${r7}" must export a function named \`middleware\` or a default function.`);
      let ne = async (e10) => tM({ ...e10, IncrementalCache: rv, incrementalCacheHandler: null, page: r7, handler: async (...e11) => {
        try {
          return await r8(...e11);
        } catch (i2) {
          let t10 = e11[0], r10 = new URL(t10.url), n2 = r10.pathname + r10.search;
          throw await c(i2, { path: n2, method: t10.method, headers: Object.fromEntries(t10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/proxy", routeType: "proxy", revalidateReason: void 0 }), i2;
        }
      } });
      async function nt(e10, t10) {
        let r10 = await ne({ request: { url: e10.url, method: e10.method, headers: R(e10.headers), nextConfig: { basePath: "", i18n: "", trailingSlash: false, experimental: { cacheLife: { default: { stale: 300, revalidate: 900, expire: 4294967294 }, seconds: { stale: 30, revalidate: 1, expire: 60 }, minutes: { stale: 300, revalidate: 60, expire: 3600 }, hours: { stale: 300, revalidate: 3600, expire: 86400 }, days: { stale: 300, revalidate: 86400, expire: 604800 }, weeks: { stale: 300, revalidate: 604800, expire: 2592e3 }, max: { stale: 300, revalidate: 2592e3, expire: 31536e3 } }, authInterrupts: false, clientParamParsingOrigins: [] } }, page: { name: r7 }, body: "GET" !== e10.method && "HEAD" !== e10.method ? e10.body ?? void 0 : void 0, waitUntil: t10.waitUntil, requestMeta: t10.requestMeta, signal: t10.signal || new AbortController().signal } });
        return null == t10.waitUntil || t10.waitUntil.call(t10, r10.waitUntil), r10.response;
      }
      e.s(["default", 0, ne, "handler", 0, nt], 58217);
    }]);
  }
});

// .next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1-fkxah.js
var require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_1_fkxah = __commonJS({
  ".next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1-fkxah.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1-fkxah.js", { otherChunks: ["chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0_kjzx3.js", "chunks/[root-of-the-server]__1hepuqv._.js"], runtimeModuleIds: [35825] }]), (() => {
      let e;
      if (!Array.isArray(globalThis.TURBOPACK)) return;
      var t, r = ((t = r || {})[t.Runtime = 0] = "Runtime", t[t.Parent = 1] = "Parent", t[t.Update = 2] = "Update", t);
      let n = /* @__PURE__ */ new WeakMap();
      function o(e2, t2) {
        this.m = e2, this.e = t2;
      }
      let u = o.prototype, i = Object.prototype.hasOwnProperty, l = "u" > typeof Symbol && Symbol.toStringTag;
      function a(e2, t2, r2) {
        i.call(e2, t2) || Object.defineProperty(e2, t2, r2);
      }
      function s(e2, t2) {
        let r2 = e2[t2];
        return r2 || (r2 = c(t2), e2[t2] = r2), r2;
      }
      function c(e2) {
        return { exports: {}, error: void 0, id: e2, namespaceObject: void 0 };
      }
      function f(e2, t2, r2) {
        a(e2, "__esModule", { value: true }), l && a(e2, l, { value: "Module" });
        let n2 = 0;
        for (; n2 < t2.length; ) {
          let r3 = t2[n2++], o2 = t2[n2++];
          if ("number" == typeof o2) if (0 === o2) a(e2, r3, { value: t2[n2++], enumerable: true, writable: false });
          else throw Error(`unexpected tag: ${o2}`);
          else "function" == typeof t2[n2] ? a(e2, r3, { get: o2, set: t2[n2++], enumerable: true }) : a(e2, r3, { get: o2, enumerable: true });
        }
        r2 || Object.seal(e2);
      }
      function p(e2, t2) {
        (null != t2 ? s(this.c, t2) : this.m).exports = e2;
      }
      u.s = function(e2, t2, r2) {
        let n2, o2;
        null != t2 ? o2 = (n2 = s(this.c, t2)).exports : (n2 = this.m, o2 = this.e), n2.namespaceObject = o2, f(o2, e2, r2);
      }, u.j = function(e2, t2) {
        let r2, o2;
        null != t2 ? o2 = (r2 = s(this.c, t2)).exports : (r2 = this.m, o2 = this.e);
        let u2 = function(e3, t3) {
          let r3 = n.get(e3);
          if (!r3) {
            n.set(e3, r3 = []);
            let o3 = (e4) => {
              if ("default" !== e4) {
                for (let t4 of r3) if (i.call(t4, e4)) return t4;
              }
            };
            e3.exports = e3.namespaceObject = new Proxy(t3, { get(e4, t4) {
              if (i.call(e4, t4) || "default" === t4 || "__esModule" === t4) return Reflect.get(e4, t4);
              let r4 = o3(t4);
              return r4 && Reflect.get(r4, t4);
            }, set: () => false, defineProperty: () => false, deleteProperty: () => false, has: (e4, t4) => !!Reflect.has(e4, t4) || "default" !== t4 && "__esModule" !== t4 && void 0 !== o3(t4), ownKeys(e4) {
              let t4 = Reflect.ownKeys(e4);
              for (let e5 of r3) for (let r4 of Reflect.ownKeys(e5)) "default" === r4 || t4.includes(r4) || t4.push(r4);
              return t4;
            }, getOwnPropertyDescriptor(e4, t4) {
              let r4 = Reflect.getOwnPropertyDescriptor(e4, t4);
              if (r4 || "default" === t4 || "__esModule" === t4) return r4;
              let n2 = o3(t4);
              if (n2) return { enumerable: true, configurable: true, get: () => Reflect.get(n2, t4) };
            } });
          }
          return r3;
        }(r2, o2);
        "object" == typeof e2 && null !== e2 && u2.push(e2);
      }, u.v = p, u.n = function(e2, t2) {
        let r2;
        (r2 = null != t2 ? s(this.c, t2) : this.m).exports = r2.namespaceObject = e2;
      };
      let d = Object.getPrototypeOf ? (e2) => Object.getPrototypeOf(e2) : (e2) => e2.__proto__, h = [null, d({}), d([]), d(d)];
      function m(e2, t2, r2) {
        let n2 = [], o2 = -1;
        for (let t3 = e2; ("object" == typeof t3 || "function" == typeof t3) && !h.includes(t3); t3 = d(t3)) for (let r3 of Object.getOwnPropertyNames(t3)) n2.push(r3, /* @__PURE__ */ function(e3, t4) {
          return () => e3[t4];
        }(e2, r3)), -1 === o2 && "default" === r3 && (o2 = n2.length - 1);
        return r2 && o2 >= 0 || (o2 >= 0 ? n2.splice(o2, 1, 0, e2) : n2.push("default", 0, e2)), f(t2, n2), t2;
      }
      function b(e2) {
        return "function" == typeof e2 ? function(...t2) {
          return e2.apply(this, t2);
        } : /* @__PURE__ */ Object.create(null);
      }
      function y(e2) {
        let t2 = I(e2, this.m);
        if (t2.namespaceObject) return t2.namespaceObject;
        let r2 = t2.exports;
        return t2.namespaceObject = m(r2, b(r2), r2 && r2.__esModule);
      }
      function g(e2) {
        let t2 = e2.indexOf("#");
        -1 !== t2 && (e2 = e2.substring(0, t2));
        let r2 = e2.indexOf("?");
        return -1 !== r2 && (e2 = e2.substring(0, r2)), e2;
      }
      function O(e2) {
        return "string" == typeof e2 ? e2 : e2.path;
      }
      u.i = y, u.A = function(e2) {
        return this.r(e2)(y.bind(this));
      }, u.t = "function" == typeof __require ? __require : function() {
        throw Error("Unexpected use of runtime require");
      }, u.r = function(e2) {
        return I(e2, this.m).exports;
      }, u.f = function(e2) {
        function t2(t3) {
          if (t3 = g(t3), i.call(e2, t3)) return e2[t3].module();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }
        return t2.keys = () => Object.keys(e2), t2.resolve = (t3) => {
          if (t3 = g(t3), i.call(e2, t3)) return e2[t3].id();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }, t2.import = async (e3) => await t2(e3), t2;
      };
      let w = function(e2) {
        let t2 = new URL(e2, "x:/"), r2 = {};
        for (let e3 in t2) r2[e3] = t2[e3];
        for (let t3 in r2.href = e2, r2.pathname = e2.replace(/[?#].*/, ""), r2.origin = r2.protocol = "", r2.toString = r2.toJSON = (...t4) => e2, r2) Object.defineProperty(this, t3, { enumerable: true, configurable: true, value: r2[t3] });
      };
      function _(e2, t2) {
        throw Error(`Invariant: ${t2(e2)}`);
      }
      w.prototype = URL.prototype, u.U = w, u.z = function(e2) {
        throw Error("dynamic usage of require is not supported");
      }, u.g = globalThis;
      let k = Symbol("turbopack queues"), j = Symbol("turbopack exports"), C = Symbol("turbopack error");
      function P() {
        let e2, t2;
        return { promise: new Promise((r2, n2) => {
          t2 = n2, e2 = r2;
        }), resolve: e2, reject: t2 };
      }
      function R(e2) {
        e2 && 1 !== e2.status && (e2.status = 1, e2.forEach((e3) => e3.queueCount--), e2.forEach((e3) => e3.queueCount-- ? e3.queueCount++ : e3()));
      }
      u.a = function(e2, t2) {
        let r2 = this.m, n2 = t2 ? Object.assign([], { status: -1 }) : void 0, o2 = /* @__PURE__ */ new Set(), { resolve: u2, reject: i2, promise: l2 } = P(), a2 = Object.assign(l2, { [j]: r2.exports, [k]: (e3) => {
          n2 && e3(n2), o2.forEach(e3), a2.catch(() => {
          });
        } }), s2 = { get: () => a2, set(e3) {
          e3 !== a2 && (a2[j] = e3);
        } };
        Object.defineProperty(r2, "exports", s2), Object.defineProperty(r2, "namespaceObject", s2), e2(function(e3) {
          let t3 = e3.map((e4) => {
            if (null !== e4 && "object" == typeof e4) {
              if (k in e4) return e4;
              if (null != e4 && "object" == typeof e4 && "then" in e4 && "function" == typeof e4.then) {
                let t4 = Object.assign([], { status: 0 }), r4 = { [j]: {}, [k]: (e5) => e5(t4) };
                return e4.then((e5) => {
                  r4[j] = e5, R(t4);
                }, (e5) => {
                  r4[C] = e5, R(t4);
                }), r4;
              }
            }
            return { [j]: e4, [k]: () => {
            } };
          }), r3 = () => t3.map((e4) => {
            if (e4[C]) throw e4[C];
            return e4[j];
          }), { promise: u3, resolve: i3 } = P(), l3 = Object.assign(() => i3(r3), { queueCount: 0 });
          function a3(e4) {
            e4 !== n2 && !o2.has(e4) && (o2.add(e4), e4 && 0 === e4.status && (l3.queueCount++, e4.push(l3)));
          }
          return t3.map((e4) => e4[k](a3)), l3.queueCount ? u3 : r3();
        }, function(e3) {
          e3 ? i2(a2[C] = e3) : u2(a2[j]), R(n2);
        }), n2 && -1 === n2.status && (n2.status = 0);
      };
      let v = o.prototype, x = /* @__PURE__ */ new Map();
      u.M = x;
      let U = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map();
      async function E(e2, t2, r2) {
        let n2;
        if ("string" == typeof r2) return function(e3, t3, r3) {
          return A(e3, t3, r3);
        }(e2, t2, K(r2));
        let o2 = r2.included || [], u2 = o2.map((e3) => !!x.has(e3) || U.get(e3));
        if (u2.length > 0 && u2.every((e3) => e3)) return void await Promise.all(u2);
        for (let u3 of (n2 = A(e2, t2, K(r2.path)), o2)) U.has(u3) || U.set(u3, n2);
        await n2;
      }
      v.l = function(e2) {
        return E(r.Parent, this.m.id, e2);
      };
      let T = Promise.resolve(void 0), q = /* @__PURE__ */ new WeakMap();
      function A(t2, n2, o2) {
        let u2 = e.loadChunkCached(t2, o2), i2 = q.get(u2);
        if (void 0 === i2) {
          let e2 = q.set.bind(q, u2, T);
          i2 = u2.then(e2).catch((e3) => {
            let u3;
            switch (t2) {
              case r.Runtime:
                u3 = `as a runtime dependency of chunk ${n2}`;
                break;
              case r.Parent:
                u3 = `from module ${n2}`;
                break;
              case r.Update:
                u3 = "from an HMR update";
                break;
              default:
                _(t2, (e4) => `Unknown source type: ${e4}`);
            }
            let i3 = Error(`Failed to load chunk ${o2} ${u3}${e3 ? `: ${e3}` : ""}`, e3 ? { cause: e3 } : void 0);
            throw i3.name = "ChunkLoadError", i3;
          }), q.set(u2, i2);
        }
        return i2;
      }
      v.L = function(e2) {
        var t2, n2;
        return t2 = r.Parent, n2 = this.m.id, A(t2, n2, e2);
      };
      v.R = function(e2) {
        let t2 = this.r(e2);
        return t2?.default ?? t2;
      }, v.P = function(e2) {
        return `/ROOT/${e2 ?? ""}`;
      }, v.F = function(e2) {
        return e2 ? `file:///ROOT/${e2.split("/").map(encodeURIComponent).join("/")}` : "file:///ROOT/";
      }, v.q = function(e2, t2) {
        p.call(this, `${e2}`, t2);
      };
      let S = /[^A-Za-z0-9\-_.!~*'()/]/;
      function K(e2, t2 = "") {
        let r2 = S.test(e2) ? e2.split("/").map(encodeURIComponent).join("/") : e2;
        return `${t2}${r2}`;
      }
      v.b = "", v.X = "", v.h = K;
      let N = {};
      u.c = N;
      let I = (e2, t2) => {
        let n2 = N[e2];
        if (n2) {
          if (n2.error) throw n2.error;
          return n2;
        }
        return L(e2, r.Parent, t2.id);
      };
      function L(e2, t2, r2) {
        let n2 = x.get(e2);
        if ("function" != typeof n2) throw Error(function(e3, t3, r3) {
          let n3;
          switch (t3) {
            case 0:
              n3 = `as a runtime entry of chunk ${r3}`;
              break;
            case 1:
              n3 = `because it was required from module ${r3}`;
              break;
            case 2:
              n3 = "because of an HMR update";
              break;
            default:
              _(t3, (e4) => `Unknown source type: ${e4}`);
          }
          return `Module ${e3} was instantiated ${n3}, but the module factory is not available.`;
        }(e2, t2, r2));
        let u2 = c(e2), i2 = u2.exports;
        N[e2] = u2;
        let l2 = new o(u2, i2);
        try {
          n2(l2, u2, i2);
        } catch (e3) {
          throw u2.error = e3, e3;
        }
        return u2.namespaceObject && u2.exports !== u2.namespaceObject && m(u2.exports, u2.namespaceObject), u2;
      }
      function B(t2) {
        let r2;
        if (!Array.isArray(t2)) return e.registerChunk(void 0, t2);
        let n2 = function(e2) {
          if ("string" == typeof e2) return e2;
          if (e2) return { src: e2.getAttribute("src") };
          if ("u" > typeof TURBOPACK_NEXT_CHUNK_URLS) return { src: TURBOPACK_NEXT_CHUNK_URLS.pop() };
          throw Error("chunk path empty but not in a worker");
        }(t2[0]);
        return 2 === t2.length ? r2 = t2[1] : (r2 = void 0, !function(e2, t3) {
          let r3 = 1;
          for (; r3 < e2.length; ) {
            let n3, o2 = r3 + 1;
            for (; o2 < e2.length && "function" != typeof e2[o2]; ) o2++;
            if (o2 === e2.length) throw Error("malformed chunk format, expected a factory function");
            let u2 = e2[o2];
            for (let u3 = r3; u3 < o2; u3++) {
              let r4 = e2[u3], o3 = t3.get(r4);
              if (o3) {
                n3 = o3;
                break;
              }
            }
            let i2 = n3 ?? u2, l2 = false;
            for (let n4 = r3; n4 < o2; n4++) {
              let r4 = e2[n4];
              t3.has(r4) || (l2 || (i2 === u2 && Object.defineProperty(u2, "name", { value: "module evaluation" }), l2 = true), t3.set(r4, i2));
            }
            r3 = o2 + 1;
          }
        }(t2, x)), e.registerChunk(n2, r2);
      }
      function D(e2, t2, r2 = false) {
        let n2;
        try {
          n2 = t2();
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return !r2 || n2.__esModule ? n2 : m(n2, b(n2), true);
      }
      u.y = async function(e2) {
        let t2;
        try {
          t2 = await import(e2);
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return t2 && t2.__esModule && t2.default && "default" in t2.default ? m(t2.default, b(t2), true) : t2;
      }, D.resolve = (e2, t2) => __require.resolve(e2, t2), u.x = D, e = { registerChunk(e2, t2) {
        if (null == e2) throw Error("inline entry registration is not supported");
        let r2 = function(e3) {
          if ("string" == typeof e3) return e3;
          let t3 = decodeURIComponent(e3.src.replace(/[?#].*$/, ""));
          return t3.startsWith("") ? t3.slice(0) : t3;
        }(e2);
        F.add(r2), function(e3) {
          let t3 = z.get(e3);
          if (null != t3) {
            for (let r3 of t3) r3.requiredChunks.delete(e3), 0 === r3.requiredChunks.size && H(r3.runtimeModuleIds, r3.chunkPath);
            z.delete(e3);
          }
        }(r2), null != t2 && (0 === t2.otherChunks.length ? H(t2.runtimeModuleIds, r2) : function(e3, t3, r3) {
          let n2 = /* @__PURE__ */ new Set(), o2 = { runtimeModuleIds: r3, chunkPath: e3, requiredChunks: n2 };
          for (let e4 of t3) {
            let t4 = O(e4);
            if (F.has(t4)) continue;
            n2.add(t4);
            let r4 = z.get(t4);
            null == r4 && (r4 = /* @__PURE__ */ new Set(), z.set(t4, r4)), r4.add(o2);
          }
          0 === o2.requiredChunks.size && H(o2.runtimeModuleIds, o2.chunkPath);
        }(r2, t2.otherChunks.filter((e3) => function(e4) {
          let t3, r3 = e4.indexOf("?");
          if (-1 !== r3) t3 = r3;
          else {
            let r4 = e4.indexOf("#");
            t3 = -1 !== r4 ? r4 : e4.length;
          }
          return t3 >= 3 && e4.startsWith(".js", t3 - 3);
        }(O(e3))), t2.runtimeModuleIds));
      }, loadChunkCached(e2, t2) {
        throw Error("chunk loading is not supported");
      } };
      let F = /* @__PURE__ */ new Set(), z = /* @__PURE__ */ new Map();
      function H(e2, t2) {
        for (let n2 of e2) !function(e3, t3) {
          let n3 = N[t3];
          if (n3) {
            if (n3.error) throw n3.error;
            return;
          }
          L(t3, r.Runtime, e3);
        }(t2, n2);
      }
      var W = globalThis.TURBOPACK;
      globalThis.TURBOPACK = { push: B }, W.forEach(B);
    })();
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(path3);
  } catch {
  }
  const correspondingRoute = routes.find((route) => route.regex.some((r) => {
    const regex = new RegExp(r);
    return regex.test(path3) || decodedPath !== void 0 && regex.test(decodedPath);
  }));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!api|_next|_vercel|admin|.*..*).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$"] }];
    require_node_modules_next_dist_esm_build_templates_edge_wrapper_0_kjzx3();
    require_root_of_the_server_1hepuqv();
    require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_1_fkxah();
  }
});

// node_modules/@opennextjs/aws/dist/utils/cacheHeaders.js
var CACHE_CONTROL_HEADER = "cache-control";
var OPEN_NEXT_CACHE_HEADER = "x-opennext-cache";
var CACHE_TAGS_HEADER = "x-next-cache-tags";
var ISR_HEADER = "x-isr";
var PRERENDER_REVALIDATE_HEADER = "x-prerender-revalidate";
var NO_STORE_CACHE_CONTROL = "private, no-cache, no-store, max-age=0, must-revalidate";
function fixCacheControlForError(headers, statusCode) {
  if (process.env.OPEN_NEXT_DANGEROUSLY_SET_ERROR_HEADERS === "true") {
    return;
  }
  if (statusCode === 404 || statusCode === 500) {
    headers[CACHE_CONTROL_HEADER] = NO_STORE_CACHE_CONTROL;
  }
}

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/requestCache.js
var RequestCache = class {
  _caches = /* @__PURE__ */ new Map();
  /**
   * Returns the Map registered under `key`.
   * If no Map exists yet for that key, a new empty Map is created, stored, and returned.
   * Repeated calls with the same key always return the **same** Map instance.
   */
  getOrCreate(key) {
    let cache = this._caches.get(key);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      this._caches.set(key, cache);
    }
    return cache;
  }
};

// node_modules/@opennextjs/aws/dist/utils/promise.js
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set(),
    requestCache: new RequestCache()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "typescript": { "ignoreBuildErrors": true }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.mjs", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "instrumentationClientInject": [], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [{ "protocol": "https", "hostname": "res.cloudinary.com" }], "qualities": [75, 78, 80, 85], "unoptimized": false, "customCacheHandler": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": { "serverFunctions": true, "browserToTerminal": "warn" }, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "D:\\Job\\ceo_bussiness", "enablePrerenderSourceMaps": true, "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "appNewScrollHandler": true, "coldCacheBadge": false, "devValidationWorker": true, "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "cachedNavigations": false, "dynamicOnHover": false, "useOffline": false, "varyParams": true, "optimisticRouting": true, "instrumentationClientRouterTransitionEvents": false, "prefetchInlining": { "maxSize": 2048, "maxBundleSize": 10240 }, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 11, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptOperationCache": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "devMemoryThresholdRestart": true, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "requestInsights": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "strictRouteTypes": false, "useTypeScriptCli": true, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": true, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": true, "serverComponentsHmrCache": true, "serverComponentsHmrCancellation": false, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "gestureTransition": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": "warn", "lockDistDir": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": true, "turbopackInferModuleSideEffects": true, "turbopackPluginRuntimeStrategy": "childProcesses", "turbopackMemoryEvictionMode": "auto", "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "useCacheTimeout": 54, "instantInsights": { "validationLevel": "warning" }, "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.mjs", "serverExternalPackages": ["firebase-admin"], "turbopack": { "resolveAlias": { "next-intl/config": "./src/i18n/request.ts" }, "root": "D:\\Job\\ceo_bussiness" }, "repoRoot": "D:\\Job\\ceo_bussiness", "distDirRoot": ".next" };
var BuildId = "P8zI_NGM5yju4ZWIg1fAA";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/admin", "regex": "^/admin(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin(?:/)?$" }, { "page": "/admin/about", "regex": "^/admin/about(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/about(?:/)?$" }, { "page": "/admin/api/blog", "regex": "^/admin/api/blog(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/api/blog(?:/)?$" }, { "page": "/admin/api/faq", "regex": "^/admin/api/faq(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/api/faq(?:/)?$" }, { "page": "/admin/api/inquiry", "regex": "^/admin/api/inquiry(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/api/inquiry(?:/)?$" }, { "page": "/admin/api/media", "regex": "^/admin/api/media(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/api/media(?:/)?$" }, { "page": "/admin/api/media/upload", "regex": "^/admin/api/media/upload(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/api/media/upload(?:/)?$" }, { "page": "/admin/api/projects", "regex": "^/admin/api/projects(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/api/projects(?:/)?$" }, { "page": "/admin/api/services", "regex": "^/admin/api/services(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/api/services(?:/)?$" }, { "page": "/admin/api/settings", "regex": "^/admin/api/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/api/settings(?:/)?$" }, { "page": "/admin/api/testimonials", "regex": "^/admin/api/testimonials(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/api/testimonials(?:/)?$" }, { "page": "/admin/auth/session", "regex": "^/admin/auth/session(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/auth/session(?:/)?$" }, { "page": "/admin/blog", "regex": "^/admin/blog(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/blog(?:/)?$" }, { "page": "/admin/blog/new", "regex": "^/admin/blog/new(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/blog/new(?:/)?$" }, { "page": "/admin/faq", "regex": "^/admin/faq(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/faq(?:/)?$" }, { "page": "/admin/faq/new", "regex": "^/admin/faq/new(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/faq/new(?:/)?$" }, { "page": "/admin/inquiries", "regex": "^/admin/inquiries(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/inquiries(?:/)?$" }, { "page": "/admin/login", "regex": "^/admin/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/login(?:/)?$" }, { "page": "/admin/media", "regex": "^/admin/media(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/media(?:/)?$" }, { "page": "/admin/overview", "regex": "^/admin/overview(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/overview(?:/)?$" }, { "page": "/admin/projects", "regex": "^/admin/projects(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/projects(?:/)?$" }, { "page": "/admin/projects/new", "regex": "^/admin/projects/new(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/projects/new(?:/)?$" }, { "page": "/admin/services", "regex": "^/admin/services(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/services(?:/)?$" }, { "page": "/admin/services/new", "regex": "^/admin/services/new(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/services/new(?:/)?$" }, { "page": "/admin/settings", "regex": "^/admin/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/settings(?:/)?$" }, { "page": "/admin/testimonials", "regex": "^/admin/testimonials(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/testimonials(?:/)?$" }, { "page": "/admin/testimonials/new", "regex": "^/admin/testimonials/new(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/testimonials/new(?:/)?$" }, { "page": "/api/debug-blog-media", "regex": "^/api/debug\\-blog\\-media(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/debug\\-blog\\-media(?:/)?$" }], "dynamic": [{ "page": "/admin/api/blog/[id]", "regex": "^/admin/api/blog/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/api/blog/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/admin/api/blog/[id]/media", "regex": "^/admin/api/blog/([^/]+?)/media(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/api/blog/(?<nxtPid>[^/]+?)/media(?:/)?$" }, { "page": "/admin/api/blog/[id]/media/reorder", "regex": "^/admin/api/blog/([^/]+?)/media/reorder(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/api/blog/(?<nxtPid>[^/]+?)/media/reorder(?:/)?$" }, { "page": "/admin/api/blog/[id]/media/[mediaId]", "regex": "^/admin/api/blog/([^/]+?)/media/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid", "nxtPmediaId": "nxtPmediaId" }, "namedRegex": "^/admin/api/blog/(?<nxtPid>[^/]+?)/media/(?<nxtPmediaId>[^/]+?)(?:/)?$" }, { "page": "/admin/api/faq/[id]", "regex": "^/admin/api/faq/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/api/faq/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/admin/api/inquiry/[id]", "regex": "^/admin/api/inquiry/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/api/inquiry/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/admin/api/media/[mediaId]", "regex": "^/admin/api/media/([^/]+?)(?:/)?$", "routeKeys": { "nxtPmediaId": "nxtPmediaId" }, "namedRegex": "^/admin/api/media/(?<nxtPmediaId>[^/]+?)(?:/)?$" }, { "page": "/admin/api/projects/[id]", "regex": "^/admin/api/projects/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/api/projects/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/admin/api/projects/[id]/media", "regex": "^/admin/api/projects/([^/]+?)/media(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/api/projects/(?<nxtPid>[^/]+?)/media(?:/)?$" }, { "page": "/admin/api/projects/[id]/media/reorder", "regex": "^/admin/api/projects/([^/]+?)/media/reorder(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/api/projects/(?<nxtPid>[^/]+?)/media/reorder(?:/)?$" }, { "page": "/admin/api/projects/[id]/media/[mediaId]", "regex": "^/admin/api/projects/([^/]+?)/media/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid", "nxtPmediaId": "nxtPmediaId" }, "namedRegex": "^/admin/api/projects/(?<nxtPid>[^/]+?)/media/(?<nxtPmediaId>[^/]+?)(?:/)?$" }, { "page": "/admin/api/services/[id]", "regex": "^/admin/api/services/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/api/services/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/admin/api/testimonials/[id]", "regex": "^/admin/api/testimonials/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/api/testimonials/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/admin/blog/[id]", "regex": "^/admin/blog/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/blog/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/admin/faq/[id]", "regex": "^/admin/faq/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/faq/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/admin/inquiries/[id]", "regex": "^/admin/inquiries/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/inquiries/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/admin/projects/[id]", "regex": "^/admin/projects/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/projects/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/admin/services/[id]", "regex": "^/admin/services/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/services/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/admin/testimonials/[id]", "regex": "^/admin/testimonials/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/testimonials/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/[locale]", "regex": "^/([^/]+?)(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)(?:/)?$" }, { "page": "/[locale]/about", "regex": "^/([^/]+?)/about(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/about(?:/)?$" }, { "page": "/[locale]/blog", "regex": "^/([^/]+?)/blog(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/blog(?:/)?$" }, { "page": "/[locale]/blog/[slug]", "regex": "^/([^/]+?)/blog/([^/]+?)(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale", "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/blog/(?<nxtPslug>[^/]+?)(?:/)?$" }, { "page": "/[locale]/portfolio", "regex": "^/([^/]+?)/portfolio(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/portfolio(?:/)?$" }, { "page": "/[locale]/portfolio/[slug]", "regex": "^/([^/]+?)/portfolio/([^/]+?)(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale", "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/portfolio/(?<nxtPslug>[^/]+?)(?:/)?$" }, { "page": "/[locale]/services", "regex": "^/([^/]+?)/services(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/services(?:/)?$" }, { "page": "/[locale]/services/ai", "regex": "^/([^/]+?)/services/ai(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/services/ai(?:/)?$" }, { "page": "/[locale]/services/embedded", "regex": "^/([^/]+?)/services/embedded(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/services/embedded(?:/)?$" }, { "page": "/[locale]/services/software", "regex": "^/([^/]+?)/services/software(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/services/software(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/": { "routeType": "page", "response": "complete", "compute": "static", "htmlSize": 3979, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/", "dataRoute": "/index.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_global-error": { "routeType": "page", "response": "complete", "compute": "static", "htmlSize": 8760, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_not-found": { "initialStatus": 404, "routeType": "page", "response": "complete", "compute": "static", "htmlSize": 6845, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_not-found", "dataRoute": "/_not-found.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/login": { "routeType": "page", "response": "complete", "compute": "static", "htmlSize": 10379, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/login", "dataRoute": "/admin/login.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "28b36145c47073b6f1d4721b87fc8bf4", "previewModeSigningKey": "b6412f37f05809f28db44e9710ebd013bfe2f5ec1abcefa4309c13658db637bc", "previewModeEncryptionKey": "5467b6490788e3671b82a4a398b0f5a7f4ce2e07c53d8e499e0e652631b0916d" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0_kjzx3.js", "server/edge/chunks/[root-of-the-server]__1hepuqv._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1-fkxah.js"], "name": "middleware", "page": "/", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1-fkxah.js", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!api|_next|_vercel|admin|.*..*).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$", "originalSource": "/((?!api|_next|_vercel|admin|.*..*).*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "P8zI_NGM5yju4ZWIg1fAA", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "d8h+ls2XPIC6vRNhtzviLLemrnPT7tHjKvF4rT3tVo4=", "__NEXT_PREVIEW_MODE_ID": "28b36145c47073b6f1d4721b87fc8bf4", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "5467b6490788e3671b82a4a398b0f5a7f4ce2e07c53d8e499e0e652631b0916d", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "b6412f37f05809f28db44e9710ebd013bfe2f5ec1abcefa4309c13658db637bc" } } }, "sortedMiddleware": ["/"], "functions": {} };
var AppPathRoutesManifest = { "/[locale]/about/page": "/[locale]/about", "/[locale]/blog/[slug]/page": "/[locale]/blog/[slug]", "/[locale]/blog/page": "/[locale]/blog", "/[locale]/page": "/[locale]", "/[locale]/portfolio/[slug]/page": "/[locale]/portfolio/[slug]", "/[locale]/portfolio/page": "/[locale]/portfolio", "/[locale]/services/ai/page": "/[locale]/services/ai", "/[locale]/services/embedded/page": "/[locale]/services/embedded", "/[locale]/services/page": "/[locale]/services", "/[locale]/services/software/page": "/[locale]/services/software", "/_global-error/page": "/_global-error", "/_not-found/page": "/_not-found", "/admin/(shell)/about/page": "/admin/about", "/admin/(shell)/blog/[id]/page": "/admin/blog/[id]", "/admin/(shell)/blog/new/page": "/admin/blog/new", "/admin/(shell)/blog/page": "/admin/blog", "/admin/(shell)/faq/[id]/page": "/admin/faq/[id]", "/admin/(shell)/faq/new/page": "/admin/faq/new", "/admin/(shell)/faq/page": "/admin/faq", "/admin/(shell)/inquiries/[id]/page": "/admin/inquiries/[id]", "/admin/(shell)/inquiries/page": "/admin/inquiries", "/admin/(shell)/media/page": "/admin/media", "/admin/(shell)/overview/page": "/admin/overview", "/admin/(shell)/projects/[id]/page": "/admin/projects/[id]", "/admin/(shell)/projects/new/page": "/admin/projects/new", "/admin/(shell)/projects/page": "/admin/projects", "/admin/(shell)/services/[id]/page": "/admin/services/[id]", "/admin/(shell)/services/new/page": "/admin/services/new", "/admin/(shell)/services/page": "/admin/services", "/admin/(shell)/settings/page": "/admin/settings", "/admin/(shell)/testimonials/[id]/page": "/admin/testimonials/[id]", "/admin/(shell)/testimonials/new/page": "/admin/testimonials/new", "/admin/(shell)/testimonials/page": "/admin/testimonials", "/admin/api/blog/[id]/media/[mediaId]/route": "/admin/api/blog/[id]/media/[mediaId]", "/admin/api/blog/[id]/media/reorder/route": "/admin/api/blog/[id]/media/reorder", "/admin/api/blog/[id]/media/route": "/admin/api/blog/[id]/media", "/admin/api/blog/[id]/route": "/admin/api/blog/[id]", "/admin/api/blog/route": "/admin/api/blog", "/admin/api/faq/[id]/route": "/admin/api/faq/[id]", "/admin/api/faq/route": "/admin/api/faq", "/admin/api/inquiry/[id]/route": "/admin/api/inquiry/[id]", "/admin/api/inquiry/route": "/admin/api/inquiry", "/admin/api/media/[mediaId]/route": "/admin/api/media/[mediaId]", "/admin/api/media/route": "/admin/api/media", "/admin/api/media/upload/route": "/admin/api/media/upload", "/admin/api/projects/[id]/media/[mediaId]/route": "/admin/api/projects/[id]/media/[mediaId]", "/admin/api/projects/[id]/media/reorder/route": "/admin/api/projects/[id]/media/reorder", "/admin/api/projects/[id]/media/route": "/admin/api/projects/[id]/media", "/admin/api/projects/[id]/route": "/admin/api/projects/[id]", "/admin/api/projects/route": "/admin/api/projects", "/admin/api/services/[id]/route": "/admin/api/services/[id]", "/admin/api/services/route": "/admin/api/services", "/admin/api/settings/route": "/admin/api/settings", "/admin/api/testimonials/[id]/route": "/admin/api/testimonials/[id]", "/admin/api/testimonials/route": "/admin/api/testimonials", "/admin/auth/session/route": "/admin/auth/session", "/admin/login/page": "/admin/login", "/admin/page": "/admin", "/api/debug-blog-media/route": "/api/debug-blog-media", "/page": "/" };
var FunctionsConfigManifest = { "version": 1, "functions": {} };
var PagesManifest = { "/404": "pages/404.html", "/500": "pages/500.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.OPEN_NEXT_BUILD_ID = NextConfig.deploymentId ?? BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
import { Transform } from "node:stream";
init_util();

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    const nextUrl = constructNextUrl(internalEvent.url, `/${detectedLocale}${NextConfig.trailingSlash ? "/" : ""}`);
    const queryString = convertToQueryString(internalEvent.query);
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: `${nextUrl}${queryString}`
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: url.startsWith("/") ? `/${match3?.[1] ?? ""}` : "",
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s?]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream3({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
function normalizeLocationHeader(location, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location)) {
    return location;
  }
  const locationURL = new URL(location);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/semver.js
function compareSemver(v1, operator, v2) {
  let versionDiff = 0;
  if (v1 === "latest") {
    versionDiff = 1;
  } else {
    if (/^[^\d]/.test(v1)) {
      v1 = v1.substring(1);
    }
    if (/^[^\d]/.test(v2)) {
      v2 = v2.substring(1);
    }
    const [major1, minor1 = 0, patch1 = 0] = v1.split(".").map(Number);
    const [major2, minor2 = 0, patch2 = 0] = v2.split(".").map(Number);
    if (Number.isNaN(major1) || Number.isNaN(major2)) {
      throw new Error("The major version is required.");
    }
    if (major1 !== major2) {
      versionDiff = major1 - major2;
    } else if (minor1 !== minor2) {
      versionDiff = minor1 - minor2;
    } else if (patch1 !== patch2) {
      versionDiff = patch1 - patch2;
    }
  }
  switch (operator) {
    case "=":
      return versionDiff === 0;
    case ">=":
      return versionDiff >= 0;
    case "<=":
      return versionDiff <= 0;
    case ">":
      return versionDiff > 0;
    case "<":
      return versionDiff < 0;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

// node_modules/@opennextjs/aws/dist/utils/cache.js
async function isStale(key, tags, lastModified) {
  if (!compareSemver(globalThis.nextVersion, ">=", "16.0.0")) {
    return false;
  }
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.isStale?.(tags, lastModified) ?? false;
  }
  return await globalThis.tagCache.isStale?.(key, lastModified) ?? false;
}
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.[CACHE_TAGS_HEADER]?.split(",") ?? [];
    delete value.meta?.headers?.[CACHE_TAGS_HEADER];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified, isStaleFromTagCache = false) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = `"${hash(body)}"`;
  if (revalidate === 0) {
    return {
      [CACHE_CONTROL_HEADER]: NO_STORE_CACHE_CONTROL,
      [OPEN_NEXT_CACHE_HEADER]: "ERROR",
      etag
    };
  }
  const isSSG = finalRevalidate === CACHE_ONE_YEAR;
  const remainingTtl = Math.max(finalRevalidate - age, 1);
  const isStaleFromTime = !isSSG && remainingTtl === 1;
  const isStale2 = isStaleFromTime || isStaleFromTagCache;
  if (!isSSG || isStaleFromTagCache) {
    const sMaxAge = isStaleFromTagCache ? 1 : remainingTtl;
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate,
      isStaleFromTagCache
    });
    if (isStale2) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      [CACHE_CONTROL_HEADER]: `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      [OPEN_NEXT_CACHE_HEADER]: isStale2 ? "STALE" : "HIT",
      etag
    };
  }
  return {
    [CACHE_CONTROL_HEADER]: `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    [OPEN_NEXT_CACHE_HEADER]: "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  const segmentHeader = event.headers[NEXT_SEGMENT_PREFETCH_HEADER];
  if (typeof segmentHeader === "string" && cachedValue.segmentData) {
    if (Object.hasOwn(cachedValue.segmentData, segmentHeader)) {
      return {
        body: cachedValue.segmentData[segmentHeader],
        additionalHeaders: {
          [NEXT_PRERENDER_HEADER]: "1",
          [NEXT_POSTPONED_HEADER]: "2"
        }
      };
    }
    return void 0;
  }
  if (cachedValue.rsc === void 0) {
    return void 0;
  }
  return { body: cachedValue.rsc, additionalHeaders: {} };
}
async function generateResult(event, localizedPath, cachedValue, lastModified, isStaleFromTagCache = false) {
  debug("Returning result from experimental cache");
  let body;
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = event.headers.rsc === "1";
    if (isDataRequest) {
      const appRouterResult = getBodyForAppRouter(event, cachedValue);
      body = appRouterResult?.body;
      additionalHeaders = appRouterResult?.additionalHeaders ?? {};
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  if (body === void 0) {
    debug("Missing body in the cache entry, falling back to the server");
    return void 0;
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified, isStaleFromTagCache);
  const statusCode = computeStatusCode(event.rewriteStatusCode, cachedValue.meta?.status);
  const headers = {
    ...cacheControl,
    "content-type": type,
    ...cachedValue.meta?.headers,
    vary: VARY_HEADER,
    ...additionalHeaders
  };
  fixCacheControlForError(headers, statusCode);
  return {
    type: "core",
    statusCode,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers
  };
}
function computeStatusCode(rewriteStatusCode, cachedStatusCode) {
  if (cachedStatusCode !== void 0 && cachedStatusCode !== 200) {
    return cachedStatusCode;
  }
  return rewriteStatusCode ?? cachedStatusCode ?? 200;
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => escapePathDelimiters(decodeURIComponent(segment), true)).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers[PRERENDER_REVALIDATE_HEADER]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  try {
    localizedPath = decodePathParams(localizedPath) || "/";
  } catch {
    return event;
  }
  const cacheKey = localizedPath === "/" ? "/index" : localizedPath;
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath) || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(cacheKey);
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      const tags = getTagsFromValue(cachedData.value);
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(cacheKey, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const _isStale = cachedData.shouldBypassTagCache ? false : await isStale(cacheKey, tags, cachedData.lastModified ?? Date.now());
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page": {
          const result = await generateResult(event, localizedPath, cachedData.value, cachedData.lastModified, _isStale);
          return result ?? event;
        }
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          const statusCode = computeStatusCode(event.rewriteStatusCode, cachedData.value.meta?.status);
          const headers = {
            ...cacheControl,
            ...cachedData.value.meta?.headers,
            vary: VARY_HEADER
          };
          fixCacheControlForError(headers, statusCode);
          return {
            type: "core",
            statusCode,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers,
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/@opennextjs/aws/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !(event.query.__nextDataReq === "1") && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      headers: {
        ...internalEvent.headers,
        "x-nextjs-data": "1"
      },
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_util();
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers[ISR_HEADER] && headers[PRERENDER_REVALIDATE_HEADER] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(normalizedPath);
  } catch {
  }
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath) || decodedPath !== void 0 && r.test(decodedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie")
        return;
      if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const setCookies = responseHeaders.getSetCookie().flatMap((maybeCompoundCookie) => parseSetCookieHeader(maybeCompoundCookie));
  if (setCookies.length > 0) {
    resHeaders["set-cookie"] = setCookies;
  }
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
var NEXT_INTERNAL_HEADERS = [
  "x-middleware-rewrite",
  "x-middleware-redirect",
  "x-middleware-set-cookie",
  "x-middleware-skip",
  "x-middleware-override-headers",
  "x-middleware-next",
  "x-now-route-matches",
  "x-matched-path",
  "x-nextjs-data",
  "x-next-resume-state-length"
];
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      const lowerCaseKey = key.toLowerCase();
      if (lowerCaseKey.startsWith(INTERNAL_HEADER_PREFIX) || lowerCaseKey.startsWith(MIDDLEWARE_HEADER_PREFIX) || NEXT_INTERNAL_HEADERS.includes(lowerCaseKey)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": NO_STORE_CACHE_CONTROL
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers[ISR_HEADER] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
