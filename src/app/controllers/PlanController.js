import * as Yup from 'yup';
import { Op } from 'sequelize';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      where: { deleted_at: null },
      attributes: ['id', 'title', 'duration', 'price', 'final_price'],
    });
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      return res.status(400).json({ error: 'This plan already exists' });
    }

    const { title, duration, price } = await Plan.create(req.body);

    return res.json({ title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    /**
     * Find the plan that will be updated
     */

    const plan = await Plan.findByPk(req.body.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    // TODO create a global function that finds if a Model already has a certain object stored in database

    const planExists = await Plan.findOne({
      where: {
        title: req.body.title,
        id: { [Op.not]: req.body.id },
        deleted_at: null,
      },
    });

    if (planExists) {
      return res.status(400).json({ error: 'The plan already exists' });
    }

    const { title, duration, price } = await plan.update(req.body);

    return res.json({ title, price, duration });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.body.id);

    plan.deleted_at = new Date();

    await plan.save();

    return res.json();
  }
}

export default new PlanController();
