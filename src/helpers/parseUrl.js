/**
 * 获取URL中的查询参数
 * @param  {String} url [浏览器地址栏的URL]
 * @return [Object]       查询参数的键值对
 */
export function parseURL(url){
　　const pattern = /([^?]\w+)=(\w+)/ig;//定义正则表达式
　　const parames = {};//定义数组
　　url.replace(pattern, function(a, b, c){
　　　　parames[b] = c;
　　});
　　return parames;
}
