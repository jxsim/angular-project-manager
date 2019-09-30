const mongoose = require('mongoose');
const HOST = 'localhost:27017';
const DB = 'project_manager';
const DB_URL = process.env.DATABASE_URL || `mongodb://${HOST}/${DB}`;

module.exports = {
  connect: () => {
    mongoose.connect(DB_URL, {useNewUrlParser: true})
      .then(data => {
        console.log('Database connection successful');
      },err => {
        console.error('Database connection error');
      });
  }
};
