"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPortsCache = exports.tryPort = exports.validPort = exports.getFreePort = exports.MAX_PORT = exports.MIN_PORT = void 0;
const tslib_1 = require("tslib");
const resolveConfig_1 = tslib_1.__importStar(require("../resolveConfig"));
const crypto = tslib_1.__importStar(require("node:crypto"));
const net = tslib_1.__importStar(require("node:net"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const log = (0, debug_1.default)('MongoMS:GetPort');
/** Linux min port that does not require root permissions */
exports.MIN_PORT = 1024;
/** u16 max number */
exports.MAX_PORT = 65535;
/**
 * Time before {@link PORTS_CACHE} gets cleared
 * 10 seconds
 */
const PORTS_CACHE_CLEAN_TIME = 1000 * 10;
/**
 * Ports cache, so that locked ports are quickly ignored and hoping for less port stealing
 */
const PORTS_CACHE = {
    timeSet: undefined,
    ports: new Set(),
    lastNumber: exports.MIN_PORT,
};
/** Max default tries before giving up */
const MAX_DEFAULT_TRIES = 10;
/**
 * Try to get a free port
 * @param firstPort The first port to try or empty for semi-random port
 * @param max_tries maximum amount of tries to get a port, default to {@link MAX_DEFAULT_TRIES}
 * @returns A valid free port
 * @throws if "max_tries" is exceeded
 */
async function getFreePort(firstPort, max_tries = MAX_DEFAULT_TRIES) {
    // Get a random value from crypto to use as first port if none is given
    firstPort = firstPort || validPort(crypto.randomInt(exports.MIN_PORT, exports.MAX_PORT + 1));
    // clear ports cache after some time, but not on an interval
    if (PORTS_CACHE.timeSet && Date.now() - PORTS_CACHE.timeSet > PORTS_CACHE_CLEAN_TIME) {
        PORTS_CACHE.ports.clear();
        PORTS_CACHE.timeSet = Date.now();
    }
    else if (!PORTS_CACHE.timeSet) {
        PORTS_CACHE.timeSet = Date.now();
    }
    const exp_net0listen = (0, resolveConfig_1.envToBool)((0, resolveConfig_1.default)(resolveConfig_1.ResolveConfigVariables.EXP_NET0LISTEN));
    log('EXP_NET0LISTEN', exp_net0listen);
    let tries = 0;
    while (tries <= max_tries) {
        tries += 1;
        let nextPort;
        if (exp_net0listen) {
            // "0" means to use ".listen" random port
            nextPort = tries === 1 ? firstPort : 0;
        }
        else {
            // use "startPort" at first try, otherwise increase from last number
            nextPort = tries === 1 ? firstPort : validPort(PORTS_CACHE.lastNumber + tries);
        }
        // try next port, because it is already in the cache
        // unless port is "0" which will use "net.listen(0)"
        if (PORTS_CACHE.ports.has(nextPort) && nextPort !== 0) {
            continue;
        }
        PORTS_CACHE.ports.add(nextPort);
        // only set "lastNumber" if the "nextPort" was not in the cache
        PORTS_CACHE.lastNumber = nextPort;
        const triedPort = await tryPort(nextPort);
        // returned port can be different than the "nextPort" (if EXP_NET0LISTEN)
        PORTS_CACHE.ports.add(nextPort);
        if (triedPort > 0) {
            return triedPort;
        }
    }
    throw new Error('Max port tries exceeded');
}
exports.getFreePort = getFreePort;
exports.default = getFreePort;
/**
 * Check that input number is within range of {@link MIN_PORT} and {@link MAX_PORT}
 * If more than {@link MAX_PORT}, wrap around, if less than {@link MIN_PORT} use {@link MIN_PORT}
 * @param port The Number to check
 * @returns A Valid number in port range
 */
function validPort(port) {
    const mod = port % exports.MAX_PORT;
    return mod < exports.MIN_PORT ? exports.MIN_PORT : mod;
}
exports.validPort = validPort;
/**
 * Try a given port
 * @param port The port to try
 * @returns "true" if the port is not in use, "false" if in use
 * @throws The error given if the code is not "EADDRINUSE"
 */
function tryPort(port) {
    return new Promise((res, rej) => {
        const server = net.createServer();
        // some engines dont support ".unref"(net / tcp.unref), like "deno" in the past and now "bun"
        if (typeof server.unref === 'function') {
            server.unref(); // dont keep this server from exiting the application
        }
        server.on('error', (err) => {
            if (err?.code !== 'EADDRINUSE') {
                rej(err);
            }
            res(-1);
        });
        server.listen(port, () => {
            const address = server.address();
            const port = address.port;
            server.close();
            res(port);
        });
    });
}
exports.tryPort = tryPort;
/**
 * Reset the {@link PORTS_CACHE} to its initial state
 *
 * This function is meant for debugging and testing purposes only
 */
function resetPortsCache() {
    PORTS_CACHE.lastNumber = exports.MIN_PORT;
    PORTS_CACHE.timeSet = undefined;
    PORTS_CACHE.ports.clear();
}
exports.resetPortsCache = resetPortsCache;
//# sourceMappingURL=index.js.map