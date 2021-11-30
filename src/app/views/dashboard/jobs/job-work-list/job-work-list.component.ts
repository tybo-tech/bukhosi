import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Job } from 'src/models/job.model';
import { JobWork } from 'src/models/job.work.model';
import { AccountService } from 'src/services';
import { JobService } from 'src/services/job.service';
import { JOB_DONE, JOB_STUCK, JOB_TODO, JOB_WORKING_ON_IT } from 'src/shared/status.const';
export interface SystemStatus {
  name: string;
  class: string;
}
@Component({
  selector: 'app-job-work-list',
  templateUrl: './job-work-list.component.html',
  styleUrls: ['./job-work-list.component.scss']
})

export class JobWorkListComponent implements OnInit {
  @Input() jobWorks: JobWork[];
  @Input() job: Job;
  jobWork: JobWork;
  showModal: boolean;
  showLoader: boolean;
  modalHeading: string;
  user: User;
  systemStatuses: SystemStatus[] = [
    { name: 'To do', class: 'to-do' },
    { name: 'Working on it', class: 'working' },
    { name: 'Done', class: 'done' },
    { name: 'Stuck', class: 'stuck' },
  ];
  total = 0;
  constructor(
    private accountService: AccountService,
    private jobService: JobService,
    private routeTo: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.calculateTotal();
  }
  view(item: JobWork) {
    this.jobWork = item;
    this.showModal = true;
    this.modalHeading = `Edit job work | ${item.Tittle}`;
  }

  calculateTotal() {
    this.total = 0;
    if (this.jobWorks) {
      this.jobWorks.forEach(item => {
        if (item.TotalCost) {
          this.total += Number(item.TotalCost) * Number(item.Quantity);
        }
      })
    }
  }
  add() {
    this.jobWork = {
      JobWorkId: '',
      JobId: this.job.JobId,
      Tittle: '',
      Category: '',
      Description: '',
      TotalCost: null,
      Quantity: 1,
      Units: 'Units',
      TotalHours: '',
      StartDate: '',
      DueDate: '',
      Status: 'To do',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    };
    this.showModal = true;
    this.modalHeading = 'Add job work item';
  }
  doneAddingJobWork(item: JobWork) {
    this.showModal = false;
    if (!this.jobWorks) {
      this.jobWorks = [];
    }
    if (this.jobWork.JobWorkId === item.JobWorkId) {
      this.jobWork = item;

    } else {
      this.jobWorks.push(item);

    }
    this.calculateTotal();
    this.jobService.getjob(this.job.JobId);
  }
  closeModal() {
    this.showModal = false;
  }
  showOptions(item: JobWork) {
    this.jobWorks.map(x => x.ShowOption = false);
    item.ShowOption = true;
  }
  hideOptions() {
    this.jobWorks.map(x => x.ShowOption = false);
  }
  selectStatus(item: SystemStatus, jobWork: JobWork) {
    jobWork.Class = item.class;
    jobWork.Status = item.name;
    this.jobService.updateJobWork(jobWork).subscribe(data => {
      if (data && data.JobWorkId) {
        this.job.Status = this.getJobProgress().Status;
        this.job.Class = this.getJobProgress().Class;
        this.jobService.update(this.job).subscribe(job => {
          console.log(job);
        });
      }
    });
    this.hideOptions();
  }

  getJobProgress() {
    if (this.jobWorks && this.jobWorks.length) {
      const jobWorks = this.jobWorks.length;
      const todo = this.jobWorks.filter(x => x.Status === JOB_TODO).length;
      const workingon = this.jobWorks.filter(x => x.Status === JOB_WORKING_ON_IT).length;
      const stuck = this.jobWorks.filter(x => x.Status === JOB_STUCK).length;
      const done = this.jobWorks.filter(x => x.Status === JOB_DONE).length;

      if (todo === jobWorks) {
        return {
          Status: 'Not Started',
          Class: 'to-do'
        };
      }

      if (done === jobWorks) {
        return {
          Status: JOB_DONE,
          Class: 'done'
        };
      }

      if (workingon > 0) {
        return {
          Status: JOB_WORKING_ON_IT,
          Class: 'working'
        };
      }
      if (stuck > 0) {
        return {
          Status: JOB_STUCK,
          Class: 'stuck'
        };
      }
      if (todo > 0 && done > 0) {
        return {
          Status: JOB_WORKING_ON_IT,
          Class: 'working'
        };
      }


    }
    return {
      Status: '',
      Class: ''
    };

  }

  back(){
    this.routeTo.navigate(['admin/dashboard/jobs']);
  }
}
