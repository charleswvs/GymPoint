import { parseISO } from 'date-fns';
import * as Yup from 'yup';
import { Op } from 'sequelize';

import { start } from 'repl';
import Mail from '../../lib/Mail';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll({
      where: { cancelled_at: null },
      order: ['start_date'],
      attributes: ['id', 'price', 'start_date', 'end_date'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title'],
        },
      ],
    });
    return res.json(registrations);
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
    // TODO: Verify if student has another active registration

    /**
     * Check if the students has another active registration
     */
    const exists = await Registration.findOne({
      where: {
        student_id: req.body.student_id,
        cancelled_at: null,
        end_date: { [Op.gt]: req.body.start_date },
      },
    });

    if (exists) {
      return res.status(401).json({
        error: 'Student has another active registration in this date',
      });
    }

    const { student_id, plan_id, start_date } = req.body;

    /**
     * Check if the date isnt in the past
     */

    if (new Date().getDay < (await parseISO(start).getDay)) {
      return res
        .status(401)
        .json({ error: 'Start date cannot be in the past' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(401).json({ error: 'The plan does not exists' });
    }
    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(401).json({ error: 'The student does not exists' });
    }

    const end_date = await parseISO(start_date);
    end_date.setMonth(end_date.getMonth() + plan.duration);

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price: plan.price * plan.duration,
    });

    // Basic email sending
    // TODO: Add a template to the email
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Registration created',
      text: 'Your registration to GymPoint has been sucessefully created',
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { plan_id, student_id } = req.body;
    let { start_date } = req.body;
    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ error: 'registration not found' });
    }

    /**
     * check if req body is empty, as we don't check any field
     */
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.json({ message: 'no data was altered' });
    }

    /**
     * check if student exists
     */
    let student;
    if (student_id) student = await Student.findByPk(student_id);

    if (student_id && !student) {
      return res.status(401).json({ error: 'The student does not exists' });
    }
    /**
     * Check if student has another active registration
     */

    if (student_id) {
      const exists = await Registration.findOne({
        where: {
          student_id: req.body.student_id,
          cancelled_at: null,
          end_date: { [Op.gt]: req.body.start_date },
        },
      });

      if (exists) {
        return res.status(401).json({
          error: 'Student has another active registration in this date',
        });
      }
    }

    /**
     * Check if plan exists
     */
    let plan;
    if (plan_id) plan = await Plan.findByPk(plan_id);

    if (plan_id && !plan) {
      return res.status(401).json({ error: 'The plan does not exists' });
    }

    if (!start_date) start_date = registration.start_date;
    if (!plan_id) {
      plan = await Plan.findOne({
        where: registration.plan_id,
      });
    }
    const end_date = new Date(start_date);

    end_date.setMonth(end_date.getMonth() + plan.duration);

    const price = plan.duration * plan.price;

    const registrationJson = await registration.update({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json(registrationJson);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      cancelled_at: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation failed' });
    }

    const registration = await Registration.findByPk(req.params.id);

    // TODO check if cancellation has to happen in "today"
    if (registration.end_date <= (await parseISO(req.body.cancelled_at))) {
      return res
        .status(400)
        .json({ error: 'Student has already ended his/her period' });
    }

    registration.cancelled_at = req.body.cancelled_at;
    await registration.save();

    // TODO add cancellation email
    return res.json();
  }
}

export default new RegistrationController();
