/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import { Op } from 'sequelize';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const student = await Student.findAll({
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
      order: ['name'],
    });

    return res.json(student);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      name: Yup.string().required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });
    // const { name, email, age } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const userExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      email: Yup.string(),
      name: Yup.string(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const student = await Student.findByPk(req.body.id);

    if (!student) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (
      req.body.email &&
      (await Student.findOne({
        where: {
          id: {
            [Op.not]: req.body.id,
          },
          email: req.body.email,
        },
      }))
    ) {
      return res
        .status(400)
        .json({ error: 'Email is in use by other student' });
    }

    const { id, name, email, age, weight, height } = await student.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  // async delete(req, res) {
  //   const schema = Yup.object().shape({
  //     id: Yup.number().required(),
  //   });
  //   // const { name, email, age } = req.body;

  //   if (!(await schema.isValid(req.body))) {
  //     return res.status(400).json({ error: 'Validation Failed' });
  //   }

  //   const student = Student.findByPk(req.body.id);

  //   if (!student) {
  //     return res.status(400).json({ error: 'User not found' });
  //   }

  //   Student.destroy();
  // }
  // TODO: crete list method
}

export default new StudentController();
