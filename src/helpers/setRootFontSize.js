((doc, win) => {
  const docEl = doc.documentElement
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  const reCalc = () => {
		      let clientWidth = docEl.clientWidth;
		      if (!clientWidth) return;
					if(clientWidth<=640) clientWidth=640
						else if(clientWidth>1024) clientWidth = 1024

		      docEl.style.fontSize = (clientWidth / 10) + 'px';
		    };
  if (!doc.addEventListener) return;
	//当dom加载完成时，或者 屏幕垂直、水平方向有改变进行html的根元素计算
  win.addEventListener(resizeEvt, reCalc, false);
  doc.addEventListener('DOMContentLoaded', reCalc, false);
})(document, window);
