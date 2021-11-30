import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Job } from 'src/models/job.model';
import { AccountService } from 'src/services';
import { JobService } from 'src/services/job.service';
import { UxService } from 'src/services/ux.service';
import { JOB_TYPE_INTERNAL } from 'src/shared/constants';

@Component({
  selector: 'app-job-cards',
  templateUrl: './job-cards.component.html',
  styleUrls: ['./job-cards.component.scss']
})
export class JobCardsComponent implements OnInit {
  jobCards = [];
  user: User;
  showLoader: boolean;
  newJob: Job;
  showAdd
  constructor(
    private accountService: AccountService,
    private jobService: JobService,
    private router: Router,
    private uxService: UxService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.jobService.getJobs(this.user.CompanyId);
    this.jobService.jobListObservable.subscribe(data => {
      this.jobCards = data || [];
    });

    this.newJob = {
      JobId: '',
      CompanyId: this.user.CompanyId,
      CustomerId: '',
      CustomerName: '',
      JobNo: '',
      Tittle: '',
      Description: '',
      JobType: JOB_TYPE_INTERNAL,
      TotalCost: 0,
      TotalDays: 0,
      StartDate: '',
      DueDate: '',
      Status: 'Not started',
      Class: 'not-started',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1,
      Tasks: [],
      Customer: undefined,
      Shipping: '',
      ShippingPrice: 0
    };
  }
  add() {
    this.router.navigate(['admin/dashboard/job-card/add']);
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }
  view(item: Job) {
    this.jobService.getjobSync(item.JobId).subscribe(data => {
      if (data && data.JobId) {
        this.jobService.updatejobState(data);
        this.router.navigate(['admin/dashboard/job-card', data.JobId]);
      }
    });
  }
  saveJob() {
    this.newJob.JobNo = `JOB${this.jobCards.length + 1}`;
    this.jobService.add(this.newJob).subscribe(data => {
      if (data && data.JobId) {
        // this.uxService.updateMessagePopState('Job created successfully.')
        this.view(data);
      }
    });
  }
}
