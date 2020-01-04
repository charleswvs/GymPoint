import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.FLOAT,
        deleted_at: Sequelize.DATE,
        final_price: {
          type: Sequelize.VIRTUAL(Sequelize.FLOAT, ['duration', 'price']),
          get() {
            return this.get('duration') * this.get('price');
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Plan;
