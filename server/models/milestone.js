const { Op } = require('sequelize');
const db = require('../db/models').milestone;
const model = require('../db/models');

class MilestoneModel {
  static create(milestoneData) {
    return db.create(milestoneData);
  }

  static async readAll(repositoryId) {
    const query = `SELECT A.id,A.title,A.description,A.due_date,A.closed_at,A.created_at,A.updated_at,COUNT(B.id) AS nTotal,COUNT(B.closed_at) AS nClose
    FROM milestone A 
    LEFT join issue B
    ON A.id = B.milestone_id
    WHERE A.repository_id = :repository_id
    GROUP by A.id`;

    return model.sequelize.query(query, {
      replacements: { repository_id: repositoryId },
    });
  }

  static findByTitle(title, repositoryId, milestoneId) {
    return db.findOne({
      where: {
        title,
        repositoryId,
        id: {
          [Op.not]: milestoneId,
        },
      },
    });
  }

  static update(milestoneData, milestoneId) {
    return db.update(milestoneData, {
      where: {
        id: milestoneId,
      },
    });
  }

  static delete(milestoneId) {
    return db.destroy({
      where: {
        id: milestoneId,
      },
    });
  }
}

module.exports = MilestoneModel;
