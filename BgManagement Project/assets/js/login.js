$(function () {
  // 登录注册的按钮交换
  $(".login .login1").on("click", "a", function () {
    $(this).parents(".login").hide().siblings(".reg").show();
  });
  $(".reg .reg1").on("click", "a", function () {
    $(this).parents(".reg").hide().siblings(".login").show();
  });
  // 表单输入的验证
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    psw: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    repsw: function (value) {
      let psw = $(".reg [name='password']").val();
      if (psw != value) {
        return "两次密码不一致！";
      }
    },
  });
  // 注册页面请求ajax的post
  $(".reg form").on("submit", function (e) {
    e.preventDefault();
    //获取表单输入内容
    let data = $(this).serialize();
    //发起请求
    $.ajax({
      method: "POST",
      url: "/api/reguser",
      data: data,
      success: function (res) {
        if (res.status === 1) {
          return layer.msg(res.message, { icon: 5 });
        }
        layer.msg("注册成功,请登录", { icon: 6 });
        $(".reg").hide().siblings(".login").show();
      },
    });
  });
  //登陆页面
  $(".login form").on("submit", function (e) {
    let data = $(this).serialize();
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/api/login",
      data: data,
      success: function (res) {
        if (res.status === 1) {
          return layer.msg("密码输入错误", { icon: 5 });
        }
        layer.msg("登陆成功", { icon: 6 });
        //将登录成功后形成的密钥存到本地存储中[便于后续的访问]
        localStorage.setItem("token", res.token);

        //跳转到后台主页
        location.href = "/index.html";
      },
    });
  });
});
