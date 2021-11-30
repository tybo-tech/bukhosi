import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { Interaction, InteractionSearchModel } from 'src/models/interaction.model';
import { AccountService, EmailService, UserService } from 'src/services';
import { InteractionService } from 'src/services/Interaction.service';
import { ADMIN, INTERRACTION_TYPE_CHAT, NOTIFY_EMAILS } from 'src/shared/constants';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() company: Company;
  user: User;
  interaction: Interaction;
  showAdd = true;
  message: string;
  trackId: any;
  chats: Interaction[];
  userId: any;
  userTo: User;
  userToId: any;
  
  constructor(
    private interactionService: InteractionService,
    private emailService: EmailService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
  ) {

    this.activatedRoute.params.subscribe(r => {
      this.trackId = r.id;
      this.userId = r.userId;
      this.userToId = r.userToId;

      if ((!isNaN(this.trackId))) {
        this.getInteractions();
        this.showAdd = true;
        alert(this.showAdd)
      };
    });
  }

  ngOnInit() {
    this.user =  this.accountService.currentUserValue;
    // if (this.company) {
    //   this.userService.getUsersStync(this.company.CompanyId, ADMIN).subscribe(data => {
    //     if (data && data.length) {
    //       this.userTo = data[0];
    //     }
    //   });
    // } else {
    //   this.userService.getUserSync(this.userToId).subscribe(data => {
    //     if (data && data.UserId) {
    //       this.userTo = data;
    //     }
    //   })
    // }


    // this.userService.getUserSync(this.userId).subscribe(data => {
    //   if (data && data.UserId) {
    //     this.user = data;
    //   } else {
    //     this.user = this.accountService.currentUserValue;
    //   }
    // })
  }

  chat() {
    if (!this.userTo) {
      alert('Error');
      return;
    }
    const trakId = (Date.now() / 1000 | 0) + Math.floor(Math.random() * 100)

    this.interaction = {
      InteractionId: "",
      InteractionType: "Chat",
      InteractionSourceId: this.user.UserId,
      InteractionTargetId: this.userTo.CompanyId,
      TraceId: `${trakId}`,
      InteractionBody: this.message,
      Color: '',
      Size: '',
      Price: 0,
      Name: '',
      Description: '',
      InteractionStatus: "Valid",
      ImageUrl: '',
      SourceType: "User",
      SourceName: this.user.Name,
      SourceDp: this.user.Dp,
      TargetType: "",
      TargetName: this.userTo.Name,
      TargetDp: this.userTo.Dp,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    }
    if (this.trackId && !isNaN(this.trackId)) {
      this.interaction.TraceId = this.trackId;
    }
    this.interactionService.add(this.interaction).subscribe(data => {

      const body = `${this.user.Name} sent you a message:

      ${this.interaction.InteractionBody}
      
      `;
      this.sendEmailLogToShop(body, this.userTo.Name, this.userTo.Email);
      this.sendEmailLogToShop(body, this.userTo.Name, NOTIFY_EMAILS);

      this.getInteractions();
      // this.sendEmailLogToShop(body, '', NOTIFY_EMAILS);
    })




  }
  sendEmailLogToShop(data, companyName: string, email: string) {
    const emailToSend: Email = {
      Email: email,
      Subject: 'New message from Bukhosi blooms.',
      Message: `${data}`,
      UserFullName: companyName,
      Link: `${environment.BASE_URL}/home/chat/${this.interaction.TraceId}/${this.userTo.UserId}/${this.user.UserId}`,
      LinkLabel: 'Reply'
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }


  getInteractions() {
    // if (!this.user) {
    //   return false;
    // }
    const interactionSearchModel: InteractionSearchModel = {
      InteractionSourceId: null,
      InteractionTargetId: null,
      StatusId: 1,
      InteractionType: INTERRACTION_TYPE_CHAT,
      TraceId: this.trackId
    }
    this.interactionService.getInteractions(interactionSearchModel).subscribe(data => {
      if (data && data.length) {
        this.chats = data;
      }
    })
  }


}
