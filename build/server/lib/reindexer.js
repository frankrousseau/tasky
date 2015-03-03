// Generated by CoffeeScript 1.9.0
var Task, async, isReindexing;

async = require('async');

Task = require('../models/tasky');

isReindexing = false;

module.exports.isReindexing = function() {
  return isReindexing;
};

module.exports.reindex = function(callback) {
  isReindexing = true;
  return Task.allInInterval({}, function(err, tasks) {
    var maxOrder, minOrder, newOrder, numTasks, returnTasks, step, task, updateActions, updateFactory, _i, _len;
    if (err != null) {
      console.log(err);
    }
    minOrder = 0;
    maxOrder = Number.MAX_VALUE;
    numTasks = tasks.length;
    step = (maxOrder - minOrder) / (numTasks + 1);
    updateFactory = function(task, order) {
      return function(callback) {
        return task.updateAttributes({
          order: order
        }, callback);
      };
    };
    returnTasks = [];
    updateActions = [];
    for (_i = 0, _len = tasks.length; _i < _len; _i++) {
      task = tasks[_i];
      newOrder = minOrder + (tasks.indexOf(task) + 1) * step;
      returnTasks.push({
        id: task.id,
        order: newOrder
      });
      updateActions.push(updateFactory(task, newOrder));
    }
    return async.parallel(updateActions, function(err) {
      var msg;
      if (err != null) {
        msg = "Something went wrong while reindexing tasks -- " + err;
        console.log(msg);
      } else {
        console.log("Tasks have been successfully reindexed");
      }
      isReindexing = false;
      return callback(err, returnTasks);
    });
  });
};
