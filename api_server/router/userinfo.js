//路由模块
const express = require("express");
const router = express.Router();

const user_handler = require("../router_handler/userinfo");
//1.验证数据的中间件
const expressJoi = require("@escook/express-joi");
//2.导入需要的验证规则
//这个得到的是一个对象，但是我们只需要里面的verify_LoginRegister，所以需要解构赋值
const { update_UserInfo, infoUpdatepwd, avatarAdd } = require("../schema/user");

//获取信息
router.get("/userinfo", user_handler.getUserInfo);

//更新信息
router.post(
  "/userinfo",
  expressJoi(update_UserInfo),
  user_handler.updataUserInfo
);
//重置密码
router.post("/updatepwd", expressJoi(infoUpdatepwd), user_handler.updatepwd);

//更换头像
router.post("/update/avatar", expressJoi(avatarAdd), user_handler.updataAvatar);

module.exports = router;
