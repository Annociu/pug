const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({ secret: "your-secret-key", resave: true, saveUninitialized: true })
);
app.set("view engine", "pug");
app.set("views", "./views");

let products = [];

const users = [
  { username: "admin@gmail.com", password: "123456" },
  { username: "user@gmail.com", password: "123456" },
];

// Middleware kiểm tra đăng nhập
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect("/login");
  }
}

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    req.session.user = user;
    res.redirect("/");
  } else {
    res.render("login", { error: "Sai mật khẩu hoặc email !" });
  }
});

app.get("/", requireLogin, (req, res) => {
  res.render("index", { products: products });
});

app.post("/add", requireLogin, (req, res) => {
  const newProduct = req.body.product;
  products.push(newProduct);
  res.redirect("/");
});

app.post("/delete", requireLogin, (req, res) => {
  const index = req.body.index;
  products.splice(index, 1);
  res.redirect("/");
});

app.post("/update", requireLogin, (req, res) => {
  const index = req.body.index;
  const updatedProduct = req.body.product;
  products[index] = updatedProduct;
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server http://localhost:${port}`);
});
