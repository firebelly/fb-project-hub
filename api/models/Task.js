/**
 * Task.js
 *
 * Tasks in stages in projects
 */
module.exports = {
  attributes: {
    title: { type: 'string', required: true },
    position: { type: 'number' },
    due: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing when the task is due.',
      example: 1502844074211
    },
    status: { type: 'string' },
    url: { type: 'string' },
    stage: {
      model: 'Stage'
    }
  },
};
