const _ = require("lodash");

let obj = _.pick({ name: "othman" }, ["desc", "name"]);
obj = _.assign(obj, { id: "1" });
console.log(obj);
