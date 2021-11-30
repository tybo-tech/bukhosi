import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Interaction, InteractionSearchModel } from 'src/models/interaction.model';
import { AccountService } from 'src/services';
import { InteractionService } from 'src/services/Interaction.service';
import { UxService } from 'src/services/ux.service';
import { INTERRACTION_TYPE_LIKE } from 'src/shared/constants';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss']
})
export class WishListComponent implements OnInit {
  user: User;
  interactions: Interaction[] = [];
  showAdd: boolean;
  productsInteractions: Interaction[];
  shopsInteractions: Interaction[];
  tab = 1;
  constructor(
    private router: Router,
    private interactionService: InteractionService,
    private accountService: AccountService,
    private uxService: UxService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.uxService.keepNavHistory(null);

    if (this.user) {
      this.getInteractions();
    } else {
      this.uxService.keepNavHistory({
        BackToAfterLogin: '/home/wishlist',
        BackTo: '/home/wishlist',
        ScrollToProduct: null,
      });
      this.showAdd = true;
    }
  }
  back() {
    this.router.navigate(['']);
  }
  goto(url) {
    this.router.navigate(['sign-in']);
    this.router.navigate([url]);
  }

  getInteractions() {
    const interactionSearchModel: InteractionSearchModel = {
      InteractionSourceId: this.user.UserId,
      InteractionTargetId: '',
      InteractionType: INTERRACTION_TYPE_LIKE,
      StatusId: 1
    }
    this.interactionService.getInteractionsBySource(interactionSearchModel).subscribe(data => {
      if (data && data.length) {
        this.interactions = data;
        this.productsInteractions = data.filter(x => x.InteractionBody !== 'Follow');
        this.shopsInteractions = data.filter(x => x.InteractionBody === 'Follow');
      }
    });

  }
  select(interaction: Interaction) {
    this.uxService.keepNavHistory({
      BackToAfterLogin: '/home/wishlist',
      BackTo: '/home/wishlist',
      ScrollToProduct: null
    });
    this.router.navigate(['shop/product', interaction.InteractionTargetId]);
  }
}
