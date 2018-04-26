import Qs from "qs";
//======================================================
// dohko 环境 "http://dohko.api.mendianbao.hualala.com"
// 线上环境 "http://dohko.api.mendianbao.hualala.com"
//======================================================

const {protocol, host, href}            = window.location;
const params = href.split('?');
const {accessToken, groupID, shopIDs} = params.length > 1 ? params[1] : {};
const __ENV__ = process.env.NODE_ENV === 'production';// 是否为生产环境
const baseURL = __ENV__ ? `${protocol}//${host}` : '/';

console.log(Qs.parse(href.split('?')[1]))

const config = {
    baseURL,
    accessToken,
    groupID,
    shopIDs,
    traceID: parseInt(100000000000*Math.random()),
    __ENV__,
}

export default config
