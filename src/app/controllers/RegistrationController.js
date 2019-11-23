import { parseISO } from 'date-fns';
import * as Yup from 'yup';

import Mail from '../../lib/Mail';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

class RegistrationController {
  async index(req, res) {
    return res.json();
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const { duration, price } = await Plan.findByPk(plan_id);

    const { name, email } = await Student.findByPk(student_id);

    const end_date = await parseISO(start_date);
    end_date.setMonth(end_date.getMonth() + duration);

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price: price * duration,
    });

    // Basic email sending
    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Registration created',
      text: 'Your registration to GymPoint has been sucessefully created',
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
