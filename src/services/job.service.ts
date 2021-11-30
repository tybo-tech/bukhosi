import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Job } from 'src/models/job.model';
import { JobWork } from 'src/models/job.work.model';
import { JobItem } from 'src/models/job-item.model';


@Injectable({
  providedIn: 'root'
})
export class JobService {



  private jobListBehaviorSubject: BehaviorSubject<Job[]>;
  public jobListObservable: Observable<Job[]>;

  private jobBehaviorSubject: BehaviorSubject<Job>;
  public jobObservable: Observable<Job>;
  url: string;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.jobListBehaviorSubject = new BehaviorSubject<Job[]>(JSON.parse(localStorage.getItem('jobsList')) || []);
    this.jobBehaviorSubject = new BehaviorSubject<Job>(JSON.parse(localStorage.getItem('currentjob')) || null);
    this.jobListObservable = this.jobListBehaviorSubject.asObservable();
    this.jobObservable = this.jobBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentjobValue(): Job {
    return this.jobBehaviorSubject.value;
  }

  updateJobListState(jobs: Job[]) {
    this.jobListBehaviorSubject.next(jobs);
    localStorage.setItem('jobsList', JSON.stringify(jobs));
  }
  updatejobState(job: Job) {
    this.jobBehaviorSubject.next(job);
    localStorage.setItem('currentjob', JSON.stringify(job));
  }
  add(job: Job) {
    return this.http.post<Job>(`${this.url}/api/job/add-job.php`, job);
  }
  update(job: Job) {
    return this.http.post<Job>(`${this.url}/api/job/update-job.php`, job);
  }
  getJobs(companyId: string) {
    this.http.get<Job[]>(`${this.url}/api/job/get-jobs.php?CompanyId=${companyId}`).subscribe(data => {
      this.updateJobListState(data || []);
    });
  }

  getjob(jobId: string) {
    this.http.get<Job>(`${this.url}/api/job/get-job.php?JobId=${jobId}`).subscribe(data => {
      if (data) {
        this.updatejobState(data);
      }
    });
  }


  addJobWork(job: JobWork) {
    return this.http.post<JobWork>(`${this.url}/api/job-work/add-job-work.php`, job);
  }

  addJobItem(jobItem: JobItem) {
    return this.http.post<JobItem>(`${this.url}/api/job-item/add-job-item.php`, jobItem);
  }
  updateJobItem(jobItem: JobItem) {
    return this.http.post<JobItem>(`${this.url}/api/job-item/update-job-item.php`, jobItem);
  }
  getJobItems(jobId: string) {
    return this.http.get<JobItem[]>(`${this.url}/api/job-item/get-job-items.php?JobId=${jobId}`);
  }
  deleteJobWork(JobWorkId: string) {
    return this.http.get<JobWork>(`${this.url}/api/job-work/delete-job-work.php?JobWorkId=${JobWorkId}`);
  }


  updateJobWork(job: JobWork) {
    return this.http.post<JobWork>(`${this.url}/api/job-work/update-job-work.php`, job);
  }


  getjobSync(jobId: string) {
    return this.http.get<Job>(`${this.url}/api/job/get-job.php?JobId=${jobId}`);
  }
  getJobWorksSync(jobId: string) {
    return this.http.get<Job>(`${this.url}/api/job/get-job-work.php?JobId=${jobId}`);
  }

}
