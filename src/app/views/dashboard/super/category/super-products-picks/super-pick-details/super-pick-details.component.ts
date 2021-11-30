import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/models/category.model';
import { Product } from 'src/models/product.model';
import { AccountService, CompanyCategoryService, ProductService } from 'src/services';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-super-pick-details',
  templateUrl: './super-pick-details.component.html',
  styleUrls: ['./super-pick-details.component.scss']
})
export class SuperPickDetailsComponent implements OnInit {
  categoryId: string;
  category: Category;
  showAdd;
  products: Product[];
  search: string;
  constructor(
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private uxService: UxService,
  ) {

    this.activatedRoute.params.subscribe(r => {
      this.categoryId = r.id;
    });
  }

  ngOnInit() {

    // this.uxService.showLoader();
    this.loadProducts();
    this.loadCategory();
  }
  loadCategory() {
    this.uxService.showLoader();
    this.companyCategoryService.getCategory(this.categoryId).subscribe(data => {
      if (data && data.CategoryId) {
        console.log(data
        );

        this.category = data;
        this.uxService.hideLoader();
      }
    });
  }
  loadProducts() {
    this.productService.getAllProductsSync().subscribe(data => {
      this.products = data;
      this.products.map(x => x.IsSelected = x.PickId && x.PickId.length > 2);
      this.products.map(x => x.HasBeenSelected = x.PickId && x.PickId.length > 2);
      // this.uxService.hideLoader();
    })
  }
  back() {
    this.router.navigate(['admin/dashboard/super-products-picks']);
  }
  savePicks() {
    this.uxService.showLoader();
    const products = this.products.filter(x => x.IsSelected && !x.HasBeenSelected);
    if (products.length) {
      products.map(x => x.PickId = this.categoryId);
      this.productService.updateRange(products).subscribe(data => {
        console.log(data);
        this.loadCategory();
        this.uxService.hideLoader();
        this.showAdd = false;
      })
    }

  }
  select(item) { }
  delete(product: Product) {
   if(product && confirm('This item will be removed from picks.')){
    product.PickId = null;
    this.productService.update(product).subscribe(data => {
      this.loadCategory();
    })
   }
  }
  addNewpick() {
    this.showAdd = true;
  }
}

