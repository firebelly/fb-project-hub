// api/models/Stage.js
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
