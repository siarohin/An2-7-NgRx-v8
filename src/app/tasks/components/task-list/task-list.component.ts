import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

// @Ngrx
import { Store, select } from "@ngrx/store";
import { AppState, TasksState } from "./../../../core/@ngrx";
import * as TasksActions from "./../../../core/@ngrx/tasks/tasks.actions";

// rxjs
import { Observable } from "rxjs";

import { TaskModel, Task } from "./../../models/task.model";

@Component({
  templateUrl: "./task-list.component.html",
  styleUrls: ["./task-list.component.css"]
})
export class TaskListComponent implements OnInit {
  tasks: Promise<Array<TaskModel>>;
  tasksState$: Observable<TasksState>;

  constructor(private router: Router, private store: Store<AppState>) {}

  ngOnInit() {
    console.log("We have a store! ", this.store);
    this.tasksState$ = this.store.pipe(select("tasks"));

    this.store.dispatch(TasksActions.getTasks());
  }

  onCreateTask() {
    const link = ["/add"];
    this.router.navigate(link);
  }

  onCompleteTask(task: TaskModel): void {
    // task is not plain object
    // taskToComplete is a plain object
    const taskToComplete: Task = { ...task, done: true };
    this.store.dispatch(TasksActions.completeTask({ task: taskToComplete }));
  }

  onEditTask(task: TaskModel): void {
    const link = ["/edit", task.id];
    this.router.navigate(link);
  }

  onDeleteTask(task: TaskModel) {
    const taskToDelete: Task = { ...task };
    this.store.dispatch(TasksActions.deleteTask({ task: taskToDelete }));
  }
}
