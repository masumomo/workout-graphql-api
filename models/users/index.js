const moment = require("moment");

const User = function(dbUser) {
  this.id = dbUser.id;
  this.username = dbUser.username;
  this.createdAt = new Date(dbUser.created_at);
};

User.prototype.serialize = function() {
  return {
    id: this.id,
    username: this.username,
    createdAt: moment(this.createdAt).format("hh:mm:ss"),
  };
};

module.exports = (knex) => {
  return {
    create: require("./create")(knex, User),
    list: require("./list")(knex, User),
    get: require("./get")(knex, User),
  };
};
