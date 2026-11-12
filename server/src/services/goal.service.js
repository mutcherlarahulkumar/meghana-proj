function createGoalService(repository) {
  const required = (goal) => {
    if (!goal) {
      const error = new Error('Goal not found');
      error.status = 404;
      throw error;
    }
    return goal;
  };
  return {
    list: () => repository.list(),
    get: async (id) => required(await repository.find(id)),
    create: (goal) => repository.create(goal),
    update: async (id, goal) => required(await repository.update(id, goal)),
    delete: async (id) => required(await repository.delete(id)),
  };
}
module.exports = { createGoalService };
