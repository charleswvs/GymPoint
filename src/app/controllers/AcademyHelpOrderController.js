import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Mail from '../../lib/Mail';

class AcademyHelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer: null,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(helpOrders);
  }

  async update(req, res) {
    const helpOrder = await HelpOrder.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!helpOrder) {
      return res
        .status(401)
        .json({ error: "This help order coudn't be found" });
    }

    const { answer } = req.body;

    const help = await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    const student = await Student.findByPk(helpOrder.student_id);

    if (!student) {
      return res.status(401).json({ error: 'The student does not exists' });
    }

    // Basic email sending
    // TODO: Add a template to the email
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Answer to your question',
      text: `Here is the answer to the question:\n
        Q: ${helpOrder.question}\n
        A: ${helpOrder.answer}
      `,
    });

    return res.json(help);
  }
}

export default new AcademyHelpOrderController();
