import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UploadService } from 'src/services/upload.service';
import { Images } from 'src/models/images.model';
import { Product, User } from 'src/models';
import { IMAGE_CROP_SIZE } from 'src/shared/constants';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  @Input() images: Images[] = [];
  @Input() otherId: string;
  @Input() optionId: any;
  @Input() product: Product;
  @Input() user: User;
  // tslint:disable-next-line: no-output-on-prefix
  // @Output() showImageEvent: EventEmitter<Images> = new EventEmitter();
  @Output() onUploadFinished: EventEmitter<Images> = new EventEmitter();
  @Output() deleteImageEvent: EventEmitter<Images> = new EventEmitter();
  @Output() setMianImageEvent: EventEmitter<Images> = new EventEmitter();
  viewImage;
  progress: number;
  message: string;
  uplaodedImages: any[] = [];
  selectImage: Images;
  imageIndex: any;

  constructor(
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    if (this.images && this.images.length) {
      if (this.images.find(x => x.IsMain === 1)) {
        this.images.find(x => x.IsMain === 1).Class = ['active'];
        this.selectImage = this.images.find(x => x.IsMain === 1);
      } else {
        this.images[0].Class = ['active'];
        this.selectImage = this.images[0];
      }
      this.images.sort(function (a, b) {
        var textA = a.IsMain.toString();
        var textB = b.IsMain.toString();;
        return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
      });
    }
  }
  showImage(image, index: number) {
    if (image) {
      image.Index = index;
      this.imageIndex = index;
      this.images.map(x => x.Class = [])
      // this.showImageEvent.emit(image);
      image.Class = ['active'];
      this.selectImage = image;
      this.viewImage = true;
    }
  }

  handleSwipe(direction) {
    if (direction === 'left') {
      if (this.product && this.images) {
        this.imageIndex++;
        if (this.imageIndex > this.images.length - 1) {
          this.imageIndex = 0;
        }
        const featuredImageUrl = this.images[this.imageIndex];
        if (featuredImageUrl) {
          this.showImage(featuredImageUrl, this.imageIndex);
        }
      }
    }
    if (direction === 'right') {
      if (this.product && this.images) {
        this.imageIndex--;
        if (this.imageIndex < 0) {
          this.imageIndex = this.images.length - 1;
        }
        const featuredImageUrl = this.images[this.imageIndex];
        if (featuredImageUrl) {
          this.showImage(featuredImageUrl, this.imageIndex);
        }
      }
    }

  }


  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.resizeImage(file);
    });
  }


  resizeImage(file) {
    if (file.type.match(/image.*/)) {
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
          let fileOfBlob = new File([resizedImage], 'iio.jpg');
          // upload
          let formData = new FormData();
          formData.append('file', fileOfBlob);
          formData.append('name', 'iio');
          this.uploadService.uploadFile(formData).subscribe(response => {
            if (response) {
              const image: Images = {
                ImageId: '',
                OtherId: this.product.ProductId,
                OptionId: this.optionId,
                Url: `${environment.API_URL}/api/upload/${response}`,
                IsMain: 0,
                CreateUserId: this.user.UserId,
                ModifyUserId: this.user.UserId,
                StatusId: 1
              };
              this.onUploadFinished.emit(image);
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

  delete() {
    if (this.selectImage) {
      this.deleteImageEvent.emit(this.selectImage);
      this.viewImage = false
    }
  }
  setmain() {
    if (this.selectImage) {
      this.setMianImageEvent.emit(this.selectImage);
      this.viewImage = false

    }
  }
}
