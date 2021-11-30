import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/models';
import { Job } from 'src/models/job.model';
import { AccountService, UserService } from 'src/services';
import { JobService } from 'src/services/job.service';


@Component({
  selector: 'app-add-job-card',
  templateUrl: './add-job-card.component.html',
  styleUrls: ['./add-job-card.component.scss']
})
export class AddJobCardComponent implements OnInit {
  @Input() job: Job;
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



  filteredStates: Observable<User[]>;
  stateCtrl = new FormControl();

  customers: User[] = [];
  constructor(
    private jobService: JobService,
    private userService: UserService,
    private accountService: AccountService,
  ) {
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.customers.slice())
      );
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.userService.userListObservable.subscribe(data => {
      this.customers = data;
    });
    this.userService.getUsers(this.user.CompanyId, 'Customer');
  }
  saveJob() {
    if (this.job.JobId) {
      this.jobService.update(this.job).subscribe(data => {
      });
    }
    else {
      this.jobService.add(this.job).subscribe(data => {
      });
    }

  }
  private _filterStates(value: string): User[] {
    const filterValue = value.toLowerCase();

    return this.customers.filter(state => state.Name.toLowerCase().indexOf(filterValue) === 0);
  }
  selectCustomer(customer: User) {
    this.job.CustomerId = customer.UserId;
    this.job.CustomerName = `${customer.Name} ${customer.Surname}`;
  }
}
