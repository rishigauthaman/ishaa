var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@netlify/runtime-utils/dist/main.js
var getString, base64Decode, base64Encode, getEnvironment;
var init_main = __esm({
  "node_modules/@netlify/runtime-utils/dist/main.js"() {
    getString = (input) => typeof input === "string" ? input : JSON.stringify(input);
    base64Decode = globalThis.Buffer ? (input) => Buffer.from(input, "base64").toString() : (input) => atob(input);
    base64Encode = globalThis.Buffer ? (input) => Buffer.from(getString(input)).toString("base64") : (input) => btoa(getString(input));
    getEnvironment = () => {
      const { Deno, Netlify: Netlify2, process } = globalThis;
      return Netlify2?.env ?? Deno?.env ?? {
        delete: (key) => delete process?.env[key],
        get: (key) => process?.env[key],
        has: (key) => Boolean(process?.env[key]),
        set: (key, value) => {
          if (process?.env) {
            process.env[key] = value;
          }
        },
        toObject: () => process?.env ?? {}
      };
    };
  }
});

// node_modules/@netlify/otel/dist/main.js
function withActiveSpan(tracer, name, optionsOrFn, contextOrFn, fn) {
  const func = typeof contextOrFn === "function" ? contextOrFn : typeof optionsOrFn === "function" ? optionsOrFn : fn;
  if (!func) {
    throw new Error("function to execute with active span is missing");
  }
  if (!tracer) {
    return func();
  }
  return tracer.withActiveSpan(name, optionsOrFn, contextOrFn, func);
}
var GET_TRACER, getTracer;
var init_main2 = __esm({
  "node_modules/@netlify/otel/dist/main.js"() {
    GET_TRACER = "__netlify__getTracer";
    getTracer = (name, version) => {
      return globalThis[GET_TRACER]?.(name, version);
    };
  }
});

// node_modules/@netlify/blobs/dist/chunk-YAGWSQMB.js
function withSpan(span, name, fn) {
  if (span) return fn(span);
  return withActiveSpan(getTracer(), name, (span2) => {
    return fn(span2);
  });
}
var getEnvironmentContext, setEnvironmentContext, MissingBlobsEnvironmentError, BASE64_PREFIX, METADATA_HEADER_INTERNAL, METADATA_HEADER_EXTERNAL, METADATA_MAX_SIZE, encodeMetadata, decodeMetadata, getMetadataFromResponse, NF_ERROR, NF_REQUEST_ID, BlobsInternalError, collectIterator, BlobsConsistencyError, REGION_AUTO, regions, isValidRegion, InvalidBlobsRegionError, DEFAULT_RETRY_DELAY, MIN_RETRY_DELAY, MAX_RETRY, RATE_LIMIT_HEADER, fetchAndRetry, getDelay, sleep, SIGNED_URL_ACCEPT_HEADER, Client, getClientOptions;
var init_chunk_YAGWSQMB = __esm({
  "node_modules/@netlify/blobs/dist/chunk-YAGWSQMB.js"() {
    init_main();
    init_main();
    init_main2();
    init_main();
    getEnvironmentContext = () => {
      const context = globalThis.netlifyBlobsContext || getEnvironment().get("NETLIFY_BLOBS_CONTEXT");
      if (typeof context !== "string" || !context) {
        return {};
      }
      const data = base64Decode(context);
      try {
        return JSON.parse(data);
      } catch {
      }
      return {};
    };
    setEnvironmentContext = (context) => {
      const encodedContext = base64Encode(JSON.stringify(context));
      getEnvironment().set("NETLIFY_BLOBS_CONTEXT", encodedContext);
    };
    MissingBlobsEnvironmentError = class extends Error {
      constructor(requiredProperties) {
        super(
          `The environment has not been configured to use Netlify Blobs. To use it manually, supply the following properties when creating a store: ${requiredProperties.join(
            ", "
          )}`
        );
        this.name = "MissingBlobsEnvironmentError";
      }
    };
    BASE64_PREFIX = "b64;";
    METADATA_HEADER_INTERNAL = "x-amz-meta-user";
    METADATA_HEADER_EXTERNAL = "netlify-blobs-metadata";
    METADATA_MAX_SIZE = 2 * 1024;
    encodeMetadata = (metadata) => {
      if (!metadata) {
        return null;
      }
      const encodedObject = base64Encode(JSON.stringify(metadata));
      const payload = `b64;${encodedObject}`;
      if (METADATA_HEADER_EXTERNAL.length + payload.length > METADATA_MAX_SIZE) {
        throw new Error("Metadata object exceeds the maximum size");
      }
      return payload;
    };
    decodeMetadata = (header) => {
      if (!header?.startsWith(BASE64_PREFIX)) {
        return {};
      }
      const encodedData = header.slice(BASE64_PREFIX.length);
      const decodedData = base64Decode(encodedData);
      const metadata = JSON.parse(decodedData);
      return metadata;
    };
    getMetadataFromResponse = (response) => {
      if (!response.headers) {
        return {};
      }
      const value = response.headers.get(METADATA_HEADER_EXTERNAL) || response.headers.get(METADATA_HEADER_INTERNAL);
      try {
        return decodeMetadata(value);
      } catch {
        throw new Error(
          "An internal error occurred while trying to retrieve the metadata for an entry. Please try updating to the latest version of the Netlify Blobs client."
        );
      }
    };
    NF_ERROR = "x-nf-error";
    NF_REQUEST_ID = "x-nf-request-id";
    BlobsInternalError = class extends Error {
      constructor(res) {
        let details = res.headers.get(NF_ERROR) || `${res.status} status code`;
        if (res.headers.has(NF_REQUEST_ID)) {
          details += `, ID: ${res.headers.get(NF_REQUEST_ID)}`;
        }
        super(`Netlify Blobs has generated an internal error (${details})`);
        this.name = "BlobsInternalError";
      }
    };
    collectIterator = async (iterator) => {
      const result = [];
      for await (const item of iterator) {
        result.push(item);
      }
      return result;
    };
    BlobsConsistencyError = class extends Error {
      constructor() {
        super(
          `Netlify Blobs has failed to perform a read using strong consistency because the environment has not been configured with a 'uncachedEdgeURL' property`
        );
        this.name = "BlobsConsistencyError";
      }
    };
    REGION_AUTO = "auto";
    regions = {
      "us-east-1": true,
      "us-east-2": true,
      "eu-central-1": true,
      "ap-southeast-1": true,
      "ap-southeast-2": true
    };
    isValidRegion = (input) => Object.keys(regions).includes(input);
    InvalidBlobsRegionError = class extends Error {
      constructor(region) {
        super(
          `${region} is not a supported Netlify Blobs region. Supported values are: ${Object.keys(regions).join(", ")}.`
        );
        this.name = "InvalidBlobsRegionError";
      }
    };
    DEFAULT_RETRY_DELAY = getEnvironment().get("NODE_ENV") === "test" ? 1 : 5e3;
    MIN_RETRY_DELAY = 1e3;
    MAX_RETRY = 5;
    RATE_LIMIT_HEADER = "X-RateLimit-Reset";
    fetchAndRetry = async (fetch2, url, options, attemptsLeft = MAX_RETRY) => {
      try {
        const res = await fetch2(url, options);
        if (attemptsLeft > 0 && (res.status === 429 || res.status >= 500)) {
          const delay = getDelay(res.headers.get(RATE_LIMIT_HEADER));
          await sleep(delay);
          return fetchAndRetry(fetch2, url, options, attemptsLeft - 1);
        }
        return res;
      } catch (error) {
        if (attemptsLeft === 0) {
          throw error;
        }
        const delay = getDelay();
        await sleep(delay);
        return fetchAndRetry(fetch2, url, options, attemptsLeft - 1);
      }
    };
    getDelay = (rateLimitReset) => {
      if (!rateLimitReset) {
        return DEFAULT_RETRY_DELAY;
      }
      return Math.max(Number(rateLimitReset) * 1e3 - Date.now(), MIN_RETRY_DELAY);
    };
    sleep = (ms) => new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
    SIGNED_URL_ACCEPT_HEADER = "application/json;type=signed-url";
    Client = class {
      constructor({ apiURL, consistency, edgeURL, fetch: fetch2, region, siteID, token, uncachedEdgeURL }) {
        this.apiURL = apiURL;
        this.consistency = consistency ?? "eventual";
        this.edgeURL = edgeURL;
        this.fetch = fetch2 ?? globalThis.fetch;
        this.region = region;
        this.siteID = siteID;
        this.token = token;
        this.uncachedEdgeURL = uncachedEdgeURL;
        if (!this.fetch) {
          throw new Error(
            "Netlify Blobs could not find a `fetch` client in the global scope. You can either update your runtime to a version that includes `fetch` (like Node.js 18.0.0 or above), or you can supply your own implementation using the `fetch` property."
          );
        }
      }
      async getFinalRequest({
        consistency: opConsistency,
        key,
        metadata,
        method,
        parameters = {},
        storeName
      }) {
        const encodedMetadata = encodeMetadata(metadata);
        const consistency = opConsistency ?? this.consistency;
        let urlPath = `/${this.siteID}`;
        if (storeName) {
          urlPath += `/${storeName}`;
        }
        if (key) {
          urlPath += `/${key}`;
        }
        if (this.edgeURL) {
          if (consistency === "strong" && !this.uncachedEdgeURL) {
            throw new BlobsConsistencyError();
          }
          const headers = {
            authorization: `Bearer ${this.token}`
          };
          if (encodedMetadata) {
            headers[METADATA_HEADER_INTERNAL] = encodedMetadata;
          }
          if (this.region) {
            urlPath = `/region:${this.region}${urlPath}`;
          }
          const url2 = new URL(urlPath, consistency === "strong" ? this.uncachedEdgeURL : this.edgeURL);
          for (const key2 in parameters) {
            url2.searchParams.set(key2, parameters[key2]);
          }
          return {
            headers,
            url: url2.toString()
          };
        }
        const apiHeaders = { authorization: `Bearer ${this.token}` };
        const url = new URL(`/api/v1/blobs${urlPath}`, this.apiURL ?? "https://api.netlify.com");
        for (const key2 in parameters) {
          url.searchParams.set(key2, parameters[key2]);
        }
        if (this.region) {
          url.searchParams.set("region", this.region);
        }
        if (storeName === void 0 || key === void 0) {
          return {
            headers: apiHeaders,
            url: url.toString()
          };
        }
        if (encodedMetadata) {
          apiHeaders[METADATA_HEADER_EXTERNAL] = encodedMetadata;
        }
        if (method === "head" || method === "delete") {
          return {
            headers: apiHeaders,
            url: url.toString()
          };
        }
        const res = await this.fetch(url.toString(), {
          headers: { ...apiHeaders, accept: SIGNED_URL_ACCEPT_HEADER },
          method
        });
        if (res.status !== 200) {
          throw new BlobsInternalError(res);
        }
        const { url: signedURL } = await res.json();
        const userHeaders = encodedMetadata ? { [METADATA_HEADER_INTERNAL]: encodedMetadata } : void 0;
        return {
          headers: userHeaders,
          url: signedURL
        };
      }
      async makeRequest({
        body,
        conditions = {},
        consistency,
        headers: extraHeaders,
        key,
        metadata,
        method,
        parameters,
        storeName
      }) {
        const { headers: baseHeaders = {}, url } = await this.getFinalRequest({
          consistency,
          key,
          metadata,
          method,
          parameters,
          storeName
        });
        const headers = {
          ...baseHeaders,
          ...extraHeaders
        };
        if (method === "put") {
          headers["cache-control"] = "max-age=0, stale-while-revalidate=60";
        }
        if ("onlyIfMatch" in conditions && conditions.onlyIfMatch) {
          headers["if-match"] = conditions.onlyIfMatch;
        } else if ("onlyIfNew" in conditions && conditions.onlyIfNew) {
          headers["if-none-match"] = "*";
        }
        const options = {
          body,
          headers,
          method
        };
        if (body instanceof ReadableStream) {
          options.duplex = "half";
        }
        return fetchAndRetry(this.fetch, url, options);
      }
    };
    getClientOptions = (options, contextOverride) => {
      const context = contextOverride ?? getEnvironmentContext();
      const siteID = context.siteID ?? options.siteID;
      const token = context.token ?? options.token;
      if (!siteID || !token) {
        throw new MissingBlobsEnvironmentError(["siteID", "token"]);
      }
      if (options.region !== void 0 && !isValidRegion(options.region)) {
        throw new InvalidBlobsRegionError(options.region);
      }
      const clientOptions = {
        apiURL: context.apiURL ?? options.apiURL,
        consistency: options.consistency,
        edgeURL: context.edgeURL ?? options.edgeURL,
        fetch: options.fetch,
        region: options.region,
        siteID,
        token,
        uncachedEdgeURL: context.uncachedEdgeURL ?? options.uncachedEdgeURL
      };
      return clientOptions;
    };
  }
});

// node_modules/@netlify/blobs/dist/main.js
var main_exports = {};
__export(main_exports, {
  connectLambda: () => connectLambda,
  getDeployStore: () => getDeployStore,
  getStore: () => getStore,
  listStores: () => listStores,
  setEnvironmentContext: () => setEnvironmentContext
});
function listStores(options = {}) {
  const context = getEnvironmentContext();
  const clientOptions = getClientOptions(options, context);
  const client = new Client(clientOptions);
  const iterator = getListIterator(client, SITE_STORE_PREFIX);
  if (options.paginate) {
    return iterator;
  }
  return collectIterator(iterator).then((results) => ({ stores: results.flatMap((page) => page.stores) }));
}
var connectLambda, DEPLOY_STORE_PREFIX, LEGACY_STORE_INTERNAL_PREFIX, SITE_STORE_PREFIX, STATUS_OK, STATUS_PRE_CONDITION_FAILED, Store, getDeployStore, getStore, formatListStoreResponse, getListIterator;
var init_main3 = __esm({
  "node_modules/@netlify/blobs/dist/main.js"() {
    init_chunk_YAGWSQMB();
    init_main();
    connectLambda = (event) => {
      const rawData = base64Decode(event.blobs);
      const data = JSON.parse(rawData);
      const environmentContext = {
        deployID: event.headers["x-nf-deploy-id"],
        edgeURL: data.url,
        siteID: event.headers["x-nf-site-id"],
        token: data.token
      };
      setEnvironmentContext(environmentContext);
    };
    DEPLOY_STORE_PREFIX = "deploy:";
    LEGACY_STORE_INTERNAL_PREFIX = "netlify-internal/legacy-namespace/";
    SITE_STORE_PREFIX = "site:";
    STATUS_OK = 200;
    STATUS_PRE_CONDITION_FAILED = 412;
    Store = class _Store {
      constructor(options) {
        this.client = options.client;
        if ("deployID" in options) {
          _Store.validateDeployID(options.deployID);
          let name = DEPLOY_STORE_PREFIX + options.deployID;
          if (options.name) {
            name += `:${options.name}`;
          }
          this.name = name;
        } else if (options.name.startsWith(LEGACY_STORE_INTERNAL_PREFIX)) {
          const storeName = options.name.slice(LEGACY_STORE_INTERNAL_PREFIX.length);
          _Store.validateStoreName(storeName);
          this.name = storeName;
        } else {
          _Store.validateStoreName(options.name);
          this.name = SITE_STORE_PREFIX + options.name;
        }
      }
      async delete(key) {
        const res = await this.client.makeRequest({ key, method: "delete", storeName: this.name });
        if (![200, 204, 404].includes(res.status)) {
          throw new BlobsInternalError(res);
        }
      }
      async deleteAll() {
        let totalDeletedBlobs = 0;
        let hasMore = true;
        while (hasMore) {
          const res = await this.client.makeRequest({ method: "delete", storeName: this.name });
          if (res.status !== 200) {
            throw new BlobsInternalError(res);
          }
          const data = await res.json();
          if (typeof data.blobs_deleted !== "number") {
            throw new BlobsInternalError(res);
          }
          totalDeletedBlobs += data.blobs_deleted;
          hasMore = typeof data.has_more === "boolean" && data.has_more;
        }
        return {
          deletedBlobs: totalDeletedBlobs
        };
      }
      async get(key, options) {
        return withSpan(options?.span, "blobs.get", async (span) => {
          const { consistency, type } = options ?? {};
          span?.setAttributes({
            "blobs.store": this.name,
            "blobs.key": key,
            "blobs.type": type,
            "blobs.method": "GET",
            "blobs.consistency": consistency
          });
          const res = await this.client.makeRequest({
            consistency,
            key,
            method: "get",
            storeName: this.name
          });
          span?.setAttributes({
            "blobs.response.body.size": res.headers.get("content-length") ?? void 0,
            "blobs.response.status": res.status
          });
          if (res.status === 404) {
            return null;
          }
          if (res.status !== 200) {
            throw new BlobsInternalError(res);
          }
          if (type === void 0 || type === "text") {
            return res.text();
          }
          if (type === "arrayBuffer") {
            return res.arrayBuffer();
          }
          if (type === "blob") {
            return res.blob();
          }
          if (type === "json") {
            return res.json();
          }
          if (type === "stream") {
            return res.body;
          }
          throw new BlobsInternalError(res);
        });
      }
      async getMetadata(key, options = {}) {
        return withSpan(options?.span, "blobs.getMetadata", async (span) => {
          span?.setAttributes({
            "blobs.store": this.name,
            "blobs.key": key,
            "blobs.method": "HEAD",
            "blobs.consistency": options.consistency
          });
          const res = await this.client.makeRequest({
            consistency: options.consistency,
            key,
            method: "head",
            storeName: this.name
          });
          span?.setAttributes({
            "blobs.response.status": res.status
          });
          if (res.status === 404) {
            return null;
          }
          if (res.status !== 200 && res.status !== 304) {
            throw new BlobsInternalError(res);
          }
          const etag = res?.headers.get("etag") ?? void 0;
          const metadata = getMetadataFromResponse(res);
          const result = {
            etag,
            metadata
          };
          return result;
        });
      }
      async getWithMetadata(key, options) {
        return withSpan(options?.span, "blobs.getWithMetadata", async (span) => {
          const { consistency, etag: requestETag, type } = options ?? {};
          const headers = requestETag ? { "if-none-match": requestETag } : void 0;
          span?.setAttributes({
            "blobs.store": this.name,
            "blobs.key": key,
            "blobs.method": "GET",
            "blobs.consistency": options?.consistency,
            "blobs.type": type,
            "blobs.request.etag": requestETag
          });
          const res = await this.client.makeRequest({
            consistency,
            headers,
            key,
            method: "get",
            storeName: this.name
          });
          const responseETag = res?.headers.get("etag") ?? void 0;
          span?.setAttributes({
            "blobs.response.body.size": res.headers.get("content-length") ?? void 0,
            "blobs.response.etag": responseETag,
            "blobs.response.status": res.status
          });
          if (res.status === 404) {
            return null;
          }
          if (res.status !== 200 && res.status !== 304) {
            throw new BlobsInternalError(res);
          }
          const metadata = getMetadataFromResponse(res);
          const result = {
            etag: responseETag,
            metadata
          };
          if (res.status === 304 && requestETag) {
            return { data: null, ...result };
          }
          if (type === void 0 || type === "text") {
            return { data: await res.text(), ...result };
          }
          if (type === "arrayBuffer") {
            return { data: await res.arrayBuffer(), ...result };
          }
          if (type === "blob") {
            return { data: await res.blob(), ...result };
          }
          if (type === "json") {
            return { data: await res.json(), ...result };
          }
          if (type === "stream") {
            return { data: res.body, ...result };
          }
          throw new Error(`Invalid 'type' property: ${type}. Expected: arrayBuffer, blob, json, stream, or text.`);
        });
      }
      list(options = {}) {
        return withSpan(options.span, "blobs.list", (span) => {
          span?.setAttributes({
            "blobs.store": this.name,
            "blobs.method": "GET",
            "blobs.list.paginate": options.paginate ?? false
          });
          const iterator = this.getListIterator(options);
          if (options.paginate) {
            return iterator;
          }
          return collectIterator(iterator).then(
            (items) => items.reduce(
              (acc, item) => ({
                blobs: [...acc.blobs, ...item.blobs],
                directories: [...acc.directories, ...item.directories]
              }),
              { blobs: [], directories: [] }
            )
          );
        });
      }
      async set(key, data, options = {}) {
        return withSpan(options.span, "blobs.set", async (span) => {
          span?.setAttributes({
            "blobs.store": this.name,
            "blobs.key": key,
            "blobs.method": "PUT",
            "blobs.data.size": typeof data == "string" ? data.length : data instanceof Blob ? data.size : data.byteLength,
            "blobs.data.type": typeof data == "string" ? "string" : data instanceof Blob ? "blob" : "arrayBuffer",
            "blobs.atomic": Boolean(options.onlyIfMatch ?? options.onlyIfNew)
          });
          _Store.validateKey(key);
          const conditions = _Store.getConditions(options);
          const res = await this.client.makeRequest({
            conditions,
            body: data,
            key,
            metadata: options.metadata,
            method: "put",
            storeName: this.name
          });
          const etag = res.headers.get("etag") ?? "";
          span?.setAttributes({
            "blobs.response.etag": etag,
            "blobs.response.status": res.status
          });
          if (conditions) {
            return res.status === STATUS_PRE_CONDITION_FAILED ? { modified: false } : { etag, modified: true };
          }
          if (res.status === STATUS_OK) {
            return {
              etag,
              modified: true
            };
          }
          throw new BlobsInternalError(res);
        });
      }
      async setJSON(key, data, options = {}) {
        return withSpan(options.span, "blobs.setJSON", async (span) => {
          span?.setAttributes({
            "blobs.store": this.name,
            "blobs.key": key,
            "blobs.method": "PUT",
            "blobs.data.type": "json"
          });
          _Store.validateKey(key);
          const conditions = _Store.getConditions(options);
          const payload = JSON.stringify(data);
          const headers = {
            "content-type": "application/json"
          };
          const res = await this.client.makeRequest({
            ...conditions,
            body: payload,
            headers,
            key,
            metadata: options.metadata,
            method: "put",
            storeName: this.name
          });
          const etag = res.headers.get("etag") ?? "";
          span?.setAttributes({
            "blobs.response.etag": etag,
            "blobs.response.status": res.status
          });
          if (conditions) {
            return res.status === STATUS_PRE_CONDITION_FAILED ? { modified: false } : { etag, modified: true };
          }
          if (res.status === STATUS_OK) {
            return {
              etag,
              modified: true
            };
          }
          throw new BlobsInternalError(res);
        });
      }
      static formatListResultBlob(result) {
        if (!result.key) {
          return null;
        }
        return {
          etag: result.etag,
          key: result.key
        };
      }
      static getConditions(options) {
        if ("onlyIfMatch" in options && "onlyIfNew" in options) {
          throw new Error(
            `The 'onlyIfMatch' and 'onlyIfNew' options are mutually exclusive. Using 'onlyIfMatch' will make the write succeed only if there is an entry for the key with the given content, while 'onlyIfNew' will make the write succeed only if there is no entry for the key.`
          );
        }
        if ("onlyIfMatch" in options && options.onlyIfMatch) {
          if (typeof options.onlyIfMatch !== "string") {
            throw new Error(`The 'onlyIfMatch' property expects a string representing an ETag.`);
          }
          return {
            onlyIfMatch: options.onlyIfMatch
          };
        }
        if ("onlyIfNew" in options && options.onlyIfNew) {
          if (typeof options.onlyIfNew !== "boolean") {
            throw new Error(
              `The 'onlyIfNew' property expects a boolean indicating whether the write should fail if an entry for the key already exists.`
            );
          }
          return {
            onlyIfNew: true
          };
        }
      }
      static validateKey(key) {
        if (key === "") {
          throw new Error("Blob key must not be empty.");
        }
        if (key.startsWith("/") || key.startsWith("%2F")) {
          throw new Error("Blob key must not start with forward slash (/).");
        }
        if (new TextEncoder().encode(key).length > 600) {
          throw new Error(
            "Blob key must be a sequence of Unicode characters whose UTF-8 encoding is at most 600 bytes long."
          );
        }
      }
      static validateDeployID(deployID) {
        if (!/^\w{1,24}$/.test(deployID)) {
          throw new Error(`'${deployID}' is not a valid Netlify deploy ID.`);
        }
      }
      static validateStoreName(name) {
        if (name.includes("/") || name.includes("%2F")) {
          throw new Error("Store name must not contain forward slashes (/).");
        }
        if (new TextEncoder().encode(name).length > 64) {
          throw new Error(
            "Store name must be a sequence of Unicode characters whose UTF-8 encoding is at most 64 bytes long."
          );
        }
      }
      getListIterator(options) {
        const { client, name: storeName } = this;
        const parameters = {};
        if (options?.prefix) {
          parameters.prefix = options.prefix;
        }
        if (options?.directories) {
          parameters.directories = "true";
        }
        return {
          [Symbol.asyncIterator]() {
            let currentCursor = null;
            let done = false;
            return {
              async next() {
                return withSpan(options?.span, "blobs.list.next", async (span) => {
                  span?.setAttributes({
                    "blobs.store": storeName,
                    "blobs.method": "GET",
                    "blobs.list.paginate": options?.paginate ?? false,
                    "blobs.list.done": done,
                    "blobs.list.cursor": currentCursor ?? void 0
                  });
                  if (done) {
                    return { done: true, value: void 0 };
                  }
                  const nextParameters = { ...parameters };
                  if (currentCursor !== null) {
                    nextParameters.cursor = currentCursor;
                  }
                  const res = await client.makeRequest({
                    method: "get",
                    parameters: nextParameters,
                    storeName
                  });
                  span?.setAttributes({
                    "blobs.response.status": res.status
                  });
                  let blobs = [];
                  let directories = [];
                  if (![200, 204, 404].includes(res.status)) {
                    throw new BlobsInternalError(res);
                  }
                  if (res.status === 404) {
                    done = true;
                  } else {
                    const page = await res.json();
                    if (page.next_cursor) {
                      currentCursor = page.next_cursor;
                    } else {
                      done = true;
                    }
                    blobs = (page.blobs ?? []).map(_Store.formatListResultBlob).filter(Boolean);
                    directories = page.directories ?? [];
                  }
                  return {
                    done: false,
                    value: {
                      blobs,
                      directories
                    }
                  };
                });
              }
            };
          }
        };
      }
    };
    getDeployStore = (input = {}, options) => {
      const context = getEnvironmentContext();
      const mergedOptions = typeof input === "string" ? { ...options, name: input } : input;
      const deployID = mergedOptions.deployID ?? context.deployID;
      if (!deployID) {
        throw new MissingBlobsEnvironmentError(["deployID"]);
      }
      const clientOptions = getClientOptions(mergedOptions, context);
      if (!clientOptions.region) {
        if (clientOptions.edgeURL || clientOptions.uncachedEdgeURL) {
          if (!context.primaryRegion) {
            throw new Error(
              "When accessing a deploy store, the Netlify Blobs client needs to be configured with a region, and one was not found in the environment. To manually set the region, set the `region` property in the `getDeployStore` options. If you are using the Netlify CLI, you may have an outdated version; run `npm install -g netlify-cli@latest` to update and try again."
            );
          }
          clientOptions.region = context.primaryRegion;
        } else {
          clientOptions.region = REGION_AUTO;
        }
      }
      const client = new Client(clientOptions);
      return new Store({ client, deployID, name: mergedOptions.name });
    };
    getStore = (input, options) => {
      if (typeof input === "string") {
        const contextOverride = options?.siteID && options?.token ? { siteID: options?.siteID, token: options?.token } : void 0;
        const clientOptions = getClientOptions(options ?? {}, contextOverride);
        const client = new Client(clientOptions);
        return new Store({ client, name: input });
      }
      if (typeof input?.name === "string") {
        const { name } = input;
        const contextOverride = input?.siteID && input?.token ? { siteID: input?.siteID, token: input?.token } : void 0;
        const clientOptions = getClientOptions(input, contextOverride);
        if (!name) {
          throw new MissingBlobsEnvironmentError(["name"]);
        }
        const client = new Client(clientOptions);
        return new Store({ client, name });
      }
      if (typeof input?.deployID === "string") {
        const clientOptions = getClientOptions(input);
        const { deployID } = input;
        if (!deployID) {
          throw new MissingBlobsEnvironmentError(["deployID"]);
        }
        const client = new Client(clientOptions);
        return new Store({ client, deployID });
      }
      throw new Error(
        "The `getStore` method requires the name of the store as a string or as the `name` property of an options object"
      );
    };
    formatListStoreResponse = (stores) => stores.filter((store) => !store.startsWith(DEPLOY_STORE_PREFIX)).map((store) => store.startsWith(SITE_STORE_PREFIX) ? store.slice(SITE_STORE_PREFIX.length) : store);
    getListIterator = (client, prefix) => {
      const parameters = {
        prefix
      };
      return {
        [Symbol.asyncIterator]() {
          let currentCursor = null;
          let done = false;
          return {
            async next() {
              if (done) {
                return { done: true, value: void 0 };
              }
              const nextParameters = { ...parameters };
              if (currentCursor !== null) {
                nextParameters.cursor = currentCursor;
              }
              const res = await client.makeRequest({
                method: "get",
                parameters: nextParameters
              });
              if (res.status === 404) {
                return { done: true, value: void 0 };
              }
              const page = await res.json();
              if (page.next_cursor) {
                currentCursor = page.next_cursor;
              } else {
                done = true;
              }
              return {
                done: false,
                value: {
                  ...page,
                  stores: formatListStoreResponse(page.stores)
                }
              };
            }
          };
        }
      };
    };
  }
});

// booking-src/booking.mjs
var DEFAULT_SETTINGS = {
  timezone: "Asia/Dubai",
  utcOffset: "+04:00",
  // Gulf Standard Time, no DST
  types: [
    { id: "speaking", name: "Speaking Engagement", minutes: 30 },
    { id: "brand", name: "Brand Collaboration", minutes: 30 },
    { id: "media", name: "Media Interview", minutes: 15 }
  ],
  availability: {
    mon: [["14:00", "18:00"]],
    tue: [["14:00", "18:00"]],
    wed: [["14:00", "18:00"]],
    thu: [["14:00", "18:00"]],
    fri: [["14:00", "18:00"]],
    sat: [],
    sun: []
  },
  minNoticeHours: 24,
  maxDaysAhead: 45,
  bufferMinutes: 30,
  location: "In person \xB7 Dubai \u2014 venue shared upon confirmation"
};
var WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
var memory = /* @__PURE__ */ new Map();
function memoryStore() {
  return {
    async get(key) {
      return memory.has(key) ? JSON.parse(memory.get(key)) : null;
    },
    async set(key, value) {
      memory.set(key, JSON.stringify(value));
    },
    async list(prefix) {
      return [...memory.keys()].filter((k) => k.startsWith(prefix));
    }
  };
}
var cachedStore = null;
async function storage() {
  if (cachedStore) return cachedStore;
  try {
    const { getStore: getStore2 } = await Promise.resolve().then(() => (init_main3(), main_exports));
    const store = getStore2({ name: "ifq-bookings", consistency: "strong" });
    await store.get("__probe__");
    cachedStore = {
      async get(key) {
        return await store.get(key, { type: "json" });
      },
      async set(key, value) {
        await store.setJSON(key, value);
      },
      async list(prefix) {
        const { blobs } = await store.list({ prefix });
        return blobs.map((b) => b.key);
      }
    };
  } catch (e) {
    cachedStore = memoryStore();
  }
  return cachedStore;
}
async function getSettings(db) {
  const s = await db.get("settings");
  return s ? { ...DEFAULT_SETTINGS, ...s } : { ...DEFAULT_SETTINGS };
}
async function allBookings(db) {
  const keys = await db.list("req_");
  const out = [];
  for (const k of keys) {
    const b = await db.get(k);
    if (b) out.push(b);
  }
  out.sort((a, b) => a.start < b.start ? -1 : 1);
  return out;
}
function pad(n) {
  return String(n).padStart(2, "0");
}
function dubaiNow() {
  return new Date(Date.now() + 4 * 3600 * 1e3);
}
function dubaiTodayStr() {
  const d = dubaiNow();
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function toHHMM(mins) {
  return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
}
function weekdayOf(dateStr) {
  return WEEKDAYS[(/* @__PURE__ */ new Date(dateStr + "T12:00:00Z")).getUTCDay()];
}
function slotStartMs(dateStr, hhmm, offset) {
  return (/* @__PURE__ */ new Date(`${dateStr}T${hhmm}:00${offset}`)).getTime();
}
function addDays(dateStr, n) {
  const d = /* @__PURE__ */ new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
function typeById(settings, id) {
  return settings.types.find((t) => t.id === id) || settings.types[0];
}
function freeSlotsFor(settings, bookings, dateStr, type) {
  const windows = settings.availability[weekdayOf(dateStr)] || [];
  if (!windows.length) return [];
  const step = type.minutes + settings.bufferMinutes;
  const noticeCutoff = Date.now() + settings.minNoticeHours * 3600 * 1e3;
  const taken = bookings.filter((b) => b.date === dateStr && (b.status === "pending" || b.status === "approved")).map((b) => {
    const s = toMinutes(b.time);
    return [s, s + b.minutes + settings.bufferMinutes];
  });
  const slots = [];
  for (const [ws, we] of windows) {
    const wStart = toMinutes(ws);
    const wEnd = toMinutes(we);
    for (let s = wStart; s + type.minutes <= wEnd; s += step) {
      const e = s + type.minutes + settings.bufferMinutes;
      const clash = taken.some(([ts, te]) => s < te && ts < e);
      if (clash) continue;
      if (slotStartMs(dateStr, toHHMM(s), settings.utcOffset) < noticeCutoff) continue;
      slots.push(toHHMM(s));
    }
  }
  return slots;
}
function icsFor(booking, settings) {
  const startUTC = new Date(slotStartMs(booking.date, booking.time, settings.utcOffset));
  const endUTC = new Date(startUTC.getTime() + booking.minutes * 6e4);
  const fmt = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const esc = (s) => String(s || "").replace(/[\\;,]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IFQ//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@ishafarhaquraishy`,
    `DTSTAMP:${fmt(/* @__PURE__ */ new Date())}`,
    `DTSTART:${fmt(startUTC)}`,
    `DTEND:${fmt(endUTC)}`,
    `SUMMARY:${esc(booking.typeName + " \u2014 " + booking.name)}`,
    `DESCRIPTION:${esc(`With: ${booking.name} (${booking.email}${booking.phone ? ", " + booking.phone : ""})` + (booking.org ? `
Organization: ${booking.org}` : "") + (booking.purpose ? `
Purpose: ${booking.purpose}` : ""))}`,
    `LOCATION:${esc(settings.location)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Upcoming meeting",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}
async function sendEmail({ to, subject, html, icsText }) {
  const key = Netlify.env.get("RESEND_API_KEY");
  if (!key || !to) return false;
  try {
    const payload = {
      from: Netlify.env.get("MAIL_FROM") || "IFQ Concierge <onboarding@resend.dev>",
      to: [to],
      subject,
      html
    };
    if (icsText) {
      payload.attachments = [{
        filename: "meeting.ics",
        content: Buffer.from(icsText).toString("base64")
      }];
    }
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify(payload)
    });
    return r.ok;
  } catch (e) {
    return false;
  }
}
function fmtDateLong(dateStr) {
  return (/* @__PURE__ */ new Date(dateStr + "T12:00:00Z")).toLocaleDateString(
    "en-GB",
    { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
  );
}
var json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
function isAdmin(req) {
  const pass = Netlify.env.get("ADMIN_PASS");
  if (!pass) return "unconfigured";
  return req.headers.get("x-admin-key") === pass ? true : false;
}
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var booking_default = async (req, context) => {
  const url = new URL(req.url);
  const route = url.pathname.replace(/^\/api\/booking\/?/, "") || "ping";
  const db = await storage();
  if (req.method === "GET" && route === "ping") {
    return json({ ok: true });
  }
  if (req.method === "GET" && route === "config") {
    const settings = await getSettings(db);
    const today = dubaiTodayStr();
    const days = [];
    const noticeCutoff = Date.now() + settings.minNoticeHours * 3600 * 1e3;
    for (let i = 0; i < settings.maxDaysAhead; i++) {
      const d = addDays(today, i);
      const windows = settings.availability[weekdayOf(d)] || [];
      if (!windows.length) continue;
      const lastEnd = windows.reduce((m, w) => Math.max(m, toMinutes(w[1])), 0);
      if (slotStartMs(d, toHHMM(lastEnd), settings.utcOffset) <= noticeCutoff) continue;
      days.push(d);
    }
    return json({
      types: settings.types,
      timezone: settings.timezone,
      minNoticeHours: settings.minNoticeHours,
      location: settings.location,
      days
    });
  }
  if (req.method === "GET" && route === "slots") {
    const settings = await getSettings(db);
    const date = url.searchParams.get("date") || "";
    const type = typeById(settings, url.searchParams.get("type"));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: "Invalid date" }, 400);
    const bookings = await allBookings(db);
    return json({ date, type: type.id, slots: freeSlotsFor(settings, bookings, date, type) });
  }
  if (req.method === "POST" && route === "request") {
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
    }
    if (body.website) return json({ ok: true, id: "ok" });
    const settings = await getSettings(db);
    const type = typeById(settings, body.typeId);
    const { date, time } = body;
    const name = String(body.name || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().slice(0, 160);
    const phone = String(body.phone || "").trim().slice(0, 60);
    const org = String(body.org || "").trim().slice(0, 160);
    const purpose = String(body.purpose || "").trim().slice(0, 600);
    if (!name || !EMAIL_RE.test(email)) return json({ error: "Please provide your name and a valid email." }, 400);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "") || !/^\d{2}:\d{2}$/.test(time || ""))
      return json({ error: "Invalid date or time." }, 400);
    const bookings = await allBookings(db);
    const free = freeSlotsFor(settings, bookings, date, type);
    if (!free.includes(time))
      return json({ error: "That slot was just taken. Please pick another time." }, 409);
    const id = "req_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    const booking = {
      id,
      status: "pending",
      typeId: type.id,
      typeName: type.name,
      minutes: type.minutes,
      date,
      time,
      start: `${date}T${time}`,
      name,
      email,
      phone,
      org,
      purpose,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await db.set(id, booking);
    const notify = Netlify.env.get("NOTIFY_EMAIL");
    await sendEmail({
      to: notify,
      subject: `\u{1F451} New booking request \u2014 ${name} \xB7 ${fmtDateLong(date)} ${time}`,
      html: `<h2>New booking request</h2>
        <p><b>${type.name}</b> (${type.minutes} min)<br>
        <b>${fmtDateLong(date)}</b> at <b>${time}</b> (Dubai time)</p>
        <p><b>${name}</b>${org ? " \xB7 " + org : ""}<br>${email}${phone ? "<br>" + phone : ""}</p>
        ${purpose ? `<p><i>${purpose}</i></p>` : ""}
        <p>Approve or decline in your dashboard: <a href="${url.origin}/admin.html">Open dashboard</a></p>`
    });
    return json({ ok: true, id });
  }
  if (route.startsWith("admin/")) {
    const auth = isAdmin(req);
    if (auth === "unconfigured") return json({ error: "Admin not configured. Set the ADMIN_PASS environment variable." }, 503);
    if (auth !== true) return json({ error: "Unauthorized" }, 401);
    const sub = route.slice(6);
    if (req.method === "GET" && sub === "list") {
      return json({ bookings: await allBookings(db), today: dubaiTodayStr() });
    }
    if (req.method === "POST" && sub === "decide") {
      let body = {};
      try {
        body = await req.json();
      } catch (e) {
      }
      const booking = await db.get(body.id || "");
      if (!booking) return json({ error: "Not found" }, 404);
      const action = body.action;
      if (!["approve", "decline", "cancel"].includes(action)) return json({ error: "Bad action" }, 400);
      booking.status = action === "approve" ? "approved" : action === "decline" ? "declined" : "cancelled";
      booking.decidedAt = (/* @__PURE__ */ new Date()).toISOString();
      await db.set(booking.id, booking);
      const settings = await getSettings(db);
      if (booking.status === "approved") {
        await sendEmail({
          to: booking.email,
          subject: `Confirmed \u2014 ${booking.typeName} with Dr. Ishha Farha Quraishy`,
          html: `<h2>Your meeting is confirmed</h2>
            <p><b>${booking.typeName}</b> (${booking.minutes} min)<br>
            <b>${fmtDateLong(booking.date)}</b> at <b>${booking.time}</b> (Dubai time, GST)<br>
            ${settings.location}</p>
            <p>A calendar invite is attached. Dr. Ishha's office looks forward to welcoming you.</p>`,
          icsText: icsFor(booking, settings)
        });
      } else if (booking.status === "declined") {
        await sendEmail({
          to: booking.email,
          subject: `Regarding your meeting request \u2014 Dr. Ishha Farha Quraishy`,
          html: `<p>Thank you for your interest. Unfortunately the requested slot cannot be accommodated at this time. You are welcome to request another time via the website's AI Concierge.</p>`
        });
      }
      return json({ ok: true, booking });
    }
    if (req.method === "GET" && sub === "settings") {
      return json({ settings: await getSettings(db) });
    }
    if (req.method === "POST" && sub === "settings") {
      let body = {};
      try {
        body = await req.json();
      } catch (e) {
      }
      const current = await getSettings(db);
      const next = { ...current, ...body.settings || {} };
      await db.set("settings", next);
      return json({ ok: true, settings: next });
    }
    if (req.method === "GET" && sub === "ics") {
      const booking = await db.get(url.searchParams.get("id") || "");
      if (!booking) return json({ error: "Not found" }, 404);
      const settings = await getSettings(db);
      return new Response(icsFor(booking, settings), {
        headers: {
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": `attachment; filename="meeting-${booking.date}.ics"`
        }
      });
    }
  }
  return json({ error: "Not found" }, 404);
};
var config = {
  path: ["/api/booking", "/api/booking/*"]
};
export {
  config,
  booking_default as default
};
