const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) { //Middleware
  const { username } = request.headers;
  const user = users.find(user => user.username === username);
  if(!user){
    return response.status(400).json({error: "User not found"});
  }

  request.user = user

  return next()
  
}

app.post('/users', (request, response) => { //Route to create users
  const { name, username } = request.body;
  
  const userAlreadyExists = users.some((user) => user.username === username)

  if(userAlreadyExists){
    return response.status(400).json({error: "User already exists"})
  }

  const user = {id: uuidv4(),
  name,
  username,
  todos: []}

  users.push(user)

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => { //Route to list todos of one user
  const { user } = request;
  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => { //Route to create todos of one user
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const todo = {id: uuidv4(),
  title,
  done: false,
  deadline: new Date(deadline),
  created_at: new Date()}

  user.todos.push(todo);
  
  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;
  
  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(404).json({"error": "todo don't exists"});
  }

  todo.title = title;
  todo.deadline = deadline;
  
  return response.status(200).json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  
  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(404).json({"error": "todo dont exists"})
  }

  todo.done = true;

  return response.status(200).json(todo)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const isTodoExists = user.todos.some((todo) => todo.id === id);

  if (!isTodoExists) {
    return response.status(404).json({
      error: 'todo not found'
    });
  }

  const users = user.todos.splice({ id }, 1);

  return response.sendStatus(204);
});

module.exports = app;