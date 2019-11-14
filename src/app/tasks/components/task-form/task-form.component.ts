import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

// @NgRx
import { Store, select } from "@ngrx/store";
import { AppState, TasksState } from "./../../../core/@ngrx";
import * as TasksActions from "./../../../core/@ngrx/tasks/tasks.actions";

// rxjs
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { TaskModel, Task } from "./../../models/task.model";

@Component({
  templateUrl: "./task-form.component.html",
  styleUrls: ["./task-form.component.css"]
})
export class TaskFormComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<void> = new Subject<void>();
  task: TaskModel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.task = new TaskModel();

    // it is not necessary to save subscription to route.paramMap
    // when router destroys this component, it handles subscriptions automatically
    let observer = {
      next: tasksState => {
        if (tasksState.selectedTask) {
          this.task = { ...tasksState.selectedTask } as TaskModel;
        } else {
          this.task = new TaskModel();
        }
      },
      error(err) {
        console.log(err);
      },
      complete() {
        console.log("Stream is completed");
      }
    };

    this.store
      .pipe(select("tasks"), takeUntil(this.componentDestroyed$))
      .subscribe(observer);

    observer = {
      ...observer,
      next: (params: ParamMap) => {
        const id = params.get("taskID");
        if (id) {
          this.store.dispatch(TasksActions.getTask({ taskID: +id }));
        }
      }
    };

    this.route.paramMap.subscribe(observer);
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  onSaveTask() {
    const task = { ...this.task } as Task;

    if (task.id) {
      this.store.dispatch(TasksActions.updateTask({ task }));
    } else {
      this.store.dispatch(TasksActions.createTask({ task }));
    }
  }

  onGoBack(): void {
    this.router.navigate(["/home"]);
  }
}
