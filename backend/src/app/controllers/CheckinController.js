import { subDays } from 'date-fns';

import Student from '../models/Student';

import Checkins from '../schemas/Checkins';

class CheckinController {
  async index(req, res) {
    const { id_student } = req.params;

    const student = await Student.findByPk(id_student);

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const checkins = await Checkins.find({
      student_id: id_student,
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { id_student } = req.params;

    const student = await Student.findByPk(id_student);

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const startDate = new Date();
    const endDate = subDays(startDate, 7);

    const checkins = await Checkins.find({
      student_id: id_student,
      created_at: {
        $gte: endDate,
        $lt: startDate,
      },
    });

    if (checkins.length >= 5) {
      return res
        .status(401)
        .json({ error: 'Student have more 5 check ins in last 7 days' });
    }

    const checkin = await Checkins.create({
      student_id: id_student,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();