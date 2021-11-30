import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { Interaction, InteractionSearchModel } from 'src/models/interaction.model';
import { Promotion } from 'src/models/promotion.model';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { AccountService, UserService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { HomeShopService } from 'src/services/home-shop.service';
import { InteractionService } from 'src/services/Interaction.service';
import { ProductService } from 'src/services/product.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, INTERRACTION_TYPE_LIKE, MAX_PAGE_SIZE } from 'src/shared/constants';

@Component({
  selector: 'app-shop-products',
  templateUrl: './shop-products.component.html',
  styleUrls: ['./shop-products.component.scss']
})
export class ShopProductsComponent implements OnInit {

  promotions: Promotion[];
  @Output() selectCategoryEvent: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() viewProductEvent: EventEmitter<Product> = new EventEmitter<Product>();
  shopSlug: any;
  company: Company;
  selectedCategory: Category;
  products: Product[];
  allProducts: Product[];
  user: User;
  navHistory: NavHistoryUX;
  interaction: Interaction;
  liked: string = 'no';
  showAdd: boolean;
  parentCategories: Category[] = [];
  catergories: Category[] = [];
  tertiaryCategories: Category[] = [];
  shopOwner: User;
  ADMIN = ADMIN;
  searchString: string
  nextPage = 999999;
  showShowMore: boolean;
  constructor(
    private homeShopService: HomeShopService,
    private productService: ProductService,
    private uxService: UxService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private interactionService: InteractionService,
    private accountService: AccountService,
    private userService: UserService,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.shopSlug = r.id;
      this.user = this.accountService.currentUserValue;
      this.getProducts(this.nextPage);



      this.uxService.uxNavHistoryObservable.subscribe(data => {
        this.navHistory = data;
      })

    });
  }

  ngOnInit() {


  }

  getProducts(maxId: number) {
    this.products = this.productService.getShopProductsState;
    this.allProducts = this.productService.getShopProductsState;
    this.productService.shopProductsObservable.subscribe(data => {
      if (data && data.length) {
        if (JSON.stringify(data) !== JSON.stringify(this.products)) {
          this.products = data;
          this.allProducts = data;
          this.company = this.products[0].Company;
          this.nextPage = this.products[this.products.length - 1]?.Id || 99999;
          this.promotions = this.company.Promotions || [];
          this.promotions.map(x => x.Style = { background: x.Bg, color: x.Color });

          // alert(this.company.Name);
          this.getInteractions();
          this.getShopOwner();
        } else {
          this.company = this.products[0].Company;
          this.nextPage = this.products[this.products.length - 1]?.Id || 99999;
          this.promotions = this.company.Promotions || [];
          this.promotions.map(x => x.Style = { background: x.Bg, color: x.Color });
        }
        this.showShowMore = data.length >= MAX_PAGE_SIZE;
      }
    });

    this.productService.getAllActiveProductsForCompany(this.shopSlug, maxId);

  }
  getShopOwner() {
    if (this.company) {
      this.userService.getUsersStync(this.company.CompanyId, ADMIN).subscribe(data => {
        if (data && data.length) {
          this.shopOwner = data[0];
        }
      });
    }

  }

  loadMore() {
    this.productService.getAllActiveProductsForCompanySync(this.shopSlug, this.nextPage).subscribe(data => {
      if (data && data.length) {
        this.products.push(...data);
        this.nextPage = data[data.length - 1]?.Id || 99999999;
        this.showShowMore = data.length >= MAX_PAGE_SIZE;
      }
    });

  }
  // getCompany() {
  //   this.companyService.getCompanyById(this.shopSlug).subscribe(data => {
  //     if (data && data.CompanyId) {
  //       this.company = data;

  //     }
  //   });


  // }

  viewMore(product: Product) {
    if (product) {
      this.homeShopService.updateProductState(product);
      this.uxService.keepNavHistory(null);
      this.router.navigate(['shop/product', product.ProductSlug])
    }
  }
  selectCategory(category: Category) {
    if (category && category.IsShop) {
      this.homeShopService.updateCategoryState(category);
      this.router.navigate([`shop/collections/${category.Name}`])
    }

  }
  tapChildCategory(category: Category) {
    if (category) {
      this.products = this.products = this.allProducts.filter(x => x.CompanyId === this.company.CompanyId && x.CategoryGuid === category.CategoryId);
    }

  }
  all() {
    this.products = this.products = this.allProducts.filter(x => x.CompanyId === this.company.CompanyId);

  }

  goto(url) {
    this.router.navigate([url]);
  }
  onLike(like: string) {
    if (!this.user) {
      this.uxService.keepNavHistory(
        {
          BackToAfterLogin: `/${this.company.Slug || this.company.CompanyId}`,
          BackTo: this.navHistory && this.navHistory.BackTo || null,
          ScrollToProduct: null
        }
      );
      this.showAdd = true;
      return false;
    }
    this.liked = like;
    if (like === 'yes') {
      this.interaction = {
        InteractionId: "",
        InteractionType: "Like",
        InteractionSourceId: this.user.UserId,
        InteractionTargetId: this.company.Slug,
        TraceId: '1',
        InteractionBody: "Follow",
        Color: '',
        Size: '',
        Price: 0,
        Name: this.company.Name,
        Description: this.company.Description,
        InteractionStatus: "Valid",
        ImageUrl: this.company.Dp,
        SourceType: "",
        SourceName: "",
        SourceDp: "",
        TargetType: "",
        TargetName: "",
        TargetDp: "",
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1
      }

      this.interactionService.add(this.interaction).subscribe(data => {
        console.log(data);
      })
    }

    if (like === 'no' && this.interaction.InteractionId && this.interaction.CreateDate) {
      this.interactionService.delete(this.interaction.InteractionId).subscribe(data => {
        console.log(data);
      })
    }


  }

  getInteractions() {
    if (!this.user) {
      return false;
    }
    const interactionSearchModel: InteractionSearchModel = {
      InteractionSourceId: this.user.UserId,
      InteractionTargetId: this.company.CompanyId,
      InteractionType: INTERRACTION_TYPE_LIKE,
      StatusId: 1
    }
    this.interactionService.getInteractions(interactionSearchModel).subscribe(data => {
      if (data && data.length) {
        const liked = data.find(x => x.InteractionType === 'Like');
        if (liked) {
          this.interaction = liked;
          this.liked = 'yes';
        }
      }
    })
  }

  loadCategories() {
    const catergories = [];
    // this.parentCategories = [];
    // this.tertiaryCategories = [];

    this.productService.productListObservable.subscribe(products => {
      if (products && products.length) {
        const pro: Product = products.find(x => x.Company && x.Company.Slug === this.shopSlug || x.Company && x.Company.CompanyId === this.shopSlug);
        if (pro) {
          this.company = pro.Company;
          this.promotions = this.company.Promotions || [];
          this.promotions.map(x => x.Style = { background: x.Bg, color: x.Color });

          // alert(this.company.Name);
          this.getInteractions();
          this.getShopOwner();

          this.products = products.filter(x => x.CompanyId === this.company.CompanyId);
          this.allProducts = products.filter(x => x.CompanyId === this.company.CompanyId);
          this.products.forEach(product => {
            if (!catergories.find(x => x && x.CategoryId === product.CategoryGuid)) {
              if (product.Category) {
                catergories.push(product.Category);
              }
            }
            if (!this.parentCategories.find(x => x && x.CategoryId === product.ParentCategoryGuid)) {
              if (product.ParentCategory) {
                this.parentCategories.push(product.ParentCategory);
              }
            }
            if (!this.tertiaryCategories.find(x => x && x.CategoryId === product.TertiaryCategoryGuid)) {
              if (product.TertiaryCategory) {
                this.tertiaryCategories.push(product.TertiaryCategory);
              }
            }
          });

          if (catergories && catergories.length) {
            this.catergories = catergories;
          }
        }

      }
    });


  }

  tabParentCategories(category: Category) {
    console.log(category);
    if (category) {
      this.parentCategories.map(x => x.Class = ['']);
      category.Class = ['active'];
    }
  }
  gotoDashboard() {
    this.router.navigate(['admin/dashboard'])
  }

}
