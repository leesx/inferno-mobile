import {parseURL} from './parseUrl';

//======================================================
// dohko 环境 "http://dohko.api.mendianbao.hualala.com"
// 线上环境 "http://dohko.api.mendianbao.hualala.com"
//======================================================

const
    mockAccessTokenToken              = 'MDB_EMPLOYEE_SESSIONeece1f4012024a0a9731d285686cc2f8',
    {protocol, host, href}            = window.location,
    {accessToken, groupID, paperSize} = parseURL(href),
    __ENV__                           = process.env.NODE_ENV === 'production',// 是否为生产环境
    baseURL                           = __ENV__ ? `${protocol}//${host}` : '/';

const config = {
    baseURL,
    accessToken: __ENV__ ? accessToken : mockAccessTokenToken,
    groupID,
    paperSize,
    traceID    : parseInt(100000000000 * Math.random()),
    __ENV__,
}

export default config
