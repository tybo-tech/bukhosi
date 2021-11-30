import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Order, Product, User } from 'src/models';
import { ProductService, AccountService, CompanyCategoryService, OrderService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { ADMIN, SUPER } from 'src/shared/constants';

@Component({
  selector: 'app-overviewv2',
  templateUrl: './overviewv2.component.html',
  styleUrls: ['./overviewv2.component.scss']
})
export class Overviewv2Component implements OnInit {
  products: Product[];
  allProducts: Product[];
  user: User;
  showAdd:boolean;
  companyLink = '';
  ADMIN= ADMIN;
  SUPER=SUPER;
  showMenu: boolean;

  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private router: Router,
    private uxService: UxService,
    ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if(!this.user || !this.user.Company){
      this.router.navigate(['sign-in'])
    }
    this.companyLink = `${environment.BASE_URL}/${this.user.Company.Slug || this.user.Company.CompanyId}`
    this.uxService.updateLoadingState({ Loading: true, Message: 'Loading products, please wait.' })
    this.productService.getProductsSync(this.user.CompanyId).subscribe(data => {
      this.products = data;
      console.log(this.products);

      this.allProducts = data;

      this.uxService.updateLoadingState({ Loading: false, Message: undefined });
    })
    // this.loadCategories();

  }
  loadCategories() {
    throw new Error('Method not implemented.');
  }
  goto(url) {
    this.router.navigate([`admin/dashboard/${url}`]);
  }

  menu() {
    this.showMenu = !this.showMenu;
  }

  view(product: Product) {
    this.productService.updateProductState(product);
    this.router.navigate(['admin/dashboard/product', product.ProductSlug || product.ProductId]);
  }
  gotoShop(){
    this.router.navigate(['']);
  }

  copy() {

    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      nav.share({
        title: 'Hello!',
        text: 'Check out our shop.',
        url: this.companyLink,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.updateMessagePopState('Shop LinkCopied to clipboard.');
    }
  }
}
