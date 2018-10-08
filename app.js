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
const passport = require('passport');
const Strategy = require('passport-local').Strategy;


var nodemailer = require('nodemailer');

var id;

const client = new Client({
  database: 'd62js25ar7grqq',
  user: 'berebvaoqmubrz',
  password: '2f7939304a3b781ff9b2780211b2c9a352c922f919884410ef9503a344ceaeab',
  host: 'ec2-54-225-241-25.compute-1.amazonaws.com',
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


app.use(passport.initialize());
app.use(passport.session());

// Global Vars

passport.use(new Strategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(email, password, cb) {
    admin.getByEmail(email, function(user) {
      if (!user) { return cb(null, false); }
      bcrypt.compare(password, user.password).then(function(res) {
      if (res == false) { return cb(null, false); }
      return cb(null, user);
      });

   });
}));

passport.serializeUser(function(user, cb){
  cb(null, user.id);

});

passport.deserializeUser(function(id, cb) {
  admin.getById(id, function (user) {
    cb(null, user);
  });
});
function isAdmin(req, res, next) {
   if (req.isAuthenticated()) {
      console.log(req.user);
  admin.getById(req.user.id,function(user){
    role = user.user_type;
    console.log('role:',role);
    if (role == 'admin') {
        return next();
    }
    else{
      res.send('cannot access!');
    }
  });
  }
  else{
res.redirect('/login');
  }
}
function isFaculty(req, res, next) {
   if (req.isAuthenticated()) {
  admin.getById(req.user.id,function(user){
    role = user.user_type;
    console.log('role:',role);
    if (role == 'faculty') {
        return next();
    }
    else{
      res.send('cannot access!');
    }
  });
  }
  else{
res.redirect('/login');
}
}
function isAdviser(req, res, next) {
   if (req.isAuthenticated()) {
  admin.getById(req.user.id,function(user){
    role = user.user_type;
    console.log('role:',role);
    if (role == 'admin') {
        return next();
    }
    else{
      res.send('cannot access!');
    }
  });
  }
  else{
res.redirect('/login');
}
}

function isStudent(req, res, next) {
   if (req.isAuthenticated()) {
  admin.getById(req.user.id,function(user){
    role = user.user_type;
    console.log('role:',role);
    if (role == 'student') {
        return next();
    }
    else{
      res.send('cannot access!');
    }
  });
  }
  else{
res.redirect('/login');
}
}
function isGuest(req, res, next) {
   if (req.isAuthenticated()) {
  admin.getById(req.user.id,function(user){
    role = user.user_type;
    console.log('role:',role);
    if (role == 'guest') {
        return next();
    }
    else{
      res.send('cannot access!');
    }
  });
  }
  else{
res.redirect('/login');
}
}



app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), function(req, res) {
  admin.getById(req.user.admin_check,function(user){
    role = user.user_type;
   // req.session.user = user;
   //   console.log(req.session.user);
    console.log('role:',role);
    if (role == 'admin' || 'YES') {
        res.redirect('/adminpage')
    }
    else if (role == 'student'){
        res.redirect('/students/home')
    }
    else if (role == 'faculty'){
        res.redirect('/faculty/home')
    }
     });
  });





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



app.post('/add_faculty', function (req, res) {
  var values = [];
  var faculty_name;
  faculty_name = req.body.facultyname;
  values = [req.body.facultyname, req.body.email,req.body.contactnumber,req.body.password,req.body.password2,req.body.admin];
  console.log(req.body);
  console.log(values);
  client.query('SELECT faculty_name FROM faculty', (req, data) => {
    var list;
    var exist = 0;
    for (var i = 0; i < data.rows.length; i++) {
      list = data.rows[i].facultyname;
      console.log(list);
      if (list === faculty_name) {
        exist = 1;
      }
    }
    if (exist === 1) {
      res.render('/fail', {// temporary html
      });
    } else {
      client.query('INSERT INTO faculty(faculty_name,faculty_email,contactnumber,password,password2,admin_check) VALUES($1, $2, $3, $4, $5, $6)', values, (err, data) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(data.rows[0]);
        }
      });
      res.redirect('/facultylist');
    }
  });
});



app.get('/add_students', function (req, res) {
  client.query('SELECT faculty, section FROM class', (req, data) => {
    var list4 = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list4.push(data.rows[i - 1]);
    }
  res.render('addstudent', {
    title: 'THESIS MANAGEMENT SYSTEM',
          facultylist: list4

  });
});
});

app.get('/facultylist', function (req, res) {
  client.query('SELECT faculty_name, faculty_email, contactnumber, admin_check FROM faculty', (req, data) => {
    var list4 = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list4.push(data.rows[i - 1]);
    }
    res.render('facultylist', {
    title: 'THESIS MANAGEMENT SYSTEM',
      facultylist: list4
    });
  });
});



app.post('/add_student', function (req, res) {
  var values = [];
  var student_name;
  student_name = req.body.student_name;
  values = [req.body.student_name, req.body.student_number,req.body.password,req.body.password2,req.body.faculty,req.body.section];
  console.log(req.body);
  console.log(values);
  client.query('SELECT student_name FROM students', (req, data) => {
    var list;
    var exist = 0;
    for (var i = 0; i < data.rows.length; i++) {
      list = data.rows[i].student_name;
      console.log(list);
      if (list === student_name) {
        exist = 1;
      }
    }
    if (exist === 1) {
      res.render('/fail', {// temporary html
      });
    } else {
      client.query('INSERT INTO students(student_name,student_number,password,password2,class_adviser,section) VALUES($1, $2, $3, $4,$5,$6)', values, (err, data) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(data.rows[0]);
        }
      });
      res.redirect('/studentslist');
    }
  });
});



app.get('/studentslist', function (req, res) {
  client.query('SELECT student_name,student_number FROM students', (req, data) => {
    var list4 = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list4.push(data.rows[i - 1]);
    }
    res.render('studentlist', {
    title: 'THESIS MANAGEMENT SYSTEM',
      studentlist: list4
    });
  });
});



app.get('/add_class', function (req, res) {
  client.query('SELECT faculty_name FROM faculty', (req, data) => {
    var list4 = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list4.push(data.rows[i - 1]);
    }
    res.render('addclass', {
    title: 'THESIS MANAGEMENT SYSTEM',
      facultylist: list4
    });
  });
});


app.post('/add_class', function (req, res) {
  var values = [];
  var class_name;
  class_name = req.body.classname;
  values = [req.body.classname,req.body.faculty,req.body.section];
  console.log(req.body);
  console.log(values);
  client.query('SELECT faculty FROM class', (req, data) => {
    var list;
    var exist = 0;
    for (var i = 0; i < data.rows.length; i++) {
      list = data.rows[i].faculty;
      console.log(list);
      if (list === class_name) {
        exist = 1;
      }
    }
    if (exist === 1) {
      res.render('/fail', {// temporary html
      });
    } else {
      client.query('INSERT INTO class(classname, faculty, section) VALUES($1, $2, $3)', values, (err, data) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(data.rows[0]);
        }
      });
      res.redirect('/view_class');
    }
  });
});


 var id; 
app.get('/view_class', function (req, res) {
  client.query('SELECT classname,faculty, section FROM class', (req, data) => {
    var list4 = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list4.push(data.rows[i - 1]);
    }
    res.render('classlist', {
    title: 'THESIS MANAGEMENT SYSTEM',
      classlist: list4
    });
  });
});


app.get('/view_classpage', function (req, res) {

    client.query('SELECT students.student_name, students.student_number, class.class_id, class.faculty FROM students INNER JOIN class ON students.class_adviser = class.faculty', (req, data) => {
    var list = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list.push(data.rows[i - 1]);
    }
       
    res.render('classlistpage', {
    title: 'THESIS MANAGEMENT SYSTEM',
   //   classlist: list4,
      studentlist: list
    });
  });
});




app.get('/addclass_students', function (req, res) {

  client.query('SELECT student_name,student_number FROM students  WHERE class_adviser IS NULL ', (req, data) => {
    var list1 = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list1.push(data.rows[i - 1]);
    }
    res.render('addclass_student', {
    title: 'THESIS MANAGEMENT SYSTEM',
   //   classlist: list4,
      studentlist: list1
    });
  });
});


app.get('/faculty_classlist', function (req, res) {
  client.query('SELECT classname,faculty, section FROM class', (req, data) => {
    var list4 = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list4.push(data.rows[i - 1]);
    }
    res.render('faculty_classlist', {
    title: 'THESIS MANAGEMENT SYSTEM',
      classlist: list4
    });
  });
});




app.get('/faculty_classpage', function (req, res) {

    client.query('SELECT students.student_name, students.student_number, class.class_id, class.faculty FROM students INNER JOIN class ON students.class_adviser = class.faculty', (req, data) => {
    var list = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list.push(data.rows[i - 1]);
    }
       
    res.render('faculty_classpage', {
    title: 'THESIS MANAGEMENT SYSTEM',
   //   classlist: list4,
      studentlist: list
    });
  });
});






app.listen(process.env.PORT || 3000, function () {
  console.log('Server started at port 3000');
});

