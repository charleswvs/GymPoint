import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class StudentHelpOrderController {
  async index(req, res) {
    const helpOrder = await HelpOrder.findAll({
      where: {
        student_id: req.params.id,
      },
    });

    return res.json(helpOrder);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(401).json({ error: 'Validation failed' });
    }
    const { question } = req.body;

    const helpOrder = await HelpOrder.create({
      question,
      student_id: req.params.id,
    });

    // TODO send a notification when there is a new question

    return res.json(helpOrder);
  }
}

export default new StudentHelpOrderController();
