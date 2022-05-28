//路由模块
const express = require("express");
const router = express.Router();

//导入处理函数的模块
const user_handler = require("../router_handler/user");
//1.验证数据的中间件
const expressJoi = require("@escook/express-joi");
//2.导入需要的验证规则
//这个得到的是一个对象，但是我们只需要里面的verify_LoginRegister，所以需要解构赋值
const { verify_LoginRegister } = require("../schema/user");

//注册新用户
//3.把验证规则放到处理函数前面，验证没有问题才会进入处理函数
router.post("/reguser", expressJoi(verify_LoginRegister), user_handler.regUser);

//登录新用户
router.post("/login", expressJoi(verify_LoginRegister), user_handler.regLogin);


//共享出去
module.exports = router;
