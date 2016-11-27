var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/salaries';

//POST add employee POST
router.post('/addEmployee', function(req, res) {
  var newEmployee = req.body;
  //console.log("newEmployee obj", newEmployee);
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'INSERT INTO customers (first_name, last_name, id_number, job_title, salary) ' +
      'VALUES ($1, $2, $3, $4, $5)',
      [newEmployee.firstName, newEmployee.lastName, newEmployee.idNumber, newEmployee.jobTitle, newEmployee.salary],
      function(err, result) {
        done();

        if(err) {
          console.log('insert query error: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });

  });

});
//GET employee data
router.get('/employees', function(req, res) {
  // get name days from DB
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT id, first_name, last_name,id_number, job_title, salary, active '+
    'FROM customers ORDER BY active DESC, salary DESC;', function(err, result) {
      done(); // close the connection.
      // console.log('the client!:', client);
      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      var sqlResults = result.rows
      for (var i = 0; i < sqlResults.length; i++) {
        sqlResults[i].monthly = sqlResults[i].salary/12;
      }
      
      res.send(result.rows);

    });

  });
});
//GET monthly cost data
router.get('/monthly', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT SUM(salary) ' +
                  'FROM customers '+
                  'WHERE active=true;', function(err, result) {
      done();
      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      var monthlyCost = result.rows[0].sum/12
      monthlyCostRounded = monthlyCost.toFixed(2)
      result.rows[0].sum = monthlyCostRounded
      console.log("Monthly cost", monthlyCostRounded);
      res.send(result.rows);

    });

  });
});
//POST Update to active/inactive
router.post('/updateActivity', function(req, res) {
  var updateEmployee = req.body;
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'UPDATE "public"."customers" '+
      'SET "active" = NOT "active" '+
      'WHERE "id"=$1;',
      [updateEmployee.id],
      function(err, result) {
        done();

        if(err) {
          console.log('insert query error: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });

  });

});
//DELETE line item
router.delete('/delete/:id', function(req, res) {
  lineID = req.params.id;

  console.log('lineID to delete: ', lineID);
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'DELETE FROM customers WHERE id = $1',
      [lineID],
      function(err, result) {
        done();

        if(err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    });

});


module.exports = router;
