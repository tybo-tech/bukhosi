import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY =
    {
      publicKey: "BHZEk4ExK7fDSgBTHwnFymbxBFOn0qgRShUYEHVoEvpxC-ZKKkjYZ8ZtKqiY5y_Ei5RTTBLoc0nXIyMH2f_wIeg",
      privateKey: "SFsZkWDHVDCfpeT8ojXim0m477br-w9T0bEs0YUCsLI"
    }

  constructor(private swPush: SwPush, private swUpdate: SwUpdate) {
    this.updateClientapp();
  }
  ngOnInit(): void {
    if (environment.production) {
      if (location.protocol === 'http:') {
        window.location.href = location.href.replace('http', 'https');
      }
    }
    // this.subscribeToNotifications();
  }

  subscribeToNotifications() {

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY.publicKey
    })
      .then(sub => {
        console.log(sub);
      })
      .catch(err => console.error("Could not subscribe to notifications", err));
  }

  updateClientapp() {
    if (!this.swUpdate.isEnabled) {
      console.log('Sw updated not enabled');
      return;
    }

    this.swUpdate.available.subscribe(data => {
      console.log('New update available.', data);
      if (confirm('There is a new app update, please confirm to allow the update right now')) {
        this.swUpdate.activateUpdate().then(() => location.reload());
      }
    });


    this.swUpdate.activated.subscribe(data => {
      console.log('New update activated.', data);

    });
  }
}
