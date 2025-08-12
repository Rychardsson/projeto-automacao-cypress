const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');

function queryDb(query, parameters = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    
    db.all(query, parameters, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
    
    db.close();
  });
}

module.exports = { queryDb };
