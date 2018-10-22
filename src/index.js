import { Middleware } from 'request-middleware-pipeline';
import Contracts from "miniapp-middleware-contracts";
import extend from "just-extend";
import join from "join-path";

const defaultOptions = {
    basepath: "",
};

const privateNames = {
    options: Symbol('options'),
}

export default class extends Middleware {

    constructor(nextMiddleware, options) {
        super(nextMiddleware);

        this[privateNames.options] = extend({}, defaultOptions, options);
    }

    async invoke(middlewareContext) {
        let url = middlewareContext.data[Contracts.WxRequestOptions].url;
        if (!!url || url === "") {
            if (url.lastIndexOf("https://", 0) !== 0 && url.lastIndexOf("http://", 0) !== 0) {
                url = join(this[privateNames.basepath], url);
            }
            middlewareContext.data[Contracts.WxRequestOptions] = url;
        }

        await this.next(middlewareContext);
    }

    config(options) {
        this[privateNames.options] = extend(this[privateNames.options], options);
    }
}
