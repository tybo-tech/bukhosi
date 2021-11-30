import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/models';
import { CustomDesign } from 'src/models/customdesign.model';
import { Job } from 'src/models/job.model';
import { AccountService } from 'src/services';
import { CustomDesignService } from 'src/services/customdesign.service';
import { JobService } from 'src/services/job.service';
import { UxService } from 'src/services/ux.service';
import { JOB_TYPE_CUSTOM } from 'src/shared/constants';

@Component({
  selector: 'app-view-custom-request',
  templateUrl: './view-custom-request.component.html',
  styleUrls: ['./view-custom-request.component.scss']
})
export class ViewCustomRequestComponent implements OnInit {
  customDesign: CustomDesign;
  customDesignId: string;
  showAdd: boolean;
  newJob: Job;
  user: User;
  constructor(
    private activatedRoute: ActivatedRoute,
    private customDesignService: CustomDesignService,
    private router: Router,
    private jobService: JobService,
    private accountService: AccountService,
    private uxService: UxService,


  ) {
    this.activatedRoute.params.subscribe(r => {
      this.customDesignId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.customDesignService.getById(this.customDesignId).subscribe(data => {
      this.customDesign = data;
      this.newJob = {
        JobId: '',
        CompanyId: this.user.CompanyId,
        CustomerId: this.customDesign.CustomerId,
        CustomerName: '',
        JobNo: '',
        Tittle: this.customDesign.Description,
        JobType: JOB_TYPE_CUSTOM,
        Description: '',
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
    });


  }

  egnore() { }
  qoute() {
    this.showAdd = true;
  }
  back() {
    this.router.navigate(['admin/dashboard/pending-custom-designs']);
  }
  saveJob() {
    this.jobService.add(this.newJob).subscribe(data => {
      if (data && data.JobId) {
        this.uxService.updateMessagePopState('New bob created successfully.')
        this.gitToJobDetails(data);
      }
    });
  }

  gitToJobDetails(item: Job) {
    this.jobService.getjobSync(item.JobId).subscribe(data => {
      if (data && data.JobId) {
        this.jobService.updatejobState(data);
        this.router.navigate(['admin/dashboard/job-card', data.JobId]);
      }
    });
  }
}
