import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Order, UserModel, User, Email } from 'src/models';
import { CustomDesign } from 'src/models/customdesign.model';
import { ModalModel } from 'src/models/modal.model';
import { AccountService, EmailService, OrderService, UploadService } from 'src/services';
import { CustomDesignService } from 'src/services/customdesign.service';
import { CUSTOMER, IMAGE_DONE } from 'src/shared/constants';

@Component({
  selector: 'app-customer-design',
  templateUrl: './customer-design.component.html',
  styleUrls: ['./customer-design.component.scss']
})
export class CustomerDesignComponent implements OnInit {

  error: string;
  Description: string;
  DueDate;
  customDesign: CustomDesign = {
    CustomDesignId: '',
    DesignerId: '',
    CustomerId: '',
    Name: '',
    Description: '',
    DueDate: '',
    Image1: '',
    Image2: '',
    Image3: '',
    Image4: '',
    TotalCost: '',
    Price: 0,
    Status: 'pending',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1,
  }
  options = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  }

  selectedSubjects: any[] = [];
  hidePassword = true;
  paymentTypes: any[] = [];
  paymentOption: string;
  showLoader: boolean;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go shopping!',
    routeTo: '',
    img: undefined
  };
  order: Order;
  model: any;
  user: User;

  constructor(
    private routeTo: Router,
    private accountService: AccountService,
    private emailService: EmailService,
    private orderService: OrderService,
    private uploadService: UploadService,
    private customDesignService: CustomDesignService,


  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.order = this.orderService.currentOrderValue;
  }

  save() {
    if (this.user) {
      this.customDesign.CustomerId = this.user.UserId;
    }
    this.customDesignService.add(this.customDesign).subscribe(data => {
      this.modalModel.routeTo = ``;
      this.modalModel.body = [`Your request was published successfully were waiting for our professionals to send you the qoutes.`];
      this.modalModel.ctaLabel = `Track request`;
      this.modalModel.heading = `Success!`
      this.modalModel.img = IMAGE_DONE
    })
  }


  sendEmail(data: UserModel | User) {
    const emailToSend: Email = {
      Email: data.Email,
      Subject: 'Welcome to  Bukhosi blooms.',
      Message: '',
      Link: this.accountService.generateAccountActivationReturnLink(data.UserToken)
    };
    this.showLoader = true;
    this.emailService.sendAccountActivationEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {
          setTimeout(() => {
            this.showLoader = false;
            this.modalModel.heading = `Success!`
            this.modalModel.img = IMAGE_DONE;
            this.modalModel.body.push('Account Registered successfully.')
            this.modalModel.body.push('PLEASE Check your email for activation.')
          }, 1000);
        }
      });
  }


  public uploadFile = (files: FileList, index = 0) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.resizeImage(file, index);
    });
  }


  resizeImage(file, index) {
    if (file.type.match(/image.*/)) {
      console.log('An image has been loaded');

      const reader = new FileReader();
      reader.onload = (readerEvent: any) => {
        const image = new Image();
        image.onload = (imageEvent) => {

          // Resize the image
          const canvas = document.createElement('canvas');
          const maxSize = 700; // TODO : pull max size from a site config
          let width = image.width;
          let height = image.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(image, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          const resizedImage = this.dataURLToBlob(dataUrl);
          let fileOfBlob = new File([resizedImage], 'iio.jpg');
          // upload
          let formData = new FormData();
          formData.append('file', fileOfBlob);
          formData.append('name', 'iio');
          this.uploadService.uploadFile(formData).subscribe(response => {
            if (response) {
              // this.onUploadFinished.emit(`${environment.API_URL}/api/upload/${response}`);
              const url = `${environment.API_URL}/api/upload/${response}`;
              if (index === 1) { this.customDesign.Image1 = url; }
              if (index === 2) { this.customDesign.Image2 = url; }
              if (index === 3) { this.customDesign.Image3 = url; }
              if (index === 4) { this.customDesign.Image4 = url; }
            }
          });

        };
        image.src = readerEvent.target.result.toString();
      };
      reader.readAsDataURL(file);
    }
  }


  dataURLToBlob(dataURL) {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      // tslint:disable-next-line: no-shadowed-variable
      const parts = dataURL.split(',');
      // tslint:disable-next-line: no-shadowed-variable
      const contentType = parts[0].split(':')[1];
      // tslint:disable-next-line: no-shadowed-variable
      const raw = parts[1];

      return new Blob([raw], { type: contentType });
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }
  back() {
    this.routeTo.navigate(['']);
  }

}
