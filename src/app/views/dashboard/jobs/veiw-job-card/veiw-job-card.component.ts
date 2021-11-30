import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Order, Orderproduct, User } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { JobItem } from 'src/models/job-item.model';
import { Job } from 'src/models/job.model';
import { JobWork } from 'src/models/job.work.model';
import { AccountService, OrderService, UserService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { JobService } from 'src/services/job.service';
import { UxService } from 'src/services/ux.service';
import { CUSTOMER, JOB_LABOUR, JOB_MAKUP, JOB_MATERIAL, JOB_TYPE_INTERNAL, ORDER_TYPE_QOUTE, ORDER_TYPE_SALES } from 'src/shared/constants';

@Component({
  selector: 'app-veiw-job-card',
  templateUrl: './veiw-job-card.component.html',
  styleUrls: ['./veiw-job-card.component.scss']
})
export class VeiwJobCardComponent implements OnInit {
  job: Job;
  JobId: string;
  heading: string;
  selectedIndex: number = 1;
  selectedTab = 0;
  user: User;
  showAddCustomer: boolean;
  estimateTotal: number = 0;

  tabs = [
    {
      Id: 1,
      Name: 'Job work',
      Class: ['active']
    },
    {
      Id: 2,
      Name: 'Edit job',
      Class: []
    }
  ]
  showAddTask: boolean;
  taskName: string;
  sumMaterial: number;
  totalEstamate: number = 0;
  users: Customer[];
  markupItem: JobWork;
  markup: number = 0;
  jobOrder: Order;
  jobQoute: Order;
  jobItems: JobItem[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private jobService: JobService,
    private router: Router,
    private accountService: AccountService,
    private uxService: UxService,
    private orderService: OrderService,
    private userService: CustomerService,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.JobId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.userService.customersListObservable.subscribe(data => {
      this.users = data;
    });
    this.userService.getCustomers(this.user.CompanyId, CUSTOMER);
    if (this.JobId === 'add') {
      this.job = {
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
      this.heading = `Adding new job`;

      this.jobService.jobListObservable.subscribe(data => {
        if (data) {
          this.job.JobNo = `J00${data.length + 1}`;
        }
      });
    } else {
      this.job = this.jobService.currentjobValue;
      this.heading = `${this.job.JobNo} | ${this.job.Tittle} `;
      this.jobService.getjobSync(this.job.JobId).subscribe(job => {
        if (job) {
          this.job = job
          if (this.job.Tasks) {
            this.job.Tasks.forEach(x => {
              if (x.Status === 'Done') {
                x.IsSelected = true;
              } else {
                x.IsSelected = false;
              }
            });
            this.calculateTotal();
          }

          if (this.job.Orders) {
            this.job.Orders.forEach(order => {
              if (order.OrderType === ORDER_TYPE_SALES) {
                this.jobOrder = order;
              }
              if (order.OrderType === ORDER_TYPE_QOUTE) {
                this.jobQoute = order;
              }
            });
          }

          this.jobService.getJobItems(this.job.JobId).subscribe(data => {
            this.jobItems = data || [];
          });


        }
      })

    }


  }
  back() {
    this.router.navigate([`admin/dashboard/jobs`]);
  }
  onTabChanged(event: MatTabChangeEvent) {
    console.log(event.index);
    this.selectedIndex = event.index;
  }
  tab(item, index) {
    this.tabs.map(x => x.Class = []);
    item.Class = ['active'];
    this.selectedTab = index;
  }
  view(item) { }
  addTask() {
    this.showAddTask = true;
  }
  saveTask() {
    if (!this.job.Tasks) {
      this.job.Tasks = [];
    }
    const task = {
      JobWorkId: '',
      JobId: this.job.JobId,
      Tittle: this.taskName,
      Category: this.taskName,
      Description: '',
      TotalCost: 0,
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
    this.saveJobWork(task);
    this.taskName = undefined;
  }
  done(jobWork: JobWork) {
    jobWork.IsSelected = !jobWork.IsSelected;
    if (jobWork.IsSelected) {
      jobWork.Status = 'Done';
    } else {
      jobWork.Status = 'To do';
    }
    this.saveJobWork(jobWork);
  }
  saveJobWork(jobWork: JobWork) {

    if (jobWork && jobWork.JobWorkId.length > 5) {
      this.jobService.updateJobWork(jobWork).subscribe(data => {
        console.log(data);
        if (data && data.JobWorkId) {
          this.uxService.updateMessagePopState('Task updated successfully.')
        }
      });
    } else {
      this.jobService.addJobWork(jobWork).subscribe(data => {
        if (data && data.JobWorkId) {
          this.job.Tasks.push(data);
          this.uxService.updateMessagePopState('Task created successfully.')
        }
      })
    }

  }

  saveJob() {
    if (this.job.JobId) {
      this.jobService.update(this.job).subscribe(data => {
        this.uxService.updateMessagePopState('Job saved successfully.')
      });
    }
    else {
      this.jobService.add(this.job).subscribe(data => {
        this.job = data;
        this.job.Tasks = [];
        this.uxService.updateMessagePopState('Job created successfully.')
      });
    }

  }

  estimate() {
    if (this.job) {
      this.router.navigate(['admin/dashboard/job-estimate', this.job.JobId]);
    }
  }

  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }

  calculateTotal() {
    this.totalEstamate = 0;
    if (this.job && this.job.Tasks) {
      this.job.Tasks.forEach(task => {
        if (task.Category === JOB_MATERIAL || task.Category === JOB_LABOUR) {
          this.totalEstamate += Number(task.Quantity) * Number(task.TotalCost);
        }

        if (task.Category === JOB_MAKUP) {
          this.markup = Number(task.TotalCost);
          this.markupItem = task;
        }
      });
      this.totalEstamate = this.totalEstamate + (this.totalEstamate * (this.markup / 100));
    }
  }

  invoice() {
    const order = {
      OrdersId: '',
      OrderNo: 'Shop',
      CompanyId: this.user.CompanyId,
      CustomerId: this.job.CustomerId,
      Customer: this.job.Customer,
      AddressId: '',
      Notes: '',
      OrderType: ORDER_TYPE_SALES,
      Total: this.totalEstamate,
      Paid: 0,
      Due: this.totalEstamate,
      InvoiceDate: new Date(),
      DueDate: '',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      Status: 'Not paid',
      StatusId: 1,
      Orderproducts: [this.mapOrderproduct(this.job)]
    }
    this.orderService.updateOrderState(order);
    this.router.navigate(['admin/dashboard/create-order']);
  }
  quote() {
    const order = {
      OrdersId: '',
      OrderNo: 'Shop',
      CompanyId: this.user.CompanyId,
      CustomerId: this.job.CustomerId,
      Customer: this.job.Customer,
      AddressId: '',
      Notes: '',
      OrderType: ORDER_TYPE_QOUTE,
      Total: this.totalEstamate,
      Paid: 0,
      Due: this.totalEstamate,
      InvoiceDate: new Date(),
      DueDate: '',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      Status: 'quoted',
      StatusId: 1,
      Orderproducts: [this.mapOrderproduct(this.job)]
    }
    this.orderService.updateOrderState(order);
    this.router.navigate(['admin/dashboard/create-order']);
  }


  mapOrderproduct(job: Job): Orderproduct {
    return {
      Id: '',
      OrderId: '',
      ProductId: job.JobId,
      CompanyId: this.user.CompanyId,
      ProductName: job.Tittle,
      ProductType: 'Job',
      UnitPrice: this.totalEstamate,
      FeaturedImageUrl: '',
      Colour: '',
      Size: '',
      Quantity: 1,
      SubTotal: this.totalEstamate,
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    };
  }
  selectCust(data: Customer) {
    this.job.Customer = data;
    this.job.CustomerId = data.CustomerId;
    this.showAddCustomer = false;
    this.saveJob();
  }
  viewInvoice(order: Order) {
    if (this.job) {
      this.router.navigate(['admin/dashboard/view-invoice', this.job.JobId, order.OrderType]);
    }
  }

  addNewCustomer() {
    this.uxService.keepNavHistory({
      BackToAfterLogin: `admin/dashboard/job-card/${this.JobId}`,
      BackTo: `admin/dashboard/job-card/${this.JobId}`,
      ScrollToProduct: null
    });
    this.router.navigate(['admin/dashboard/customer/add']);

  }
}
