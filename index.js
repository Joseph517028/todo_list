let task_Input = document.getElementById("taskInput");
let taskSet_btn = document.getElementById("taskSet");

let taskList_ul = document.getElementById("taskList");

let tasks = [];

function loadTasks() {
  let storedTask = JSON.parse(localStorage.getItem("tasks")) || [];
  if (!storedTask.length) {
    return;
  }

  for (let i = 0; i < storedTask.length; i++) {
    createElement(
      storedTask[i].content,
      storedTask[i].updateTime.split(" ")[0],
      storedTask[i].updateTime
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});

function saveTask(task, time) {
  let storedTask = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTask.push({ content: task, updateTime: time });
  localStorage.setItem("tasks", JSON.stringify(storedTask));
}

function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

//新增按鈕監聽
taskSet_btn.addEventListener("click", () => {
  //確認任務填寫
  if (!task_Input.value) {
    alert("請輸入任務內容...");
    return;
  }

  //抓取當前時間

  let now = getFormattedDate();
  let today = now.split(" ")[0];
  let time = now;

  //資料存入localstorage
  saveTask(task_Input.value, time);

  createElement(task_Input.value, today, time);

  task_Input.value = "";
});

function createElement(task, date, time) {
  //新增li
  const li = document.createElement("li");
  li.classList.add("taskLi");

  //建立任務區
  const taskArea = document.createElement("div");
  taskArea.classList.add("task");

  //新增任務內容
  const taskContentSpan = document.createElement("span");
  taskContentSpan.classList.add("content");
  taskContentSpan.textContent = task;

  //新增任務建立日期
  const createDateSpan = document.createElement("span");
  createDateSpan.classList.add("date");
  createDateSpan.textContent = `建立日期:${date}`;

  //建立button區
  const buttonArea = document.createElement("div");

  //建立編輯button
  const editButton = document.createElement("button");
  editButton.classList.add("edit");
  editButton.textContent = "編輯";
  editButton.addEventListener("click", () => {
    const newText = prompt("修改任務內容", taskContentSpan.textContent);

    let storedTask = JSON.parse(localStorage.getItem("tasks"));

    if (newText) {
      storedTask = storedTask.map((taskObject) => {
        if (taskObject.updateTime === time) {
          taskObject.content = newText;
        }
        return taskObject;
      });

      localStorage.setItem("tasks", JSON.stringify(storedTask));

      taskContentSpan.textContent = newText;
    }
  });

  //建立刪除button
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  deleteButton.textContent = "刪除";
  deleteButton.addEventListener("click", () => {
    let storedTask = JSON.parse(localStorage.getItem("tasks"));
    storedTask = storedTask.filter((taskObject) => {
      // console.log(taskObject.updateTime + " and " + time);
      return taskObject.updateTime !== time;
    });
    localStorage.setItem("tasks", JSON.stringify(storedTask));
    li.remove();
  });

  li.appendChild(taskArea);
  taskArea.appendChild(taskContentSpan);
  taskArea.appendChild(createDateSpan);

  li.appendChild(buttonArea);
  buttonArea.appendChild(editButton);
  buttonArea.appendChild(deleteButton);

  document.getElementById("taskList").appendChild(li);
}
