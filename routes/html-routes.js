// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  // ****************************** HTML ROUTES ********************************** //
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/home");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/signup", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/home");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // budget route loads home.html page
  app.get("/home", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/home.html"));
  });

  app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/about.html"));
  });

  app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/contact.html"));
  });

  app.get("/metrics", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/metrics.html"));
  });

  // ****************************** HANDLEBARS EXPENSE ROUTE ********************************** //
  app.get("/expenses", isAuthenticated, (req, res) => {
    db.Expense.findAll({
      where: {
        UserId: req.user.id
      }
    })
      .then(data => {
        const allExpenses = { expense: data };
        res.render("exp-index", allExpenses);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });

  // ****************************** HANDLEBARS INCOME ROUTE ********************************** //
  app.get("/incomes", (req, res) => {
    db.Income.findAll({
      where: {
        UserId: req.user.id
      }
    })
      .then(data => {
        const allIncomes = { income: data };
        res.render("inc-index", allIncomes);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });
};
