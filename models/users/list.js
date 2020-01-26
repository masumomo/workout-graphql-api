module.exports = (knex, User) => {
  return () => {
    return knex("users")
      .select()
      .then((users) => {
        return users.map((user) => new User(user));
      });
  };
};
