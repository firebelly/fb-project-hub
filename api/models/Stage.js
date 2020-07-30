/**
 * Stage.js
 *
 * Stages in projects that have tasks
 */
module.exports = {
  attributes: {
    title: { type: 'string', required: true },
    position: { type: 'number' },
    project: {
      model: 'Project'
    },
    tasks: {
      collection: 'Task',
      via: 'stage'
    }
  },
};
