/**
 * Chain API requests together
 * @example
 * // Get page summary and images in same request
 * wiki.page('batman').then(page => page.chain().summary().image().request()).then(console.log);
 * @namespace QueryChain
 */
export default class QueryChain {
    constructor(apiOptions: any, id: any);
    id: any;
    apiOptions: any;
    _params: {
        pageids: any;
    };
    props: Set<any>;
    params(): {
        pageids: any;
    } & {
        prop: string;
    };
    direct(key: any, ...args: any[]): any;
    /**
     * Make combined API request
     * @method QueryChain#request
     * @returns {Object|Array} - Data object(s) depending on where the chain was created from
     */
    request(): Object | any[];
    chain(prop: any, params?: {}): QueryChain;
    /**
     * @summary Finds pages near a specific point
     * @method QueryChain#geosearch
     * @returns {QueryChain}
     */
    geosearch(latitude: any, longitude: any, radius: any): QueryChain;
    search(query: any, limit?: number): QueryChain;
    /**
     * @summary Useful for extracting structured section content
     * @method QueryChain#content
     * @returns {QueryChain}
     */
    content(): QueryChain;
    /**
     * @summary Useful for extracting summary content
     * @method QueryChain#summary
     * @returns {QueryChain}
     */
    summary(): QueryChain;
    /**
     * @summary Extract image
     * @method QueryChain#image
     * @returns {QueryChain}
     */
    image(types?: {
        thumbnail: boolean;
        original: boolean;
        name: boolean;
    }): QueryChain;
    /**
     * @summary Extract external links
     * @method QueryChain#extlinks
     * @returns {QueryChain}
     */
    extlinks(): QueryChain;
    /**
     * @summary Extract page links
     * @method QueryChain#links
     * @returns {QueryChain}
     */
    links(limit?: number): QueryChain;
    /**
     * @summary Extract categories
     * @method QueryChain#categories
     * @returns {QueryChain}
     */
    categories(limit?: number): QueryChain;
    /**
     * @summary Extract coordinates
     * @method QueryChain#coordinates
     * @returns {QueryChain}
     */
    coordinates(): QueryChain;
    /**
     * @summary Get list of links to different translations
     * @method QueryChain#langlinks
     * @returns {QueryChain}
     */
    langlinks(): QueryChain;
}
