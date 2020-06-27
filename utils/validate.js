// function takes the joi validate error and return an object of the error messages
const errorsMapsToMessages = (error) =>
  error.details.reduce(
    (acc, curr, i) => {
      acc.errors[curr.path[0]] = curr.message;
      return acc;
    },
    { errors: {} }
  );

module.exports = {
  errorsMapsToMessages,
};
