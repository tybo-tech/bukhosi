import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from 'src/models';
import { Job } from 'src/models/job.model';
import { AccountService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { JobService } from 'src/services/job.service';
import { ORDER_TYPE_QOUTE, ORDER_TYPE_SALES } from 'src/shared/constants';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {
  jobId: string;
  invoiceUrl: any;
  job: Job;
  user: User;
  showLoader: boolean;
  viewInvoice = true;
  orderType: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private jobService: JobService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private accountService: AccountService,
    private companyService: CompanyService,



  ) {
    this.activatedRoute.params.subscribe(r => {
      this.jobId = r.id;
      this.orderType = r.type;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.router.navigate([''])
    }


    if (this.user && this.user.Company && this.user.Company.Background && !this.user.Company.Background.includes("#")) {

      this.user.Company.Background = this.companyService.rgb2hex(this.user.Company.Background);
    }
    if (this.user && this.user.Company && this.user.Company.Color && !this.user.Company.Color.includes("#")) {
      this.user.Company.Color = this.companyService.rgb2hex(this.user.Company.Color);
    }
    this.getJob();
  }

  getJob() {
    this.jobService.getjobSync(this.jobId).subscribe(data => {
      if (data && data.JobId) {
        this.job = data;
        const invoice = this.job.Orders && this.job.Orders.find(x => x.OrderType === ORDER_TYPE_SALES);
        const qoute = this.job.Orders && this.job.Orders.find(x => x.OrderType === ORDER_TYPE_QOUTE);
        if (invoice && this.orderType === ORDER_TYPE_SALES) {
          this.getInvoiceURL(invoice && invoice.OrdersId);
        }

        if (qoute && this.orderType === ORDER_TYPE_QOUTE) {
          this.getInvoiceURL(qoute && qoute.OrdersId);
        }
      }
    });
  }
  back() {
    this.router.navigate(['admin/dashboard/job-card', this.jobId]);
  }
  getInvoiceURL(orderId) {
    if (this.job.Orders) {
      const invoiceUrl = `${environment.API_URL}/api/docs/48f1/invoice.php?guid=${orderId}`;
      if (invoiceUrl) {
        this.invoiceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(invoiceUrl);
      }
    }
  }
  saveCompany() {
    this.showLoader = true;
    if (this.user && this.user.Company && this.user.Company.Background) {
      this.user.Company.Background = this.companyService.hexToRgbA(this.user.Company.Background);
    }
    if (this.user && this.user.Company && this.user.Company.Color) {
      this.user.Company.Color = this.companyService.hexToRgbA(this.user.Company.Color);
    }
    this.companyService.update(this.user.Company).subscribe(data => {
      if (data && data.CompanyId) {
        this.user.Company = data;
        this.accountService.updateUserState(this.user);
        if (this.user && this.user.Company && this.user.Company.Background) {
          this.user.Company.Background = this.companyService.rgb2hex(this.user.Company.Background);
        }
        if (this.user && this.user.Company && this.user.Company.Color) {
          this.user.Company.Color = this.companyService.rgb2hex(this.user.Company.Color);
        }
        // this.getInvoiceURL(this.job.Order && this.job.Order.OrdersId)


        const invoice = this.job.Orders && this.job.Orders.find(x => x.OrderType === ORDER_TYPE_SALES);
        const qoute = this.job.Orders && this.job.Orders.find(x => x.OrderType === ORDER_TYPE_QOUTE);
        if (invoice && this.orderType === ORDER_TYPE_SALES) {
          this.getInvoiceURL(invoice && invoice.OrdersId);
        }

        if (invoice && this.orderType === ORDER_TYPE_QOUTE) {
          this.getInvoiceURL(qoute && qoute.OrdersId);
        }
      }
    })
  }

}
