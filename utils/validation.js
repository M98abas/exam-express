const must = true;
class Validate {
  constructor(parameters) {}
  static question = {
    id: { presence: must, type: "int" },
    question: { presence: must, type: "string" },
    truethAns: { presence: must, type: "string" },
    field: { presence: must, type: "string" },
  };
  static score = {
    score: { presence: must, type: "int" },
  };
  static newStudent = {
    name: { presence: must, type: "string" },
    email: { presence: must, type: "string" },
    courseId: { presence: must, type: "int" },
  };
  static course = {
    name: { presence: must, type: "string" },
    field: { presence: must, type: "string" },
    status: { presence: must, type: "string" },
  };
  static studentLogin = {
    email: { presence: must, type: "string" },
    password: { presence: must, type: "string" },
  };
  static studentRegister = {
    name: { presence: must, type: "string" },
    email: { presence: must, type: "string" },
    courseId: { presence: must, type: "integer" },
    password: { presence: must, type: "string" },
  };
  static lecture = {
    name: { presence: must, type: "string" },
    email: { presence: must, type: "string", email: must },
    password: { presence: must, type: "string" },
  };
}
module.exports = {
  Validate,
};
