module.exports = (knex, User) => {
  return (param) => {
    const username = param;
    return knex("users")
      .where({ username })
      .select()
      .then((users) => {
        if (users.length) return new User(users.pop());

        throw new Error(`Error finding user ${username}`);
      });
  };
};
