$(function () {
  const form = layui.form;
  const layer = layui.layer;
  //新密码的正则表达式
  form.verify({
    psw: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    //新密码两次输入必须一致
    repsw: function (value) {
      let psw = $(".newPwd").val();
      if (psw != value) {
        return "两次密码不一致！";
      }
    },
    //新旧密码校验
    samePwd: function (value) {
      if (value === $(".oldPwd").val()) {
        return "新密码不能和旧密码一样！";
      }
    },
  });

  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layer.msg("原密码输入错误", { icon: 5 });
        }
        layer.msg("密码修改成功", { icon: 6 });
        //重置表单
        $(".layui-form")[0].reset();
        //禁止频繁修改密码
        $(".change").addClass("layui-btn-disabled");
        let i = 30;
        $(".change").text(`请等待${i}s后再修改`);
        let timer = setInterval(() => {
          i--;
          $(".change").text(`请等待${i}s后再修改`);
          if (i === 0) {
            clearInterval(timer);
            i = 30;
            $(".change").removeClass("layui-btn-disabled");
            $(".change").text("修改密码");
          }
        }, 1000);
      },
    });
  });
});
