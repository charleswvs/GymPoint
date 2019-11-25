import { Op } from 'sequelize';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.findAll({
      where: {
        student_id: req.params.id,
      },
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const searchDate = new Date();
    searchDate.setDate(searchDate.getDate() - 7);

    const count = await Checkin.findAndCountAll({
      where: {
        created_at: { [Op.between]: [searchDate, new Date()] },
        student_id: req.params.id,
      },
    });

    if (count.count > 5) {
      return res
        .status(400)
        .json({ error: 'Student has reached limit of checkins' });
    }

    const checkin = await Checkin.create({ student_id: req.params.id });
    return res.json(checkin);
  }
}

export default new CheckinController();
