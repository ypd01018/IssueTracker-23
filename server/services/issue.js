/* eslint-disable no-param-reassign */
const IssueModel = require('../models/issue');

class IssueService {
  static async create(repositoryId, issueData) {
    issueData.issueNumber = (
      await IssueModel.readList(repositoryId, {})
    ).length;
    issueData.repositoryId = repositoryId;
    const newIssue = await IssueModel.create(issueData);
    await IssueModel.setLabels(newIssue.id, issueData.labels);
    await IssueModel.setAssignees(newIssue.id, issueData.assignees);
    return { id: newIssue.id };
  }

  static async readList(repositoryId, filterData) {
    const issueList = await IssueModel.readList(repositoryId, filterData);
    const issueArray = issueList.map((issue) => {
      const labelList = issue.labels.map((label) => {
        return {
          id: label.id,
          name: label.name,
          color: label.color,
        };
      });
      const assigneeList = issue.assignees.map((assignee) => {
        return {
          id: assignee.id,
          profileUrl: assignee.profileUrl,
        };
      });
      return {
        id: issue.id,
        title: issue.title,
        issueNumber: issue.issueNumber,
        author: {
          id: issue.issueAuthor.id,
          name: issue.issueAuthor.userName,
          profileUrl: issue.issueAuthor.profileUrl,
        },
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
        closedAt: issue.closedAt,
        labels: labelList,
        milestone: {
          id: issue.milestone.id,
          title: issue.milestone.title,
        },
        assignees: assigneeList,
        numberOfComments: issue.comments.length,
      };
    });
    return { repositoryId, issueList: issueArray };
  }

  static async read(issueId) {
    const issue = await IssueModel.read(issueId);
    const author = issue.issueAuthor;
    const labelList = issue.labels.map((label) => {
      return {
        id: label.id,
        name: label.name,
        color: label.color,
      };
    });
    const assigneeList = issue.assignees.map((assignee) => {
      return {
        id: assignee.id,
        userName: assignee.userName,
        profileUrl: assignee.profileUrl,
      };
    });

    return {
      title: issue.title,
      description: issue.description,
      author: {
        id: author.id,
        userName: author.userName,
        profileUrl: author.profileUrl,
      },
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      closedAt: issue.closedAt,
      issueNumber: issue.issueNumber,
      labels: labelList,
      assignees: assigneeList,
      milestoneId: issue.milestoneId,
      comments: issue.commentList,
    };
  }

  static async update(issueData) {
    const [count] = await IssueModel.update(issueData);
    if (issueData.assiginnes)
      await IssueModel.setAssignees(issueData.id, issueData.assiginnes);
    if (issueData.labels)
      await IssueModel.setLabels(issueData.id, issueData.labels);
    return count === 0 ? null : { id: issueData.id };
  }
}

module.exports = IssueService;
