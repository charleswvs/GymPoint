module.exports = {
  // Permita que alunos sejam mantidos (cadastrados/atualizados) na aplicação
  // utilizando nome, email, idade, peso e altura.
  up: (queryInterface, Sequelize) => queryInterface.createTable('students', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    weight: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    height: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('users'),
};
