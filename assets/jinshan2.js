function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

let key = getQueryString('key');
let minapp_link_info = {};
let req_url = location.href;

if (getQueryString('hideLoad') !== 'true') {
  document.getElementById('public-web-container').style.display = '';
  document.getElementsByClassName('copy-notice')[0].style.display = 'block';
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('public-web-container').style.display = '';
    document.getElementsByClassName('copy-notice')[0].style.display = 'block';
  });
} else {
  document.getElementsByClassName('copy-notice')[0].style.display = 'none';
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementsByClassName('copy-notice')[0].style.display = 'none';
  });
}

function autoOpenWeChatSchema(url, maxRetry = 100, delay = 2000) {
  let retry = 0;

  function tryOpen() {
    let hidden = false;

    function handler() {
      document.removeEventListener('visibilitychange', handler);
      if (document.hidden) {
        hidden = true; // 成功跳转到微信
      }
    }

    document.addEventListener('visibilitychange', handler);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = jw_url;
    document.body.appendChild(iframe);

    // 3. 可选：隐藏页面其他内容
    document.body.style.overflow = 'hidden'; // 防止滚动

    setTimeout(() => {
      document.body.removeChild(iframe);

      // 没有跳转成功 → 重试
      if (!hidden && retry < maxRetry) {
        retry++;
        console.log('未跳转成功，重试中… 第 ' + retry + ' 次');
        tryOpen();
      }
    }, delay);
  }

  tryOpen();
}

$.ajax({
  type: 'GET',
  url: 'https://sxy518.cn/link/getDetail',
  dataType: 'json',
  data: { key: key },
  cache: false,
  async: false,
  success: function(d) {
    if (d.code === 1001) {
      data = d.data;
      req_url = d.req_url;
      $('title').text(data.title);
      $('#lin').attr('href', data.icon);
      $('#desc').attr('content', data.desc);
      jw_url = data.url;

      if (data.isForbid) {
        window.location.href = jw_url;
      }

      if (jw_url && jw_url.startsWith('weixin://')) {
        // 创建并添加隐藏的 iframe
        $('body').append(
          '<iframe src="' + jw_url + '" style="display:none;"></iframe>',
        );
      } else if (jw_url.startsWith('https://work.weixin.qq.com') || jw_url.startsWith('https://qr.qq.com')) {
        if (getQueryString('force') === 'true') {
          window.onload = function() {
            autoOpenWeChatSchema(jw_url);
          };
        } else {
          $('body').append(
            '<iframe src="' + jw_url + '" style="display:none;"></iframe>',
          );
        }
      } else {
        // 1. 创建 iframe 并设置全屏样式
        var iframe = document.createElement('iframe');
        iframe.src = jw_url;
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.zIndex = '9999'; // 确保在最上层

        // 2. 添加到 body
        document.body.appendChild(iframe);

        // 3. 可选：隐藏页面其他内容
        document.body.style.overflow = 'hidden'; // 防止滚动
      }
    } else {
      //提示
      $('.full').hide();
      $('#warnning').show();
      $('#warnText').text(d.message);
    }
  },
  error: function(res) {
  },
});

var ua = navigator.userAgent.toLowerCase();
var isWXWork = ua.match(/wxwork/i) == 'wxwork';
var isWeixin = !isWXWork && ua.match(/MicroMessenger/i) == 'micromessenger';
var isMobile = false;
var isDesktop = false;
if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|IEMobile)/i)) {
  isMobile = true;
} else {
  isDesktop = true;
}
var m = ua.match(/MicroMessenger/i);
if (isDesktop == false) {
  //进入页面自动跳转微信小程序
  openWeapp();
}
// if (isWeixin) {
//   openWeapp();
//   //     document.title = "点击右上角浏览器打开"
//   // //   containerEl.classList.remove('hidden')
//   // //   containerEl.classList.add('full', 'wechat-web-container')
//   //   $('.page').empty().append('<div id="shareGuide"><img src="../../../static/img/shareGuide.png" style="width: 100%;"><img src="../../../static/img/shareGuide2.png" style="width: 100%;"></div>')
//
//   var containerEl = document.getElementById('wechat-web-container');
//   //   containerEl.classList.remove('hidden')
//   //   containerEl.classList.add('full', 'wechat-web-container')
//
// } else if (isDesktop) {
//   // 在 pc 上则给提示引导到手机端打开
//   var containerEl = document.getElementById('desktop-web-container');
//   containerEl.classList.remove('hidden');
//   containerEl.classList.add('full', 'desktop-web-container');
//   // 二维码
//   new QRCode(document.getElementById('qrcode'), req_url);
// } else {
//   var containerEl = document.getElementById('public-web-container');
//   containerEl.classList.remove('hidden');
//   containerEl.classList.add('full', 'public-web-container');
// }

//跳转微信
function openWeapp(c) {
  // if (c == 2) {
  //     $.ajax({
  //         url: '../console/jinshan/clickNumCallback.php',
  //         type: 'get',
  //         data: {
  //             tkey: minapp_link_info.tkey
  //         },
  //         success: function (d) {
  //             console.log(d)
  //         }
  //     })
  // }
  //window.localtion.href = minapp_link_info.url
  window.open(minapp_link_info.url, '_blank');
}