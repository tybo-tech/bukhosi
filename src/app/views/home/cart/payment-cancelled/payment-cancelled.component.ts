import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/models';
import { OrderService } from 'src/services';


@Component({
  selector: 'app-payment-cancelled',
  templateUrl: './payment-cancelled.component.html',
  styleUrls: ['./payment-cancelled.component.scss']
})
export class PaymentCancelledComponent implements OnInit {
  booking: Order;
  bookingId: string;
  showDone: boolean;

  constructor(
    private bookingService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.bookingId = r.id;
    });
  }

  ngOnInit() {
    // this.bookingService.getOrder(this.bookingId).subscribe(data => {
    //   if (data && data.BookingId) {
    //     this.booking = data;
    //     this.booking.Status = 'Payment Cancelled'
    //     this.bookingService.update(this.booking).subscribe(updated => {
    //       this.booking = updated;
    //     });
    //   }
    // })
  }



  back() {
    this.router.navigate(['shop/checkout']);
  }
  bookings() {
    this.router.navigate(['home/my-bookings']);
  }


}
