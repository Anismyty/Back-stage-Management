//处理函数单独做
//数据库连接
const db = require("../db/index");

//密码加密需要的包引入
const bcrypt = require("bcryptjs");
//token生成需要的包
const jwt = require("jsonwebtoken");

// 导入密钥
const config = require("../config");

//注册
exports.regUser = (req, res) => {
  const userinfo = req.body; //获取客户端提交的数据

  //查看名字是否重复【查询语句得到的必定是一个数组】
  const repeatSql = "select * from ev_users where username =?";
  //对数据库进行查询
  db.query(repeatSql, userinfo.username, (err, results) => {
    if (err) {
      // return res.send({ status: 1, msg: err.message });
      return res.cc(err);
    }

    //判断是否被占用
    if (results.length > 0) {
      // return res.send({ status: 1, msg: "用户名被占用，请更改用户名！" });
      return res.cc("用户名被占用，请更改用户名！");
    }

    //后续其他操作
    //1.密码加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    //2.为数据库添加数据
    const addSql = "insert into ev_users set ?";
    db.query(
      addSql,
      { username: userinfo.username, password: userinfo.password },
      (err, results) => {
        if (err) {
          return res.cc(err);
        }
        if (results.affectedRows != 1) {
          return res.cc("注册用户失败，请稍后尝试！");
        }
        res.cc("注册成功！", 0);
      }
    );
  });
};

//登录
exports.regLogin = (req, res) => {
  const userinfo = req.body;
  const selectSql = "select * from ev_users where username=?";
  db.query(selectSql, userinfo.username, (err, results) => {
    if (err) return res.cc(err);
    if (results.length != 1) return res.cc("用户名不存在，请重新输入！");
    //验证输入密码和数据库密码是否一致
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    );
    if (!compareResult) return res.cc("密码错误！");
    //生成token
    //利用es6【...】展开运算符，然后利用自变量，然后把密码和图片的内容变空
    const user = { ...results[0], password: "", user_pic: "" };
    //生成token
    const strToken = jwt.sign(user, config.secretKey, {
      expiresIn: config.expiresIn,
    });
    res.send({
      status: 0,
      msg: "登陆成功！",
      token: "Bearer " + strToken, //解析需要，加上Bearer和空格
    });
  });
};
