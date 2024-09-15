// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
let nextId = JSON.parse(localStorage.getItem('nextId')); 
// nextId keeps track of which ID i am on when creating task cards

// Todo: create a function to generate a unique task id
function generateTaskId() {
      // get an id from local storage and set a temporary ID to that number. If theres nothing set the tempporary ID to 0
     let taskId = parseInt(localStorage.getItem('nextId')) || 0;
     
     //add 1 to the existing id or start at id of 1
     taskId++;
      
     localStorage.setItem('nextId', taskId);

     console.log(taskId);

     //returns a new task id
     return taskId;

}

// Todo: create a function to create a task card
function createTaskCard(task) {

      //create a div that will contain all the information of task and a give it a unique task id
      let taskCard = $('<div>')
            .addClass('card task-card draggable')
            .attr('id', task.taskId);

      // populates the div with the user content and delete button
      let cardTitle = $('<h2>')
            .addClass('card-title')
            .text(`Title: ${task.title}`);

      let taskDueDate = $('<h3>')
            .addClass('card-text')
            .text(`Due Date: ${task.dueDate}`);

      let cardDescription = $('<p>')
            .addClass('card-text')
            .text(`Description: ${task.description}`);

      let deleteButton = $('<button>')
            .addClass('btn btn-danger delete')
            .text('Delete')
            .attr('id', task.taskId);
      deleteButton.on('click', handleDeleteTask);

      // compares the current date and the task due date and assigns a class to the card to place it in the right lane
      if (task.taskStatus !== 'done') {
            let now = dayjs();
            let taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
    
            // If the task is due today, make the card yellow. If it is overdue, make it red.
            if (now.isSame(taskDueDate, 'day') || now.isBefore(taskDueDate, 'day')) {
                  taskCard.addClass('bg-warning');
            } else if (now.isAfter(taskDueDate)) {
                taskCard.addClass('bg-danger');
                deleteButton.addClass('border-light');
            }
        } 
        
        else if (task.taskStatus === 'done' ) {
            taskCard.removeClass('bg-danger bg-warning');
            taskCard.addClass('bg-success');
        }

      // appends all the properties to the task card
      taskCard.append(cardTitle, taskDueDate, cardDescription, deleteButton);
            
      // returns the task card
      return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

      $('#todo-cards').empty();
      $('#in-progress-cards').empty();
      $('#done-cards').empty();
      
      // checks and sorts each task in taskList to the right lane
      for (const task of taskList) {
            if(task.taskStatus === 'to-do') {
                  $('#todo-cards').append(createTaskCard(task));
            }
            else if(task.taskStatus === 'in-progress') {
                  $('#in-progress-cards').append(createTaskCard(task));
            }
            else if(task.taskStatus === 'done') {
                  $('#done-cards').append(createTaskCard(task));
            }
      }

      // makes the cards draggable
      $('.task-card').draggable();

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
      event.preventDefault(); 

      let titleInput = document.querySelector('#title');
      let dueDateInput = document.querySelector('#dueDate');
      let descriptionInput = document.querySelector('#description');

      // create a new task using generateTaskId function and user input
      task = {
            taskId: generateTaskId(),
            title: titleInput.value.trim(),
            dueDate: dueDateInput.value.trim(),
            description: descriptionInput.value.trim(),
            taskStatus: 'to-do',
      };

      // pushes the new task to local storage and adds it to the task list
      taskList.push(task);
      localStorage.setItem('tasks',JSON.stringify(taskList));

      console.log(task);

      // hides the modal after the user enters input and hits the submit button
      $('#formModal').modal('hide');

      // updates the visual task list on the DOM
      renderTaskList();

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

      // gets the unique id of the card where the button that was clicked
      let taskId = event.target.id;
      // $(this).attr('task-id');
      console.log('we need to delete: ' + taskId);       

      // finds the matching index in the object array and sets it to a variable called index
      let index = taskList.findIndex(task => task.taskId == taskId);

      // console.log('This is the task:' + JSON.stringify(task));
      console.log('This is the index:' + index);
      
      // takes out the object from the object array
      taskList.splice(index, 1);

      // update local storage with the latest task list
      localStorage.setItem('tasks', JSON.stringify(taskList));

      // re-render the taskList
      renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

      let taskId = ui.draggable.attr('id');
      let status = event.target.id;
      
      // Update the status of the dropped task
      let index = taskList.findIndex(task => task.taskId == taskId);
      if (index !== -1) {
          taskList[index].taskStatus = status;
          
          // Save the updated task list to localStorage
          localStorage.setItem('tasks', JSON.stringify(taskList));
          
          // Re-render the taskList
          renderTaskList();
      }

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

      renderTaskList();

      $('#taskForm').submit(handleAddTask);

      let deleteButtons = document.getElementsByClassName('btn btn-danger delete');
      // console.log(deleteButtons);
      // deleteButtons.forEach(button => {
      //       button.addEventListener('click', handleDeleteTask);
      // }); 
            for (let button of deleteButtons) {
                  button.addEventListener('click', handleDeleteTask);
            }

      $('#dueDate').datepicker();
      
      $( ".lane" ).droppable({
            drop: handleDrop,
            accept: '.task-card'
      });

})




      