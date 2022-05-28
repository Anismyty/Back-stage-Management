$(function () {
  //获取数据
  getUserInfo();

  let layer = layui.layer;
  //退出按钮
  $("#btnLogOut").on("click", function () {
    layer.confirm(
      "确定退出登录？",
      { icon: 3, title: "提示" },
      //点击确定后的回调函数
      function (index) {
        //清除本地存储
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        //回到登陆页面
        location.href = "/login.html";
        //关闭对应的询问框
        layer.close(index);
      }
    );
  });
});

//获取数据
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    success: function (res) {
      if (res.status != 0) {
        return layer.msg("获取信息失败！", { icon: 5 });
      }
      renderAvatar(res.data);
    },
    //根目录里面挂在了complete函数，不管是否成功都会执行
  });
}
//渲染头像
function renderAvatar(data) {
  let person = data.nickname || data.username;
  $(".person").text(person);
  //判断是否有头像
  if (data.user_pic != null) {
    //渲染图片url
    $(".text-avatar").hide();
    $(".layui-nav-img").show().attr("src", data.user_pic);
  } else {
    $(".layui-nav-img").hide();
    $(".text-avatar").show().text(person.charAt(0).toUpperCase());
  }
}
