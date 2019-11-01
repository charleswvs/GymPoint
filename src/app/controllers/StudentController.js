/* eslint-disable class-methods-use-this */
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    // const { name, email, age } = req.body;

    const userExists = await Student.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const {
      id, name, email, age, weight, height,
    } = await Student.create(req.body);

    return res.json({
      id, name, email, age, weight, height,
    });
  }

  async update(req, res) {
    const student = await Student.findOne({ where: { email: req.body.email } });

    if (!student) {
      return res.status(400).json({ error: 'User not found' });
    }

    const {
      id, name, email, age, weight, height,
    } = await student.update(req.body);

    return res.json({
      id, name, email, age, weight, height,
    });
  }
  // async update(req, res){
  //   const
  // }
}

export default new StudentController();
