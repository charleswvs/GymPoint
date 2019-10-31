import User from '../models/User';

class SessionContoller {
  // eslint-disable-next-line class-methods-use-this
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.checkPassword(password)) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    const { id, name } = user;

    return res.json({
      id, name, email, password,
    });
  }
}

export default new SessionContoller();
