'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var BN = _interopDefault(require('bn.js'));
var strings = require('@ethersproject/strings');
var abi$9 = require('@ethersproject/abi');
var contracts = require('@ethersproject/contracts');
var jsonToGraphqlQuery = require('json-to-graphql-query');
var Ajv = _interopDefault(require('ajv'));
var address = require('@ethersproject/address');
var units = require('@ethersproject/units');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var abi = [
	{
		constant: true,
		inputs: [
			{
				components: [
					{
						name: "target",
						type: "address"
					},
					{
						name: "callData",
						type: "bytes"
					}
				],
				name: "calls",
				type: "tuple[]"
			}
		],
		name: "aggregate",
		outputs: [
			{
				name: "blockNumber",
				type: "uint256"
			},
			{
				name: "returnData",
				type: "bytes[]"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				name: "addr",
				type: "address"
			}
		],
		name: "getEthBalance",
		outputs: [
			{
				name: "balance",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	}
];

var BALANCER_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-beta',
    '42': 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-kovan'
};
function strategy(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var params, result, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        poolShares: {
                            __args: {
                                where: {
                                    userAddress_in: addresses.map(function (address) { return address.toLowerCase(); }),
                                    balance_gt: 0
                                },
                                first: 1000,
                                orderBy: 'balance',
                                orderDirection: 'desc'
                            },
                            userAddress: {
                                id: true
                            },
                            balance: true,
                            poolId: {
                                totalShares: true,
                                tokens: {
                                    id: true,
                                    balance: true
                                }
                            }
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        params.poolShares.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(BALANCER_SUBGRAPH_URL[network], params)];
                case 1:
                    result = _a.sent();
                    score = {};
                    if (result && result.poolShares) {
                        result.poolShares.forEach(function (poolShare) {
                            return poolShare.poolId.tokens.map(function (poolToken) {
                                var _a = poolToken.id.split('-'), tokenAddress = _a[1];
                                if (tokenAddress === options.address.toLowerCase()) {
                                    var userAddress = address.getAddress(poolShare.userAddress.id);
                                    if (!score[userAddress])
                                        score[userAddress] = 0;
                                    score[userAddress] =
                                        score[userAddress] +
                                            (poolToken.balance / poolShare.poolId.totalShares) *
                                                poolShare.balance;
                                }
                            });
                        });
                    }
                    return [2 /*return*/, score || {}];
            }
        });
    });
}

function getArgs(options, address) {
    var args = options.args || ['%{address}'];
    return args.map(function (arg) {
        return typeof arg === 'string' ? arg.replace(/%{address}/g, address) : arg;
    });
}
function strategy$1(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, [options.methodABI], addresses.map(function (address) { return [
                            options.address,
                            options.methodABI.name,
                            getArgs(options, address)
                        ]; }), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) { return [
                            addresses[i],
                            parseFloat(units.formatUnits(value.toString(), options.decimals))
                        ]; }))];
            }
        });
    });
}

var abi$1 = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$2(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi$1, addresses.map(function (address) { return [options.address, 'balanceOf', [address]]; }), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) { return [
                            addresses[i],
                            parseFloat(units.formatUnits(value.toString(), options.decimals))
                        ]; }))];
            }
        });
    });
}

function strategy$3(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, strategy$2(space, network, provider, addresses, options, snapshot)];
                case 1:
                    score = _a.sent();
                    return [2 /*return*/, Object.fromEntries(Object.entries(score).map(function (address) { return [
                            address[0],
                            address[1] * options.coeff
                        ]; }))];
            }
        });
    });
}

function strategy$4(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var score, totalScore;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, strategy$2(space, network, provider, addresses, options, snapshot)];
                case 1:
                    score = _a.sent();
                    totalScore = Object.values(score).reduce(function (a, b) { return a + b; }, 0);
                    return [2 /*return*/, Object.fromEntries(Object.entries(score).map(function (address) { return [
                            address[0],
                            (options.total * address[1]) / totalScore
                        ]; }))];
            }
        });
    });
}

function strategy$5(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, strategy$2(space, network, provider, addresses, options, snapshot)];
                case 1:
                    score = _a.sent();
                    return [2 /*return*/, Object.fromEntries(Object.entries(score).map(function (address) { return [address[0], Math.sqrt(address[1])]; }))];
            }
        });
    });
}

function strategy$6(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, strategy$2(space, network, provider, addresses, options, snapshot)];
                case 1:
                    score = _a.sent();
                    return [2 /*return*/, Object.fromEntries(Object.entries(score).map(function (address) { return [
                            address[0],
                            address[1] > (options.minBalance || 0) ? 1 : 0
                        ]; }))];
            }
        });
    });
}

function getDelegations(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var params, result, delegationsReverse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        delegations: {
                            __args: {
                                where: {
                                    delegate_in: addresses.map(function (address) { return address.toLowerCase(); }),
                                    delegator_not_in: addresses.map(function (address) { return address.toLowerCase(); }),
                                    space_in: ['', space]
                                },
                                first: 1000
                            },
                            delegator: true,
                            space: true,
                            delegate: true
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        params.delegations.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(SNAPSHOT_SUBGRAPH_URL[network], params)];
                case 1:
                    result = _a.sent();
                    if (!result || !result.delegations)
                        return [2 /*return*/, {}];
                    delegationsReverse = {};
                    result.delegations.forEach(function (delegation) {
                        return (delegationsReverse[delegation.delegator] = delegation.delegate);
                    });
                    result.delegations
                        .filter(function (delegation) { return delegation.space !== ''; })
                        .forEach(function (delegation) {
                        return (delegationsReverse[delegation.delegator] = delegation.delegate);
                    });
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address) { return [
                            address,
                            Object.entries(delegationsReverse)
                                .filter(function (_a) {
                                var delegate = _a[1];
                                return address.toLowerCase() === delegate;
                            })
                                .map(function (_a) {
                                var delegator = _a[0];
                                return delegator;
                            })
                        ]; }))];
            }
        });
    });
}

function strategy$7(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var delegations, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDelegations(space, network, provider, addresses, options, snapshot)];
                case 1:
                    delegations = _a.sent();
                    if (Object.keys(delegations).length === 0)
                        return [2 /*return*/, {}];
                    console.debug('Delegations', delegations);
                    return [4 /*yield*/, strategy$2(space, network, provider, Object.values(delegations).reduce(function (a, b) {
                            return a.concat(b);
                        }), options, snapshot)];
                case 2:
                    score = _a.sent();
                    console.debug('Delegators score', score);
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address) {
                            var addressScore = delegations[address]
                                ? delegations[address].reduce(function (a, b) { return a + score[b]; }, 0)
                                : 0;
                            return [address, addressScore];
                        }))];
            }
        });
    });
}

function strategy$8(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi, addresses.map(function (address) { return [
                            MULTICALL[network],
                            'getEthBalance',
                            [address]
                        ]; }), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) { return [
                            addresses[i],
                            parseFloat(units.formatUnits(value.toString(), 18))
                        ]; }))];
            }
        });
    });
}

var MAKER_DS_CHIEF_ADDRESS = {
    '1': '0x9ef05f7f6deb616fd37ac3c959a2ddd25a54e4f5'
};
var abi$2 = [
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'address'
            }
        ],
        name: 'deposits',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$9(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi$2, addresses.map(function (address) { return [
                            MAKER_DS_CHIEF_ADDRESS[network],
                            'deposits',
                            [address]
                        ]; }), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) { return [
                            addresses[i],
                            parseFloat(units.formatUnits(value.toString(), options.decimals))
                        ]; }))];
            }
        });
    });
}

var UNI_ADDRESS = {
    '1': '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
};
var abi$3 = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'getCurrentVotes',
        outputs: [
            {
                internalType: 'uint96',
                name: '',
                type: 'uint96'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$a(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi$3, addresses.map(function (address) { return [
                            UNI_ADDRESS[network],
                            'getCurrentVotes',
                            [address.toLowerCase()],
                            { blockTag: blockTag }
                        ]; }))];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) { return [
                            addresses[i],
                            parseFloat(units.formatUnits(value.toString(), options.decimals))
                        ]; }))];
            }
        });
    });
}

var abi$4 = [
    {
        constant: true,
        inputs: [],
        name: 'getPricePerFullShare',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$b(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, _a, score, pricePerFullShare;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, Promise.all([
                            strategy$2(space, network, provider, addresses, options, snapshot),
                            multicall(network, provider, abi$4, [[options.address, 'getPricePerFullShare', []]], { blockTag: blockTag })
                        ])];
                case 1:
                    _a = _b.sent(), score = _a[0], pricePerFullShare = _a[1][0];
                    pricePerFullShare = parseFloat(units.formatUnits(pricePerFullShare.toString(), 18));
                    return [2 /*return*/, Object.fromEntries(Object.entries(score).map(function (address) { return [
                            address[0],
                            address[1] * pricePerFullShare
                        ]; }))];
            }
        });
    });
}

var abi$5 = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'memberAddressByDelegateKey',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'members',
        outputs: [
            {
                internalType: 'address',
                name: 'delegateKey',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'shares',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'loot',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'exists',
                type: 'bool'
            },
            {
                internalType: 'uint256',
                name: 'highestIndexYesVote',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'jailed',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'totalShares',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$c(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, memberAddresses, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi$5, addresses.map(function (address) { return [
                            options.address,
                            'memberAddressByDelegateKey',
                            [address]
                        ]; }), { blockTag: blockTag })];
                case 1:
                    memberAddresses = _a.sent();
                    return [4 /*yield*/, multicall(network, provider, abi$5, memberAddresses
                            .filter(function (addr) {
                            return addr.toString() !== '0x0000000000000000000000000000000000000000';
                        })
                            .map(function (addr) { return [options.address, 'members', [addr.toString()]]; }), { blockTag: blockTag })];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) { return [
                            addresses[i],
                            parseFloat(units.formatUnits(value.shares.toString(), options.decimals))
                        ]; }))];
            }
        });
    });
}

var UNISWAP_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
};
function strategy$d(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var params, tokenAddress, result, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        users: {
                            __args: {
                                where: {
                                    id_in: addresses.map(function (address) { return address.toLowerCase(); })
                                },
                                first: 1000
                            },
                            id: true,
                            liquidityPositions: {
                                __args: {
                                    where: {
                                        liquidityTokenBalance_gt: 0
                                    }
                                },
                                liquidityTokenBalance: true,
                                pair: {
                                    id: true,
                                    token0: {
                                        id: true
                                    },
                                    reserve0: true,
                                    token1: {
                                        id: true
                                    },
                                    reserve1: true,
                                    totalSupply: true
                                }
                            }
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        params.users.liquidityPositions.__args.block = { number: snapshot };
                    }
                    tokenAddress = options.address.toLowerCase();
                    return [4 /*yield*/, subgraphRequest(UNISWAP_SUBGRAPH_URL[network], params)];
                case 1:
                    result = _a.sent();
                    score = {};
                    if (result && result.users) {
                        result.users.forEach(function (u) {
                            u.liquidityPositions
                                .filter(function (lp) {
                                return lp.pair.token0.id == tokenAddress ||
                                    lp.pair.token1.id == tokenAddress;
                            })
                                .forEach(function (lp) {
                                var token0perUni = lp.pair.reserve0 / lp.pair.totalSupply;
                                var token1perUni = lp.pair.reserve1 / lp.pair.totalSupply;
                                var userScore = lp.pair.token0.id == tokenAddress
                                    ? token0perUni * lp.liquidityTokenBalance
                                    : token1perUni * lp.liquidityTokenBalance;
                                var userAddress = address.getAddress(u.id);
                                if (!score[userAddress])
                                    score[userAddress] = 0;
                                score[userAddress] = score[userAddress] + userScore;
                            });
                        });
                    }
                    return [2 /*return*/, score || {}];
            }
        });
    });
}

var abi$6 = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'userInfo',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$e(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, score, balances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, strategy$2(space, network, provider, addresses, options, snapshot)];
                case 1:
                    score = _a.sent();
                    return [4 /*yield*/, Promise.all(options.chefAddresses.map(function (chefAddress) {
                            return multicall(network, provider, abi$6, addresses.map(function (address) { return [
                                chefAddress,
                                'userInfo',
                                [address],
                                { blockTag: blockTag }
                            ]; }), { blockTag: blockTag });
                        }))];
                case 2:
                    balances = _a.sent();
                    return [2 /*return*/, Object.fromEntries(Object.entries(score).map(function (address, index) { return [
                            address[0],
                            address[1] +
                                balances.reduce(function (prev, cur) {
                                    return prev +
                                        parseFloat(units.formatUnits(cur[index].amount.toString(), options.decimals));
                                }, 0)
                        ]; }))];
            }
        });
    });
}

var synthetixStateAbi = [
    {
        constant: true,
        inputs: [{ name: '', type: 'address' }],
        name: 'issuanceData',
        outputs: [
            { name: 'initialDebtOwnership', type: 'uint256' },
            { name: 'debtEntryIndex', type: 'uint256' }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
var synthetixStateContractAddress = '0x4b9Ca5607f1fF8019c1C6A3c2f0CC8de622D5B82';
function strategy$f(space, network, provider, addresses, _, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response, quadraticWeighting;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, synthetixStateAbi, addresses.map(function (address) { return [
                            synthetixStateContractAddress,
                            'issuanceData',
                            [address]
                        ]; }), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    quadraticWeighting = function (value) {
                        // Scale the value by 100000
                        var scaledValue = value * 1e5;
                        console.log('scaledValue', scaledValue);
                        return Math.sqrt(scaledValue);
                    };
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) {
                            return [
                                addresses[i],
                                // initialDebtOwnership returns in 27 decimal places
                                quadraticWeighting(parseFloat(units.formatUnits(value.initialDebtOwnership.toString(), 27)))
                            ];
                        }))];
            }
        });
    });
}

var abi$7 = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'borrowBalanceStored',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$g(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, oldBlockTag, _a, balanceOfCalls, borrowBalanceCalls, calls, _b, response, balancesOldResponse, balancesNowResponse, borrowsNowResponse, resultData, i, noBorrow, balanceNow, balanceOld;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    if (!(typeof snapshot === 'number')) return [3 /*break*/, 1];
                    _a = snapshot - options.offsetCheck;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, provider.getBlockNumber()];
                case 2:
                    _a = (_c.sent()) - options.offsetCheck;
                    _c.label = 3;
                case 3:
                    oldBlockTag = _a;
                    balanceOfCalls = addresses.map(function (address) { return [
                        options.address,
                        'balanceOf',
                        [address]
                    ]; });
                    borrowBalanceCalls = addresses.map(function (address) { return [
                        options.address,
                        'borrowBalanceStored',
                        [address]
                    ]; });
                    calls = balanceOfCalls.concat(borrowBalanceCalls);
                    return [4 /*yield*/, Promise.all([
                            multicall(network, provider, abi$7, calls, { blockTag: blockTag }),
                            multicall(network, provider, abi$7, addresses.map(function (address) { return [
                                options.address,
                                'balanceOf',
                                [address]
                            ]; }), { blockTag: oldBlockTag })
                        ])];
                case 4:
                    _b = _c.sent(), response = _b[0], balancesOldResponse = _b[1];
                    balancesNowResponse = response.slice(0, addresses.length);
                    borrowsNowResponse = response.slice(addresses.length);
                    resultData = {};
                    for (i = 0; i < balancesNowResponse.length; i++) {
                        noBorrow = 1;
                        if (options.borrowingRestricted) {
                            noBorrow =
                                borrowsNowResponse[i].toString().localeCompare('0') == 0 ? 1 : 0;
                        }
                        balanceNow = parseFloat(units.formatUnits(balancesNowResponse[i].toString(), options.decimals));
                        balanceOld = parseFloat(units.formatUnits(balancesOldResponse[i].toString(), options.decimals));
                        resultData[addresses[i]] = Math.min(balanceNow, balanceOld) * noBorrow;
                    }
                    return [2 /*return*/, resultData];
            }
        });
    });
}

var CREAM_SWAP_SUBGRAPH_URL = {
    1: 'https://api.thegraph.com/subgraphs/name/creamfinancedev/cream-swap-v2',
    3: 'https://api.thegraph.com/subgraphs/name/creamfinancedev/cream-swap-dev'
};
var longTermPoolABI = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$h(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var creamAddress, _a, score, creamBalance, _i, _b, _c, userAddress, userBalance;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    creamAddress = options.address;
                    return [4 /*yield*/, Promise.all([
                            creamSwapScore(network, addresses, creamAddress, snapshot),
                            creamBalanceOf(network, provider, addresses, options, snapshot)
                        ])];
                case 1:
                    _a = _d.sent(), score = _a[0], creamBalance = _a[1];
                    for (_i = 0, _b = Object.entries(creamBalance); _i < _b.length; _i++) {
                        _c = _b[_i], userAddress = _c[0], userBalance = _c[1];
                        if (!score[userAddress])
                            score[userAddress] = 0;
                        score[userAddress] = score[userAddress] + userBalance;
                    }
                    return [2 /*return*/, score || {}];
            }
        });
    });
}
function creamSwapScore(network, addresses, creamAddress, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var params, result, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        poolShares: {
                            __args: {
                                where: {
                                    userAddress_in: addresses.map(function (address) { return address.toLowerCase(); }),
                                    balance_gt: 0
                                },
                                first: 1000,
                                orderBy: 'balance',
                                orderDirection: 'desc'
                            },
                            userAddress: {
                                id: true
                            },
                            balance: true,
                            poolId: {
                                totalShares: true,
                                tokens: {
                                    id: true,
                                    balance: true
                                }
                            }
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        params.poolShares.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(CREAM_SWAP_SUBGRAPH_URL[network], params)];
                case 1:
                    result = _a.sent();
                    score = {};
                    if (result && result.poolShares) {
                        result.poolShares.forEach(function (poolShare) {
                            return poolShare.poolId.tokens.map(function (poolToken) {
                                var _a = poolToken.id.split('-'), tokenAddress = _a[1];
                                if (tokenAddress === creamAddress.toLowerCase()) {
                                    var userAddress = address.getAddress(poolShare.userAddress.id);
                                    if (!score[userAddress])
                                        score[userAddress] = 0;
                                    score[userAddress] =
                                        score[userAddress] +
                                            (poolToken.balance / poolShare.poolId.totalShares) *
                                                poolShare.balance;
                                }
                            });
                        });
                    }
                    return [2 /*return*/, score || {}];
            }
        });
    });
}
function creamBalanceOf(network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, numPool, numAddress, calls, _loop_1, i, balances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    numPool = options.pools.length;
                    numAddress = addresses.length;
                    calls = [];
                    _loop_1 = function (i) {
                        calls.push.apply(calls, addresses.map(function (address) { return [
                            options.pools[i].address,
                            'balanceOf',
                            [address]
                        ]; }));
                    };
                    for (i = 0; i < numPool; i++) {
                        _loop_1(i);
                    }
                    return [4 /*yield*/, multicall(network, provider, longTermPoolABI, calls, {
                            blockTag: blockTag
                        })];
                case 1:
                    balances = _a.sent();
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address, i) {
                            var sum = 0;
                            for (var j = 0; j < numPool; j++) {
                                sum += parseFloat(units.formatUnits(balances[i + j * numAddress].toString(), 18));
                            }
                            return [address, sum];
                        }))];
            }
        });
    });
}

var strategies = {
    balancer: strategy,
    'contract-call': strategy$1,
    'erc20-balance-of': strategy$2,
    'erc20-balance-of-fixed-total': strategy$4,
    'erc20-balance-of-cv': strategy$5,
    'erc20-balance-of-coeff': strategy$3,
    'erc20-with-balance': strategy$6,
    'erc20-balance-of-delegation': strategy$7,
    'eth-balance': strategy$8,
    'maker-ds-chief': strategy$9,
    uni: strategy$a,
    'yearn-vault': strategy$b,
    moloch: strategy$c,
    uniswap: strategy$d,
    pancake: strategy$e,
    synthetix: strategy$f,
    ctoken: strategy$g,
    cream: strategy$h
};

var MULTICALL = {
    '1': '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
    '4': '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
    '5': '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
    '6': '0x53c43764255c17bd724f74c4ef150724ac50a3ed',
    '42': '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
    '56': '0x1ee38d535d541c55c9dae27b12edf090c608e6fb',
    '97': '0x8b54247c6BAe96A6ccAFa468ebae96c4D7445e46',
    '100': '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
    wanchain: '0xba5934ab3056fca1fa458d30fbb3810c3eb5145f'
};
var SNAPSHOT_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot',
    '4': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-rinkeby',
    '42': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-kovan'
};
function call(provider, abi, call, options) {
    return __awaiter(this, void 0, void 0, function () {
        var contract, params, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contract = new contracts.Contract(call[0], abi, provider);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    params = call[2] || [];
                    return [4 /*yield*/, contract[call[1]].apply(contract, __spreadArrays(params, [options || {}]))];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, Promise.reject(e_1)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function multicall(network, provider, abi$1, calls, options) {
    return __awaiter(this, void 0, void 0, function () {
        var multi, itf, _a, res, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    multi = new contracts.Contract(MULTICALL[network], abi, provider);
                    itf = new abi$9.Interface(abi$1);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, multi.aggregate(calls.map(function (call) { return [
                            call[0].toLowerCase(),
                            itf.encodeFunctionData(call[1], call[2])
                        ]; }), options || {})];
                case 2:
                    _a = _b.sent(), res = _a[1];
                    return [2 /*return*/, res.map(function (call, i) { return itf.decodeFunctionResult(calls[i][1], call); })];
                case 3:
                    e_2 = _b.sent();
                    return [2 /*return*/, Promise.reject()];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function subgraphRequest(url, query) {
    return __awaiter(this, void 0, void 0, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ query: jsonToGraphqlQuery.jsonToGraphQLQuery({ query: query }) })
                    })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data || {}];
            }
        });
    });
}
function ipfsGet(gateway, ipfsHash, protocolType) {
    if (protocolType === void 0) { protocolType = 'ipfs'; }
    return __awaiter(this, void 0, void 0, function () {
        var url;
        return __generator(this, function (_a) {
            url = "https://" + gateway + "/" + protocolType + "/" + ipfsHash;
            return [2 /*return*/, fetch(url).then(function (res) { return res.json(); })];
        });
    });
}
function sendTransaction(web3, contractAddress, abi, action, params, overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var signer, contract, contractWithSigner;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signer = web3.getSigner();
                    contract = new contracts.Contract(contractAddress, abi, web3);
                    contractWithSigner = contract.connect(signer);
                    return [4 /*yield*/, contractWithSigner[action].apply(contractWithSigner, __spreadArrays(params, [overrides]))];
                case 1: 
                // overrides.gasLimit = 12e6;
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getScores(space, strategies$1, network, provider, addresses, snapshot) {
    if (snapshot === void 0) { snapshot = 'latest'; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(strategies$1.map(function (strategy) {
                        return strategies[strategy.name](space, network, provider, addresses, strategy.params, snapshot);
                    }))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function validateSchema(schema, data) {
    var ajv = new Ajv();
    var validate = ajv.compile(schema);
    var valid = validate(data);
    return valid ? valid : validate.errors;
}
var utils = {
    call: call,
    multicall: multicall,
    subgraphRequest: subgraphRequest,
    ipfsGet: ipfsGet,
    sendTransaction: sendTransaction,
    getScores: getScores,
    validateSchema: validateSchema
};

var ARAGON_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-mainnet',
    '4': 'https://api.thegraph.com/subgraphs/name/evalir/aragon-govern-rinkeby'
};
var abi$8 = [
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            {
                                internalType: 'uint256',
                                name: 'nonce',
                                type: 'uint256'
                            },
                            {
                                internalType: 'uint256',
                                name: 'executionTime',
                                type: 'uint256'
                            },
                            {
                                internalType: 'address',
                                name: 'submitter',
                                type: 'address'
                            },
                            {
                                internalType: 'contract IERC3000Executor',
                                name: 'executor',
                                type: 'address'
                            },
                            {
                                components: [
                                    {
                                        internalType: 'address',
                                        name: 'to',
                                        type: 'address'
                                    },
                                    {
                                        internalType: 'uint256',
                                        name: 'value',
                                        type: 'uint256'
                                    },
                                    {
                                        internalType: 'bytes',
                                        name: 'data',
                                        type: 'bytes'
                                    }
                                ],
                                internalType: 'struct ERC3000Data.Action[]',
                                name: 'actions',
                                type: 'tuple[]'
                            },
                            {
                                internalType: 'bytes32',
                                name: 'allowFailuresMap',
                                type: 'bytes32'
                            },
                            {
                                internalType: 'bytes',
                                name: 'proof',
                                type: 'bytes'
                            }
                        ],
                        internalType: 'struct ERC3000Data.Payload',
                        name: 'payload',
                        type: 'tuple'
                    },
                    {
                        components: [
                            {
                                internalType: 'uint256',
                                name: 'executionDelay',
                                type: 'uint256'
                            },
                            {
                                components: [
                                    {
                                        internalType: 'address',
                                        name: 'token',
                                        type: 'address'
                                    },
                                    {
                                        internalType: 'uint256',
                                        name: 'amount',
                                        type: 'uint256'
                                    }
                                ],
                                internalType: 'struct ERC3000Data.Collateral',
                                name: 'scheduleDeposit',
                                type: 'tuple'
                            },
                            {
                                components: [
                                    {
                                        internalType: 'address',
                                        name: 'token',
                                        type: 'address'
                                    },
                                    {
                                        internalType: 'uint256',
                                        name: 'amount',
                                        type: 'uint256'
                                    }
                                ],
                                internalType: 'struct ERC3000Data.Collateral',
                                name: 'challengeDeposit',
                                type: 'tuple'
                            },
                            {
                                internalType: 'address',
                                name: 'resolver',
                                type: 'address'
                            },
                            {
                                internalType: 'bytes',
                                name: 'rules',
                                type: 'bytes'
                            }
                        ],
                        internalType: 'struct ERC3000Data.Config',
                        name: 'config',
                        type: 'tuple'
                    }
                ],
                internalType: 'struct ERC3000Data.Container',
                name: '_container',
                type: 'tuple'
            }
        ],
        name: 'schedule',
        outputs: [
            {
                internalType: 'bytes32',
                name: 'containerHash',
                type: 'bytes32'
            }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'nonce',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];
var GQL_QUERY = {
    registryEntry: {
        __args: {
            id: undefined
        },
        executor: {
            address: true
        },
        queue: {
            address: true,
            config: {
                executionDelay: true,
                scheduleDeposit: {
                    token: true,
                    amount: true
                },
                challengeDeposit: {
                    token: true,
                    amount: true
                },
                resolver: true,
                rules: true
            }
        }
    }
};
var FAILURE_MAP = '0x0000000000000000000000000000000000000000000000000000000000000000';
var EMPTY_BYTES = '0x00';
/**
 * scheduleAction schedules an action into a GovernQueue.
 * Instead of sending the action to a disputable delay from aragonOS, we directly call this
 * contract.
 * the actionsFromAragonPlugin is an array of objects with the form { to, value, data }
 */
function scheduleAction(network, web3, daoName, account, proof, actionsFromAragonPlugin) {
    return __awaiter(this, void 0, void 0, function () {
        var query, result, config, nonce, bnNonce, newNonce, currentDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = GQL_QUERY;
                    query.registryEntry.__args.id = daoName;
                    return [4 /*yield*/, subgraphRequest(ARAGON_SUBGRAPH_URL[network], query)];
                case 1:
                    result = _a.sent();
                    config = result.registryEntry.queue.config;
                    return [4 /*yield*/, call(web3, abi$8, [
                            result.registryEntry.queue.address,
                            'nonce'
                        ])];
                case 2:
                    nonce = _a.sent();
                    bnNonce = new BN(nonce.toString());
                    newNonce = bnNonce.add(new BN('1'));
                    currentDate = Math.round(Date.now() / 1000) + Number(config.executionDelay) + 60;
                    return [4 /*yield*/, sendTransaction(web3, result.registryEntry.queue.address, abi$8, 'schedule', [
                            {
                                payload: {
                                    nonce: newNonce.toString(),
                                    executionTime: currentDate,
                                    submitter: account,
                                    executor: result.registryEntry.executor.address,
                                    actions: actionsFromAragonPlugin,
                                    allowFailuresMap: FAILURE_MAP,
                                    // proof in snapshot's case, could be the proposal's IPFS CID
                                    proof: proof ? strings.toUtf8Bytes(proof) : EMPTY_BYTES
                                },
                                config: {
                                    executionDelay: config.executionDelay,
                                    scheduleDeposit: {
                                        token: config.scheduleDeposit.token,
                                        amount: config.scheduleDeposit.amount
                                    },
                                    challengeDeposit: {
                                        token: config.challengeDeposit.token,
                                        amount: config.challengeDeposit.amount
                                    },
                                    resolver: config.resolver,
                                    rules: config.rules
                                }
                            }
                        ], {
                            // This can probably be optimized
                            gasLimit: 500000
                        })];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var Plugin = /** @class */ (function () {
    function Plugin() {
        this.author = 'Evalir';
        this.version = '0.1.3';
        this.name = 'Aragon Govern';
        this.website = 'https://aragon.org/blog/snapshot';
    }
    Plugin.prototype.action = function (network, web3, spaceOptions, proposalOptions, proposalId, winningChoice) {
        return __awaiter(this, void 0, void 0, function () {
            var account, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, web3.listAccounts()];
                    case 1:
                        account = (_a.sent())[0];
                        return [4 /*yield*/, scheduleAction(network, web3, spaceOptions.id, account, proposalId, proposalOptions["choice" + winningChoice].actions)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Plugin;
}());

var plugins = {
    aragon: Plugin
};

var $schema = "http://json-schema.org/draft-07/schema#";
var $ref = "#/definitions/Space";
var definitions = {
	Space: {
		title: "Space",
		type: "object",
		properties: {
			name: {
				type: "string",
				title: "name",
				maxLength: 32
			},
			network: {
				type: "string",
				title: "network",
				maxLength: 32
			},
			symbol: {
				type: "string",
				title: "symbol",
				maxLength: 12
			},
			skin: {
				type: "string",
				title: "skin",
				maxLength: 32
			},
			domain: {
				type: "string",
				title: "domain",
				maxLength: 64
			},
			strategies: {
				type: "array",
				minItems: 1,
				maxItems: 3,
				items: {
					type: "object",
					properties: {
						name: {
							type: "string",
							maxLength: 64,
							title: "name"
						},
						params: {
							type: "object",
							title: "params"
						}
					},
					required: [
						"name"
					],
					additionalProperties: false
				},
				title: "strategies"
			},
			members: {
				type: "array",
				items: {
					type: "string",
					maxLength: 64
				},
				title: "members"
			},
			filters: {
				type: "object",
				properties: {
					defaultTab: {
						type: "string"
					},
					minScore: {
						type: "number",
						minimum: 0
					},
					onlyMembers: {
						type: "boolean"
					},
					invalids: {
						type: "array",
						items: {
							type: "string",
							maxLength: 64
						},
						title: "invalids"
					}
				},
				additionalProperties: false
			}
		},
		required: [
			"name",
			"network",
			"symbol",
			"strategies"
		],
		additionalProperties: false
	}
};
var space = {
	$schema: $schema,
	$ref: $ref,
	definitions: definitions
};

var schemas = {
    space: space.definitions.Space
};

var index = {
    plugins: plugins,
    strategies: strategies,
    schemas: schemas,
    utils: utils
};

module.exports = index;