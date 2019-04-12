const Todo = require("../models/todo");

export default {
  Query: {
    getTodos: async () => await Todo.find(),
    getTodo: async (_, { _id }) => {
      return await Todo.findOne({ _id: _id });
    }
  },
  Mutation: {
    addTodo: async (_, { userId, todo }) => {
      try {
        //Add creater to todo
        todo.creater = userId;
        // Create a new todo
        const newTodo = await Todo.create(todo);
        // Find an actual creater
        const creater = await User.findOne({ _id: userId });
        // Add a newly todo
        creater.todos.push(newTodo);
        // Save the creater
        await creater.save();
        // Return response
        return newTodo;
      } catch (e) {
        return e.message;
      }
    },
    editTodo: async (_, { _id, todo }) => {
      try {
        return await Todo.findOneAndUpdate(
          { _id: _id },
          {
            $set: {
              title: todo.title
            }
          },
          { new: true }
        );
      } catch (error) {
        return e.message;
      }
    },
    deleteTodo: async (_, { _id }) => {
      try {
        return await Todo.findOneAndUpdate(
          { _id: _id },
          {
            $set: {
              isDisabled: true
            }
          },
          { new: true }
        );
      } catch (e) {
        return e.message;
      }
    }
  }
};
