const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const hbs = require('express-handlebars');
const _handlebars = require('handlebars');

// Import function exported by newly installed node modules.
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const app = express();


app.engine('hbs', hbs.engine({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layout',
    handlebars: allowInsecurePrototypeAccess(_handlebars),
    extname: 'hbs'
  })
);
app.set('view engine', 'hbs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('63287549df809fb6551abd6e')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://shop:passshop@cluster0.zshmaxi.mongodb.net/shop?retryWrites=true&w=majority')
.then(result => {
  User.findOne().then(user => {
    if (!user) {
      const user = new User({
        name: 'Silvia',
        email: 'silvia@test.com',
        cart: {
          items: []
        }
      });
      user.save();
    }
  });
  app.listen(8000);
})
.catch(err => {
  console.log(err);
});
