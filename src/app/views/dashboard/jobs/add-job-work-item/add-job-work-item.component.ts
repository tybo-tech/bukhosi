import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/models';
import { JobWork } from 'src/models/job.work.model';
import { UserService, AccountService } from 'src/services';
import { JobService } from 'src/services/job.service';

@Component({
  selector: 'app-add-job-work-item',
  templateUrl: './add-job-work-item.component.html',
  styleUrls: ['./add-job-work-item.component.scss']
})
export class AddJobWorkItemComponent implements OnInit {
  @Input() jobWork: JobWork;
  @Output() doneAddingJobWork: EventEmitter<JobWork> = new EventEmitter<JobWork>();
  // <app-add-job-work-item [jobWork]="jobWork" (doneAddingJobWork)="doneAddingJobWork($event)"></app-add-job-work-item>

  showLoader: boolean;
  editorStyle = {
    height: '180px',
    marginBottom: '30px',
  };
  user: User;
  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      // ['image']
    ]
  };

  constructor(
    private jobService: JobService,
    private userService: UserService,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
  }
  saveJobWork() {
    if (this.jobWork && this.jobWork.JobWorkId.length > 5) {
      this.jobService.updateJobWork(this.jobWork).subscribe(data => {
        if (data && data.JobWorkId) {
          this.doneAddingJobWork.emit(data);
        }
      });
    } else {
      this.jobService.addJobWork(this.jobWork).subscribe(data => {
        console.log(data);
        if (data && data.JobWorkId) {
          this.doneAddingJobWork.emit(data);
        }
      })
    }

  }
}
