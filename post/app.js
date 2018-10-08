const express = require('express');
const path = require('path');
// const aws = require('aws-sdk');
// const searches = require('./models/searches');
const { Client } = require('pg');
// const bootstrap = require('bootstrap');
const exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
// instantiate client using your DB configurations
/* const client = new Client({
database: 'KART ENGLATERA',
user: 'postgres',
password: 'engrkye19',
host: 'localhost',
port: 5432
*/

var nodemailer = require('nodemailer');

var id;

const client = new Client({
  database: 'ddanjjrmfktufr',
  user: 'izhcgjbnymylig',
  password: '671b18195a9481308ae6f4d75630f94949ccf6d59309c4ec99b49dc4dbe680b4',
  host: 'ec2-50-19-86-139.compute-1.amazonaws.com',
  port: 5432,
  ssl: true

});

// connect to database
client.connect()
  .then(function () {
    console.log('connected to database!');
  })
  .catch(function () {
    console.log('cannot connect to database!');
  });

const app = express();
// tell express which folder is a static/public folder
app.use(express.static(path.join(__dirname, 'public')));
//
app.engine('handlebars', exphbs({defaultlayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/models', express.static(__dirname + '/models'));

app.get('/', function (req, res) {
  res.render('home', {
    title: 'THESIS MANAGEMENT SYSTEM'
  });
});

app.get('/adminpage', function (req, res) {
  res.render('adminpage1', {
    title: 'THESIS MANAGEMENT SYSTEM'
  });
});


app.get('/add_faculty', function (req, res) {
  res.render('addfaculty', {
    title: 'THESIS MANAGEMENT SYSTEM'
  });
});



// start pf brand
app.post('/brandlist', function (req, res) {
  var values = [];
  var brandName;
  brandName = req.body.brandname;
  values = [req.body.brandname, req.body.description];
  console.log(req.body);
  console.log(values);
  client.query('SELECT name FROM brands', (req, data) => {
    var list;
    var exist = 0;
    for (var i = 0; i < data.rows.length; i++) {
      list = data.rows[i].name;
      console.log(list);
      if (list === brandName) {
        exist = 1;
      }
    }
    if (exist === 1) {
      res.render('fail_brand', {// temporary html
      });
    } else {
      client.query('INSERT INTO brands(name, description) VALUES($1, $2)', values, (err, data) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(data.rows[0]);
        }
      });
      res.redirect('/brandlist');
    }
  });
});

app.get('/brandlist', function (req, res) {
  client.query('SELECT * FROM brands', (req, data) => {
    var list = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list.push(data.rows[i - 1]);
    }

    res.render('brandlist', {
      title: 'THENEWUSED_brands',
      brandnames: list
    });
  });
});

app.get('/brand/create', function (req, res) {
  res.render('create_brand', {
    title: 'THENEWUSED_brands'
  });
});

// end of brand

// start of category

app.post('/categorieslist', function (req, res) {
  var values = [];
  var categoryName;
  categoryName = req.body.categoryname;
  values = [req.body.categoryname];
  console.log(req.body);
  console.log(values);
  client.query('SELECT name FROM products_category', (req, data) => {
    var list;
    var exist = 0;
    for (var i = 0; i < data.rows.length; i++) {
      list = data.rows[i].name;
      console.log(list);
      if (list === categoryName) {
        exist = 1;
      }
    }
    if (exist === 1) {
      res.render('fail_category', {// temporary html
      });
    } else {
      client.query('INSERT INTO products_category(name) VALUES($1)', values, (err, data) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(data.rows[0]);
        }
      });
      res.redirect('/categorieslist');
    }
  });
});

app.get('/categorieslist', function (req, res) {
  client.query('SELECT * FROM products_category', (req, data) => {
    var list = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list.push(data.rows[i - 1]);
    }

    res.render('categorieslist', {
      title: 'THENEWUSED_categories',
      categorynames: list
    });
  });
});

app.get('/category/create', function (req, res) {
  res.render('create_category1', {
    title: 'THENEWUSED_categories'
  });
});

// end of category

// start of products
app.post('/products', function (req, res) {

  var values = [];
  var productName;
  productName = req.body.productname;
  values = [req.body.productname,
    req.body.productdescription,
    req.body.tagline,
    req.body.price,
    req.body.warranty,
    req.body.images,
    req.body.category_id,
    req.body.brand_id];
  client.query('SELECT product_name FROM products', (req, data) => {
    var list;
    var exist = 0;
    for (var i = 0; i < data.rows.length; i++) {
      list = data.rows[i].product_name;
      if (list === productName) {
        exist = 1;
      }
    }
    if (exist === 1) {
      res.render('fail_product', {
      });
    } else {
      client.query('INSERT INTO products(product_name, product_description, tagline, price, warranty, images, category_id, brand_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', values, (err, res) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(data.rows[0]);
        }
      });
      res.redirect('/products');
    }
  });
});

app.get('/products', function (req, res) {
  client.query('SELECT * FROM products ORDER BY id ASC', (req, data) => {
    var list = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list.push(data.rows[i - 1]);
    }

    res.render('products', {
      title: 'THENEWUSED_products',
      products: list
    });
  });
});

app.get('/product/create', function (req, res) {
  res.render('create_products', {
    title: 'THENEWUSED_products'
  });
});

// productview
app.get('/product/:idNew', function (req, res) {
  const idNew = req.params.idNew;

  var list1 = [];
  var list = [];
  client.query('SELECT * FROM products where id=' + idNew + ' ', (req, data2) => {
    for (var i = 0; i < data2.rowCount; i++) {
      list1[i] = data2.rows[i];
    } list = list1;
    id = idNew;

    res.render('productview', {
      title: 'THENEWUSED_products',
      products: list[0]
    });
  });
});
// end of products

app.get('/success', function (req, res) {
  res.render('success', {
    title: 'THENEWUSED_brands'
  });
});


app.get('/fail', function (req, res) {
  res.render('fail', {
    title: 'THENEWUSED_brands'
  });
});

app.get('/productfailed', function (req, res) {
  res.render('fail_product', {
    title: 'THENEWUSED_brands'
  });
});

// start of customers
app.post('/customers', function (req, res) {
  client.query(`SELECT * FROM customers where email='` + req.body.email + `' `, (req2, data4) => {
    if (data4.rowCount >= 1) {
      console.log(req.body);
      client.query("SELECT * FROM customers where email='" + req.body.email + "' ", (req3, data11) => {
        client.query("INSERT INTO orders (customer_id,product_id,quantity,order_date) VALUES ('" + data11.rows[0].id + "','" + req.body.productId + "','" + req.body.quantity + "',CURRENT_TIMESTAMP)");

        var receivers = ['team2.dbms1819@gmail.com', req.body.email];

        let mailOptions, transporter;
        transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'team2.dbms1819@gmail.com',
            pass: 'database1819'
          }
        });
        console.log(req.body);

        mailOptions = {
          // from: req.body.FN+'  &lt; '+ req.body.LN +'   &lt;' + req.body.email +' &gt;', // sender address
          from: 'team2.dbms1819@gmail.com', // list of receivers
          to: receivers,
          subject: 'ORDER DETAILS', // Subject line
          text: 'Order Details: \n Name:' + req.body.first_name + req.body.last_name + '\n Email:' + req.body.email + '\n Product ID:' + req.body.productId

        };

        console.log(mailOptions);

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, response) {
          if (error) {
            res.redirect('/fail');
          }
          // else
          // {
          res.redirect('/customers');
        });
      });
    } else if (data4.rowCount === 0) {
      console.log(req.body);
      client.query("INSERT INTO customers (email,first_name,last_name,street,municipality,province,zipcode) VALUES ('" + req.body.email + "','" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.street + "','" + req.body.municipality + "','" + req.body.province + "','" + req.body.zipcode + "')");
      client.query("SELECT * FROM customers where email='" + req.body.email + "' ", (req3, data11) => {
        console.log(data11);
        client.query("INSERT INTO orders (customer_id,product_id,quantity,order_date) VALUES ('" + data11.rows[0].id + "','" + req.body.productId + "','" + req.body.quantity + "',CURRENT_TIMESTAMP)");

        var receivers = ['team2.dbms1819@gmail.com', req.body.email];

        let mailOptions, transporter;
        transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'team2.dbms1819@gmail.com',
            pass: 'database1819'
          }
        });
        console.log(req.body);

        mailOptions = {
          // from: req.body.FN+'  &lt; '+ req.body.LN +'   &lt;' + req.body.email +' &gt;', // sender address
          from: 'team2.dbms1819@gmail.com', // list of receivers
          to: receivers,
          subject: 'ORDER DETAILS', // Subject line
          text: 'Order Details: \n Name:' + req.body.first_name + req.body.last_name + '\n Email:' + req.body.email + '\n Product ID:' + req.body.productId

        };

        console.log(mailOptions);

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, response) {
          if (error) {
            res.redirect('/fail');
          }
          // else
          // {
          res.redirect('/customers');
        });
      });
    }
  });
});

app.get('/customers', function (req, res) {
  client.query('SELECT * FROM customers', (req, data) => {
    var list = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list.push(data.rows[i - 1]);
    }

    res.render('customers', {
      title: 'THENEWUSED_customers',
      customers: list
    });
  });
});

app.post('/customers_details', function (req, res) {
  var values = [];
  values = [req.body.email, req.body.first_name, req.body.last_name];
  console.log(req.body);
  console.log(values);
  client.query('INSERT INTO customers(email,first_name,last_name) VALUES ($1,$2,$3)', values, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log('customers successfully added');
    }
  });
  res.redirect('/customers_details');
});

app.get('/customers_details', function (req, res) {
  client.query('SELECT * FROM customers', (req, data) => {
    var list = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list.push(data.rows[i - 1]);
    }

    res.render('customers_details', {
      title: 'THENEWUSED_customers',
      customers: list
    });
  });
});

// end of customers

app.get('/home', function (req, res) {
  res.render('home', {
    title: 'THESIS MANAGEMENT SYSTEM'
  });
});

app.get('/api/products', function (req, res) {
  client.query('SELECT * FROM Products', (req, data) => {
    console.log(data.rows);
    res.json({
      data: data.rows
    });
  });
});

app.get('/newarrival', function (req, res) {
  res.render('newarrival', {
    title: 'THENEWUSED_new arrival',
    price: '1500'

  });
});

app.get('/men', function (req, res) {
  res.render('men', {
    title: "THENEWUSED_men's collection"
  });
});

app.get('/women', function (req, res) {
  res.render('women', {
    title: "THENEWUSED_women's collection"

  });
});

app.get('/create_products', function (req, res) {
  res.render('create_products', {
    title: 'THENEWUSED_products'
  });
});

app.get('/customers', function (req, res) {
  res.render('customers', {
    title: 'THENEWUSED_customers'
  });
});

app.get('/login', function (req, res) {
  res.render('login', {
    title: 'THESIS MANAGEMENT SYSTEM'
  });
});

app.get('/signup', function (req, res) {
  res.render('signup', {
    title: 'THESIS MANAGEMENT SYSTEM'
  });
});

app.get('/orders', function (req, res) {
  client.query('SELECT * FROM orders INNER JOIN products ON orders.product_id=products.id INNER JOIN customers ON orders.customer_id=customers.id ORDER BY order_date ASC', (req, data) => {
    console.log(data.rows);
    res.render('orders', {
      title: 'THENEWUSED_orders',
      customers: data.rows
    });
  });
});

// POST ORDER
app.post('/orderform', function (req, res) {
  // var idNew = req.params.id;

  let mailOptions, transporter;
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'team2.dbms1819@gmail.com',
      pass: 'database1819'
    }
  });
  console.log(req.body);

  mailOptions = {
    from: req.body.email,
    to: 'team2.dbms1819@gmail.com', // list of receivers
    subject: 'ORDER DETAILS', // Subject line
    text: 'Order Details: \n Name:' + req.body.FN + req.body.LN + '\n Contact Number:' + req.body.contactnumber + '\n Email:' + req.body.email + '\n Product ID:' + id
  };

  console.log(mailOptions);

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      res.render('fail');
    } else {
      res.render('success');
    }

    mailOptions = {
      from: 'team2.dbms1819@gmail.com', // sender address
      to: req.body.email, // list of receivers
      subject: 'NEW ORDER', // Subject line
      text: 'Order Details: \n Name:' + req.body.FN + req.body.LN + '\n Contact Number:' + req.body.contactnumber + '\n Email:' + req.body.email + '\n Product ID:' + id

    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        res.render('fail');
      } else {
        res.render('success');
      }

      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log('Server is ready to take our messages');
        }
      });
    });
  });
});

// productupdate
app.get('/productupdate/:idNew', function (req, res) {
  const idNew = req.params.idNew;

  var list1 = [];
  var list = [];
  client.query('SELECT * FROM products where id=' + idNew + ' ', (req, data2) => {
    for (var i = 0; i < data2.rowCount; i++) {
      list1[i] = data2.rows[i];
    } list = list1;
    id = idNew;
    console.log(list[0]);
    res.render('productupdate', {
      title: 'THENEWUSED_products',
      products: list[0]
    });
  });
});
// end of products

// productupdate
app.post('/update/:idNew', function (req, res) {
  const idNew = req.params.idNew;

  client.query(`UPDATE products SET product_name='` + req.body.productname + `',price='` + req.body.price + `', warranty='` + req.body.warranty + `', product_description='` + req.body.description + `',tagline='` + req.body.tagline + `',images='` + req.body.image + `' where id='` + idNew + `' `);
  res.redirect('/products');
});
// end of products

app.get('/productupdate', function (req, res) {
  client.query('SELECT * FROM products ORDER BY id ASC', (req, data) => {
    var list = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list.push(data.rows[i - 1]);
    }

    res.render('productupdate2', {
      title: 'THENEWUSED_products',
      products: list
    });
  });
});
// dashboard top lists

var Dashboard = require('./models/dashboard');

app.get('/dashboard', function (req, res) { // product list
  var topTenCustomersWithMostOrders;
  Dashboard.topTenCustomersWithMostOrders(client, function (topTenCustomersWithMostOrders) {
    Dashboard.topTenCustomersWithHighestPayment(client, function (topTenCustomersWithHighestPayment) {
      Dashboard.topTenMostOrderedProducts(client, function (topTenMostOrderedProducts) {
        Dashboard.topTenLeastOrderedProducts(client, function (topTenLeastOrderedProducts) {
          Dashboard.topThreeMostOrderedBrands(client, function (topThreeMostOrderedBrands) {
            Dashboard.topThreeMostOrderedCategories(client, function (topThreeMostOrderedCategories) {
              Dashboard.totalSalesInTheLastSevenDays(client, function (totalSalesInTheLastSevenDays) {
    res.render('dashboard', {
                  topTenCustomersWithMostOrders: topTenCustomersWithMostOrders,
                  topTenCustomersWithHighestPayment: topTenCustomersWithHighestPayment,
                  topTenMostOrderedProducts: topTenMostOrderedProducts,
                  topTenLeastOrderedProducts: topTenLeastOrderedProducts,
                  topThreeMostOrderedBrands: topThreeMostOrderedBrands,
                  topThreeMostOrderedCategories: topThreeMostOrderedCategories,
                  totalSalesInTheLastSevenDays: totalSalesInTheLastSevenDays,

 });
              });
            });
          });
        });
      });
    });
  });
});
// end of trial
app.listen(process.env.PORT || 3000, function () {
  console.log('Server started at port 3000');
});


