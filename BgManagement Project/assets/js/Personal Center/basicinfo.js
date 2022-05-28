$(function () {
  const form = layui.form;
  const layer = layui.layer;
  //设置正则表达式
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称长度必须在1-6之间";
      }
    },
  });
  //获取用户信息【填入默认输入框】
  function getUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status != 0) {
          return layer.msg("获取信息失败！", { icon: 5 });
        }
        //调用form.val()快速为表单赋值/接收过来的数据跟input里面的name属性一一对应
        form.val("formUserInfo", res.data);
      },
    });
  }
  getUserInfo();

  $("form").on("submit", function (e) {
    e.preventDefault();
    let info = $(this).serialize();
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: info,
      success: function (res) {
        if (res.status != 0) {
          return layer.msg("修改用户信息失败", { icon: 5 });
        }
        layer.msg("修改用户信息成功", { icon: 6 });
        //在当前页面调用父页面的方法
        window.parent.getUserInfo();
        //在当前页面点击后刷新父页面的方法
        //window.parent.location.reload();
      },
    });
  });

  //重置按钮
  $("button[type='reset']").on("click", function (e) {
    e.preventDefault();
    getUserInfo();
  });
});
