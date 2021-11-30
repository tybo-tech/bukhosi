import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Order, Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { ProductService, AccountService, OrderService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { Location } from '@angular/common';
import { AfterViewInit } from '@angular/core';
import { ORDER_TYPE_SALES, TIMER_LIMIT_WAIT } from 'src/shared/constants';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, AfterViewInit {

  products: Product[];
  user: User;
  modalHeading = 'Add product';
  showModal: boolean;
  showMobileNav: boolean;
  showAddCustomer: boolean;
  product: Product;
  company: Company;
  carttItems = 0;
  catergories: Category[];
  parentCatergories: Category[] = [];
  allProducts: Product[];
  showIntro: boolean;
  order: Order;
  showMenu: any;
  leavingShowWarning: boolean;
  shopSlug: string;
  viewIndex = 6;
  selectedCategory: Category;
  tertiaryCategories: Category[];
  showNotFound: boolean;

  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private homeShopService: HomeShopService,
    private orderService: OrderService,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private uxService: UxService,


  ) {

    this.activatedRoute.params.subscribe(r => {
      this.shopSlug = r.id;
    });
  }
  ngAfterViewInit() {
    // if (this.product) {
    //   const id = setTimeout(() => {
    //     this.scrollTo(this.product.ProductSlug);
    //   }, TIMER_LIMIT_WAIT)

    // }


  }

  ngOnInit() {
    this.product = this.homeShopService.getCurrentProductValue;
    this.user = this.accountService.currentUserValue;
    this.order = this.orderService.currentOrderValue;
    // this.homeShopService.getForShopSigle(this.shopSlug).subscribe(data => {
    //   console.log('shop', data);

    // })
    // this.productService.getProductsSyncForShop(this.shopSlug).subscribe(data => {
    //   if (data) {
    //     this.company = data;
    //     this.products = this.company.Products;
    //     this.allProducts = this.company.Products;
    //     if (this.company.CompanyId === 'notfound') {
    //       this.showNotFound = true;
    //     }

    //     this.company.Products = null;
    //     if (this.company && this.company.Dp) {
    //       this.uxService.updateNavBarLogoState({ LogoUrl: this.company.Dp, Name: this.company.Name });
    //     }
    //     if (this.product) {
    //       const currentProduct = this.allProducts.find(x => x.ProductId === this.product.ProductId);
    //       if (currentProduct) {
    //         this.product = currentProduct;
    //         this.homeShopService.updateProductState(this.product)
    //       }
    //     }
    //     this.products.forEach((product, index) => {
    //       product.ClassSelector = `class-${product.ProductId}`;
    //       if (this.company && this.company.Promotions) {
    //         product.SalePrice = Number(product.RegularPrice) - (Number(product.RegularPrice) * (Number(this.company.Promotions[0].DiscountValue) / 100));
    //         console.log(product.SalePrice, product.RegularPrice);
    //         if (Number(product.SalePrice) < Number(product.RegularPrice)) {
    //           product.OnSale = true;
    //         }

    //       }
    //     })
    //     this.loadCategories(this.products);
    //     this.initScreen();
    //     this.initOrder();



    //   }
    // });

  }

  initOrder() {
    this.order = this.orderService.currentOrderValue;
    if (!this.order) {
      this.orderService.updateOrderState({
        OrdersId: '',
        OrderNo: 'Shop',
        CompanyId: this.company.CompanyId,
        Company: this.company,
        CustomerId: '',
        AddressId: '',
        Notes: '',
        OrderType: ORDER_TYPE_SALES,
        Total: 0,
        Paid: 0,
        Due: 0,
        InvoiceDate: new Date(),
        DueDate: '',
        CreateUserId: 'shop',
        ModifyUserId: 'shop',
        Status: 'Not paid',
        StatusId: 1,
        Orderproducts: []
      });
    }
  }

  initScreen() {
    window.scroll(0, 0);
    const pageMoves = this.homeShopService.getPageMovesValue;
    this.showIntro = pageMoves.ShowIntro;



    if (this.showIntro && this.product) {
      const id = setTimeout(() => {
        this.showIntro = false;
        this.scrollTo(this.product.ClassSelector);
      }, TIMER_LIMIT_WAIT * 4)

    }


    else {
      this.showIntro = false;
      const id = setTimeout(() => {
        this.scrollTo(this.product && this.product.ClassSelector);
      }, TIMER_LIMIT_WAIT)
    }
    const order = this.orderService.currentOrderValue;
    if (order) {
      this.carttItems = order.Orderproducts.length;
    }

  }
  // loadCategories(products: Product[]) {
  //   this.catergories = [];
  //   this.parentCatergories = [];
  //   this.tertiaryCategories = [];
  //   products.forEach(product => {
  //     if (!this.catergories.find(x => x && x.CategoryId === product.CategoryGuid)) {
  //       if (product.Category) {
  //         this.catergories.push(product.Category);
  //       }
  //     }
  //     if (!this.parentCatergories.find(x => x && x.CategoryId === product.ParentCategoryGuid)) {
  //       if (product.ParentCategory) {
  //         this.parentCatergories.push(product.ParentCategory);
  //       }
  //     }
  //     if (!this.tertiaryCategories.find(x => x && x.CategoryId === product.TertiaryCategoryGuid)) {
  //       if (product.TertiaryCategory) {
  //         this.tertiaryCategories.push(product.TertiaryCategory);
  //       }
  //     }
  //   });
  //   this.products.map(x => x.Category = null);
  //   this.products.map(x => x.ParentCategory = null);
  //   this.products.map(x => x.TertiaryCategory = null);

  //   if (this.catergories && this.catergories.length) {
  //     this.catergories.forEach(category => {
  //       if (category && category.CategoryId) {
  //         category.Products = this.products.filter(product => product.CategoryGuid === category.CategoryId)
  //       }
  //     });
  //   }
  //   if (this.tertiaryCategories && this.tertiaryCategories.length) {
  //     this.tertiaryCategories.forEach(category => {
  //       if (category && category.CategoryId) {
  //         category.Products = this.products.filter(product => product.TertiaryCategoryGuid === category.CategoryId)
  //       }
  //     });
  //   }
  //   if (this.parentCatergories && this.parentCatergories.length) {
  //     this.parentCatergories.forEach(parentCatergy => {
  //       if (parentCatergy) {
  //         parentCatergy.Children = this.catergories.filter(x => x.ParentId === parentCatergy.CategoryId);
  //         parentCatergy.Tertiary = this.tertiaryCategories.filter(x => x.ParentId === parentCatergy.CategoryId);
  //         parentCatergy.Children.map(x => x.IsShop = true);
  //         parentCatergy.Tertiary.map(x => x.IsShop = true);

  //         parentCatergy.Tertiary.sort(function (a, b) {
  //           var textA = a.DisplayOrder.toString();
  //           var textB = b.DisplayOrder.toString();;
  //           return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
  //         });
  //       }
  //     });
  //     const currentCategory = this.homeShopService.getCurrentParentCategoryValue || this.parentCatergories[0];
  //     this.displayProducts(currentCategory && currentCategory.CategoryId);
  //     this.homeShopService.updateCategoryListState(this.parentCatergories);

  //   }

  // }


  // displayProducts(categoryId: string) {
  //   this.selectedCategory = this.parentCatergories.find(x => x.CategoryId === categoryId);
  //   if (!this.selectedCategory) {
  //     this.selectedCategory = this.parentCatergories[0];
  //   }

  //   this.homeShopService.updateParentCategoryState(this.selectedCategory);
  // }
  view(product: Product) {
    this.productService.updateProductState(product);
    this.router.navigate(['shop/product', product.ProductSlug]);
  }
  closeModal() {
    this.order = this.orderService.currentOrderValue;
    if (this.order) {
      this.carttItems = this.order.Orderproducts && this.order.Orderproducts.length || 0;
    }
    this.showModal = false;
    this.showAddCustomer = false;
  }

  selectCategory(cat) {
    this.showMenu = false;
    if (cat === 'All') {
      this.products = this.allProducts;
      return;
    }
    this.products = this.allProducts.filter(x => x.CategoryName === cat);
  }


  cart() {
    this.showModal = true;
  }

  scrollTo(className: string) {
    const elementList = document.querySelectorAll('.' + className);
    if (elementList.length) {
      const element = elementList[0] as HTMLElement;
      element.scrollIntoView({ behavior: 'smooth' });
    }

  }

  animate(className: string) {
    let products = document.querySelectorAll('.product');
    if (products.length) {
      products.forEach(item => {
        const element = item as HTMLElement;
        element.style.opacity = ".2"
      });


    }

    const elementList = document.querySelectorAll('.' + className);
    if (elementList.length) {
      const element = elementList[0] as HTMLElement;
      element.style.opacity = "1"
      element.style.animation = "flash 4s ease-out infinite"
    }

  }



  checkout() {
    this.router.navigate(['home/checkout']);
  }

  menu() {
    this.showMenu = !this.showMenu;
  }

  login() {
    this.router.navigate(['sign-in']);
  }

  back() {
    this.router.navigate(['home/shop']);
  }

  profile() {
    this.router.navigate(['home/profile']);
  }

  navAction(e) {
    this.viewIndex = 0;
  }
  toggleMenu(e) { }
  goto(url) {
    this.toggleMenu(false);
    if (!isNaN(url)) {
      this.viewIndex = url;
      return;
    }
    this.router.navigate([`home/${url}`]);
  }
  checkoutOrShopMore(event: string) {
    if (!event) {
      return;
    }

    if (event === 'shopmore') {
      this.viewIndex = 0;
    }
    if (event === 'checkout') {
      this.viewIndex = 6;
    }
  }
}
