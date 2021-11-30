import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/models';
import { Job } from 'src/models/job.model';
import { JobWork } from 'src/models/job.work.model';
import { AccountService } from 'src/services';
import { JobService } from 'src/services/job.service';
import { UxService } from 'src/services/ux.service';
import { JOB_LABOUR, JOB_MAKUP, JOB_MATERIAL } from 'src/shared/constants';

@Component({
  selector: 'app-job-estimate',
  templateUrl: './job-estimate.component.html',
  styleUrls: ['./job-estimate.component.scss']
})
export class JobEstimateComponent implements OnInit {
  jobId: string
  showAddMaterial: boolean;
  showAddLabour: boolean;
  newMaterial: JobWork
  materials: JobWork[];
  labourItems: JobWork[];
  job: Job;
  user: User;
  jobWork: JobWork;
  sumMaterial: number = 0;
  sumLabour: number = 0;
  showAddMarkup: boolean;
  markup: number = 0;
  estimateTotal: number = 0;
  markupTotal: number = 0;
  estimMaterialAndLabourateTotal: number = 0;
  markupItem: JobWork;
  constructor(
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private jobService: JobService,
    private router: Router,
    private uxService: UxService,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.jobId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.jobService.getjobSync(this.jobId).subscribe(data => {
      if (data && data.JobId) {
        this.job = data;
        this.newMaterial = {
          JobWorkId: '',
          JobId: this.job.JobId,
          Tittle: '',
          Category: 'Material',
          Description: '',
          TotalCost: null,
          Quantity: 1,
          Units: 'Miters',
          TotalHours: '',
          StartDate: '',
          DueDate: '',
          Status: 'To do',
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          StatusId: 1
        }
      }

      this.calculateTotal();
    });
  }
  toggleShowAddLabour() {
    this.newMaterial.Category = JOB_LABOUR;
    this.newMaterial.Units = 'Hours';
    this.newMaterial.Tittle = JOB_LABOUR;
    this.showAddLabour = true;
  }
  toggleShowAddMarkup() {
    this.newMaterial.Category = JOB_MAKUP;
    this.newMaterial.Units = 'Percentage';
    this.newMaterial.Tittle = JOB_MAKUP;
    this.showAddMarkup = true;
    if (this.markupItem) {
      this.newMaterial = this.markupItem;
    }
  }
  getJob() {
    this.jobService.getjobSync(this.jobId).subscribe(data => {
      if (data && data.JobId) {
        this.job = data;
        this.calculateTotal();
      }
    });
  }
  calculateTotal() {
    this.sumMaterial = 0;
    this.sumLabour = 0;
    this.estimateTotal = 0;
    this.estimMaterialAndLabourateTotal = 0;
    if (this.job && this.job.Tasks) {
      this.job.Tasks.forEach(task => {
        if (task.Category === JOB_MATERIAL) {
          this.sumMaterial += Number(task.Quantity) * Number(task.TotalCost);
          this.estimMaterialAndLabourateTotal += Number(task.Quantity) * Number(task.TotalCost);
        }
        if (task.Category === JOB_LABOUR) {
          this.sumLabour += Number(task.Quantity) * Number(task.TotalCost);
          this.estimMaterialAndLabourateTotal += Number(task.Quantity) * Number(task.TotalCost);
        }
        if (task.Category === JOB_MAKUP) {
          this.markup = Number(task.TotalCost);
          this.markupItem = task;
        }
      });
    }
    this.materials = this.job.Tasks && this.job.Tasks.filter(x => x.Category === JOB_MATERIAL) || [];
    this.labourItems = this.job.Tasks && this.job.Tasks.filter(x => x.Category === JOB_LABOUR) || [];
    this.markupTotal = this.estimMaterialAndLabourateTotal * (this.markup / 100);
    this.estimateTotal = this.markupTotal + this.estimMaterialAndLabourateTotal;
  }
  back() {
    this.router.navigate(['admin/dashboard/job-card', this.jobId]);
  }
  estimate() { }
  saveJobWork() {
    this.jobWork = this.newMaterial;
    if (this.jobWork && this.jobWork.JobWorkId.length > 5) {
      this.jobService.updateJobWork(this.jobWork).subscribe(data => {
        if (data && data.JobWorkId) {
          this.showAddMaterial = false;
          this.showAddLabour = false;
          this.showAddMarkup = false;
          this.calculateTotal();
        }
      });
    } else {
      this.jobService.addJobWork(this.jobWork).subscribe(data => {
        if (data && data.JobWorkId) {
          this.showAddMaterial = false
          this.showAddLabour = false;
          this.showAddMarkup = false;
          console.log(data);
          if (!this.job.Tasks) {
            this.job.Tasks = [];
          }
          this.job.Tasks.push(data);
          this.calculateTotal();
        }
      })
    }

  }
  deleteItem(item: JobWork, index: number) {
    this.jobService.deleteJobWork(item.JobWorkId).subscribe(data => {
      if (data && Number(data) === 1) {
        this.uxService.updateMessagePopState('Item deleted successfully.')
        this.getJob();
      }
    })
  }
}
