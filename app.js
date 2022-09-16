const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const hbs = require('express-handlebars');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();


app.engine('hbs', hbs.engine({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layout',
    extname: 'hbs'
  })
);
app.set('view engine', 'hbs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use ((req,res,next) => {
  next();
})

app.use('/admin', adminRoutes);
 app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect( ()=> {
  app.listen(8000);
})
