import Student from '../models/Student';

class StudentController {
  // eslint-disable-next-line class-methods-use-this
  async store(req, res) {
    // const { name, email, age } = req.body;

    const userExists = await Student.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const {
      id, name, email, age,
    } = await Student.create(req.body);

    return res.json({
      id, name, email, age,
    });
  }
}

export default new StudentController();
