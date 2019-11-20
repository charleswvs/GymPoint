import { parseISO } from 'date-fns';
import Registration from '../models/Registration';
import Plan from '../models/Plan';

class RegistrationController {
  async index(req, res) {
    return res.json();
  }

  async store(req, res) {
    const { student_id, plan_id, start_date } = req.body;

    const { duration, price } = await Plan.findByPk(plan_id);

    const end_date = await parseISO(start_date);
    end_date.setMonth(end_date.getMonth() + duration);

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price: price + duration,
    });

    return res.json(registration);
  }

  async update(req, res) {
    return res.json();
  }

  async delete(req, res) {
    return res.json();
  }
}

export default new RegistrationController();
