import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Category } from 'src/models/category.model';
import { ModalModel } from 'src/models/modal.model';
import { UploadService, CompanyCategoryService } from 'src/services';
import { IMAGE_DONE } from 'src/shared/constants';

@Component({
  selector: 'app-super-add-adit-category',
  templateUrl: './super-add-adit-category.component.html',
  styleUrls: ['./super-add-adit-category.component.scss']
})
export class SuperAddAditCategoryComponent implements OnInit {
  @Input() category: Category;
  // <app-super-add-adit-category [category]="category">
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go back to categories',
    routeTo: 'admin/dashboard/super-categories',
    img: undefined
  };
  showLoader;
  constructor(
    private uploadService: UploadService,
    private categoryService: CompanyCategoryService,
  ) { }

  ngOnInit() {
  }

  public uploadFile = (files: FileList, name) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      this.uploadService.uploadFile(formData).subscribe(url => {
        if (name === 'PC') {
          this.category.ImageUrl = `${environment.API_URL}/api/upload/${url}`;
        }
        if (name === 'Mobile') {
          this.category.PhoneBanner = `${environment.API_URL}/api/upload/${url}`;
        }
      });

    });
  }

  save() {
    if (this.category.CategoryId && this.category.CategoryId.length > 5) {
      this.categoryService.update(this.category).subscribe(data => {
        if (data && data.CategoryId) {
          this.modalModel.heading = `Success!`
          this.modalModel.img = IMAGE_DONE;
          this.modalModel.body.push('Category details saved.');
        }
      });

    }
    else {
      this.categoryService.add(this.category).subscribe(data => {
        if (data && data.CategoryId) {
          this.categoryService.update(this.category).subscribe(data => {
            this.modalModel.heading = `Success!`
            this.modalModel.img = IMAGE_DONE;
            this.modalModel.body.push('Category created.')
          });
        }
      });
    }
  }

}
