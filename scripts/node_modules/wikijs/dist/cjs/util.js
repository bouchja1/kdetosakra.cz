"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseContent = exports.aggregate = exports.aggregatePagination = exports.pagination = exports.api = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const querystring_1 = __importDefault(require("querystring"));
const fetchOptions = {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit'
};
function api(apiOptions, params = {}) {
    const qs = Object.assign({
        format: 'json',
        action: 'query',
        redirects: '1'
    }, params);
    // Remove undefined properties
    Object.keys(qs).forEach(key => {
        if (qs[key] === undefined) {
            delete qs[key];
        }
    });
    if (apiOptions.origin) {
        qs.origin = apiOptions.origin;
    }
    const url = `${apiOptions.apiUrl}?${querystring_1.default.stringify(qs)}`;
    const headers = Object.assign({ 'User-Agent': 'WikiJS Bot v1.0' }, apiOptions.headers);
    return (0, cross_fetch_1.default)(url, Object.assign({ headers }, fetchOptions))
        .then(res => {
        if (res.ok) {
            return res.json();
        }
        throw new Error(`${res.status}: ${res.statusText}`);
    })
        .then(res => {
        if (res.error) {
            throw new Error(res.error.info);
        }
        return res;
    });
}
exports.api = api;
function pagination(apiOptions, params, parseResults) {
    return api(apiOptions, params).then(res => {
        let resolution = {};
        resolution.results = parseResults(res);
        resolution.query = params.srsearch;
        if (res['continue']) {
            const continueType = Object.keys(res['continue']).filter(key => key !== 'continue')[0];
            const continueKey = res['continue'][continueType];
            params[continueType] = continueKey;
            resolution.next = () => pagination(apiOptions, params, parseResults);
        }
        return resolution;
    });
}
exports.pagination = pagination;
function aggregatePagination(pagination, previousResults = []) {
    return pagination.then(res => {
        const results = [...previousResults, ...res.results];
        if (res.next) {
            return aggregatePagination(res.next(), results);
        }
        else {
            return results;
        }
    });
}
exports.aggregatePagination = aggregatePagination;
const pageLimit = 500;
function aggregate(apiOptions, params, list, key, prefix, results = []) {
    params.list = list;
    params[prefix + 'limit'] = pageLimit;
    return api(apiOptions, params).then(res => {
        const nextResults = [...results, ...res.query[list].map(e => e[key])];
        const continueWith = res['query-continue'] || res.continue;
        if (continueWith) {
            const nextFromKey = (continueWith[list] && continueWith[list][prefix + 'from']) ||
                (continueWith[list] && continueWith[list][prefix + 'continue']) ||
                continueWith[prefix + 'continue'];
            params[prefix + 'continue'] = nextFromKey;
            params[prefix + 'from'] = nextFromKey;
            return aggregate(apiOptions, params, list, key, prefix, nextResults);
        }
        return nextResults;
    });
}
exports.aggregate = aggregate;
const headingPattern = /(==+)(?:(?!\n)\s?)((?:(?!==|\n)[^])+)(?:(?!\n)\s?)(==+)/g;
function getHeadings(text) {
    let match;
    const matches = [];
    while ((match = headingPattern.exec(text)) !== null) {
        matches.push({
            level: match[1].trim().length,
            text: match[2].trim(),
            start: match.index,
            end: match.index + match[0].length
        });
    }
    return matches;
}
function parseContent(source) {
    const headings = getHeadings(source);
    const minLevel = Math.min(...headings.map(({ level }) => level));
    const sections = headings.map((heading, index) => {
        const next = headings[index + 1];
        const content = source
            .substring(heading.end, next ? next.start : undefined)
            .trim();
        return {
            title: heading.text,
            level: heading.level - minLevel,
            id: index,
            content,
            items: []
        };
    });
    const lastParentLevel = (index, level) => {
        if (level === 0)
            return null;
        for (let i = index - 1; i >= 0; i--) {
            if (sections[i].level < level) {
                return sections[i].id;
            }
        }
        return null;
    };
    // Set parents
    sections.forEach((section, index) => {
        section.parent = lastParentLevel(index, section.level);
    });
    const root = {
        items: []
    };
    const findSection = id => sections.find(s => id === s.id);
    // Organize
    sections.forEach(section => {
        if (section.parent === null) {
            root.items.push(section);
        }
        else {
            findSection(section.parent).items.push(section);
        }
    });
    // Clean up
    sections.forEach(section => {
        delete section.id;
        delete section.parent;
        delete section.level;
        if (!section.items.length) {
            delete section.items;
        }
    });
    return root.items;
}
exports.parseContent = parseContent;
