import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { max } from 'rxjs/operators';
import { Product, User, VariationOption } from 'src/models';
import { Promotion } from 'src/models/promotion.model';
import { IMAGE_CROP_SIZE } from 'src/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private uploadBehaviorSubject: BehaviorSubject<string>;
  public uploadObservable: Observable<string>;
  url: string;


  private stringBehaviorSubject: BehaviorSubject<string>;
  public stringObservable: Observable<string>;

  constructor(
    private http: HttpClient,
  ) {
    this.uploadBehaviorSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('upload')) || []);
    this.uploadObservable = this.uploadBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }


  uploadFile(formData): Observable<any> {
    return this.http.post<any>(`${this.url}/api/upload/upload.php`,
      formData
    );
  }

  resizeImage(file, product: Product = null, user: User = null, variationOption: VariationOption = null, promaotion: Promotion = null) {
    if (file.type.match(/image.*/) && file.type !== 'image/gif') {
      console.log('An image has been loaded');

      const reader = new FileReader();
      reader.onload = (readerEvent: any) => {
        const image = new Image();
        image.onload = (imageEvent) => {

          // Resize the image
          const canvas = document.createElement('canvas');
          const maxSize = IMAGE_CROP_SIZE;
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
          let extention = 'iio.jpg';
          if (file.type === 'image/gif') {
            extention = 'iio.gif';
          }
          let fileOfBlob = new File([resizedImage], extention);
          // upload
          let formData = new FormData();
          formData.append('file', fileOfBlob);
          formData.append('name', 'iio');
          this.uploadFile(formData).subscribe(response => {
            this.doneUplaoding(response, product, user, variationOption, promaotion);
            console.log(response);
          });

        };
        image.src = readerEvent.target.result.toString();
      };
      reader.readAsDataURL(file);
    }

    if (file.type.match(/image.*/) && file.type === 'image/gif') {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      this.uploadFile(formData).subscribe(url => {
        this.doneUplaoding(url, product, user, variationOption, promaotion);
      });
    }
  }
  doneUplaoding(response: any, product, user, variationOption, promaotion) {
    if (response) {
      if (product) {
        product.FeaturedImageUrl = `${environment.API_URL}/api/upload/${response}`;
      }
      if (user) {
        user.Dp = `${environment.API_URL}/api/upload/${response}`;
      }
      if (variationOption) {
        variationOption.ImageUrl = `${environment.API_URL}/api/upload/${response}`;
      }
      if (promaotion) {
        promaotion.ImageUrl = `${environment.API_URL}/api/upload/${response}`;
      }
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

}
