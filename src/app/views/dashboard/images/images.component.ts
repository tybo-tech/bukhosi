import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UploadService } from 'src/services/upload.service';
import { Image } from 'src/models/image.model';
import { AccountService } from 'src/services';
import { User } from 'src/models';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  @Input() images: Image[] = [];
  @Input() otherId: string;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onUploadFinished: EventEmitter<Image[]> = new EventEmitter();
  @Output() updateImage: EventEmitter<Image[]> = new EventEmitter();

  progress: number;
  message: string;
  uplaodedImages: any[] = [];
  user: User;

  constructor(
    private uploadService: UploadService,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `otc.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      this.uploadService.uploadFile(formData).subscribe(url => {
        const uploadedImage = `${environment.API_URL}/api/upload/${url}`;

        this.images.push(
          {
            ImageId: undefined,
            CompanyId: this.user && this.user.CompanyId || '',
            IsMain: false,
            OtherId: this.otherId,
            Url: uploadedImage,
            CreateUserId: this.user && this.user.UserId || '',
            ModifyUserId: this.user && this.user.UserId || '',
            StatusId: 1
          }
        );
        this.onUploadFinished.emit(this.images);
      });



    });
  }
  delete(i: Image) {
    i.StatusId = 2;
    this.updateImage.emit(this.images)
  }
  main(i: Image) {
    this.images.map(x => x.IsMain = false);
    i.IsMain = true;
    this.updateImage.emit(this.images)
  }

}
