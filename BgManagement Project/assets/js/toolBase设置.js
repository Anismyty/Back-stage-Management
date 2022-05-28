// 根目录额外设置，便于之后根目录修改
$.ajaxPrefilter(function (options) {
  //在线的地址
  //options.url = "http://www.liulongbin.top:3007" + options.url;

  //测试自己写的端口
  options.url = "http://127.0.0.1:3007" + options.url;

  //统一为有权限的接口配置headers请求头
  // 判断需要接口的url
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }
  //全局统一挂载complete事件
  //不论成功还是失败都会执行这个函数
  options.complete = function (res) {
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.msg === "身份认证失败！"
    ) {
      localStorage.removeItem("token");
      location.href = "/login.html";
    }
  };
});
