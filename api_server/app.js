const express = require("express");
const app = express();
//导入路由模块
const userRouter = require("./router/user");
const userInfoRouter = require("./router/userinfo");
const articleRouter = require("./router/article");
const pubArticle = require("./router/pub_article");

//注册全局中间件
const cors = require("cors");
//跨域需求
app.use(cors()); //跨域

//托管静态资源——让外部可以访问上传的文章图片
app.use("/uploads", express.static("./uploads"));

//导入验证的包
const joi = require("joi");

//导入token相关的包
const config = require("./config");
const expressJWT = require("express-jwt");

app.use(express.urlencoded({ extended: false })); //解析数据，解析application/x-www-form-urlencoded格式
//多次调用了res.send(),为了简化代码，就封装一个全局的变量
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({ status, msg: err instanceof Error ? err.message : err });
  };
  next();
});
//注册全局使用的解析
app.use(
  expressJWT({ secret: config.secretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/api/],
  })
);

//注册路由模块

//注册登录
app.use("/api", userRouter);
//个人账户
app.use("/my", userInfoRouter);
//文章分类
app.use("/my/article", articleRouter);

//文章内容
app.use("/my/article", pubArticle);

//错误级别中间件
app.use((err, req, res, next) => {
  //验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err);
  //token引起的失败
  if (err.name === "UnauthorizedError") return res.cc("身份认证失败！");
  //未知的错误
  res.cc(err);
});

//启动web服务器
app.listen(3007, () => {
  console.log("http://127.0.0.1:3007");
});
