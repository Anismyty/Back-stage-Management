const db = require("../db/index");

//密码加密需要的包引入
const bcrypt = require("bcryptjs");

const research =
  "select id,username,nickname,email,user_pic from ev_users where id=?";
const updata = "update ev_users set ? where id =?";
const SelctOldPwd = "select * from ev_users where id=?";
const avatrAdd = "update ev_users set user_pic =? where id =?";

//获取用户信息
//express-jwt安装后，tokne里的信息会自动挂载在req.user上
exports.getUserInfo = (req, res) => {
  db.query(research, req.user.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc("查找不到该用户，请重新登录！");
    return res.send({
      status: 0,
      msg: "获取用户信息成功！",
      data: results[0],
    });
  });
};

//更新用户信息
exports.updataUserInfo = (req, res) => {
  db.query(updata, [req.body, req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("更新失败");
    return res.cc("修改用户信息成功！", 0);
  });
};

//重置密码
exports.updatepwd = (req, res) => {
  const userinfo = req.body;
  //把旧密码和输入的旧密码进行校验
  db.query(SelctOldPwd, req.user.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc("用户名不存在，请重新输入！");
    const compareResult = bcrypt.compareSync(
      userinfo.oldPwd,
      results[0].password
    );
    if (!compareResult) return res.cc("原密码输入错误！");

    //1.新密码加密
    userinfo.newPwd = bcrypt.hashSync(userinfo.newPwd, 10);
    //2.把新密码加到数据库
    const addSql = "update ev_users set password=? where id=?";
    db.query(addSql, [userinfo.newPwd, req.user.id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows != 1)
        return res.cc("更新密码失败，请重新尝试！");
      res.cc("密码修改成功", 0);
    });
  });
};

//更换头像
exports.updataAvatar = (req, res) => {
  db.query(avatrAdd, [req.body.avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("更新失败");
    return res.cc("头像更新成功！", 0);
  });
};
