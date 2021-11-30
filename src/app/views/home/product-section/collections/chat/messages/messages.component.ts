import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email, User } from 'src/models';
import { Interaction, InteractionSearchModel } from 'src/models/interaction.model';
import { AccountService, EmailService, UserService } from 'src/services';
import { InteractionService } from 'src/services/Interaction.service';
import { UxService } from 'src/services/ux.service';
import { INTERRACTION_TYPE_CHAT, NOTIFY_EMAILS } from 'src/shared/constants';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  user: User;
  interactions: Interaction[] = [];
  showAdd: boolean;
  chats: Interaction[];
  selectedChats: Interaction[];
  showChats: boolean;
  message: string
  interaction: Interaction;
  targetUser: User;
  trackId: any;
  targetId: any;
  targetName = '';
  activeExistingChat: boolean;
  url: string;

  constructor(
    private router: Router,
    private interactionService: InteractionService,
    private accountService: AccountService,
    private emailService: EmailService,
    private uxService: UxService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.targetId = r.targetId;
      this.trackId = r.traceId;
      this.activeExistingChat = false;
      if (this.trackId && Number(this.trackId) > 0) {
        // this.getInteractions();
        this.activeExistingChat = true;
      };
      if (this.targetId && Number(this.trackId) == 0) {
        this.activeChat();
      };
      this.url = `home/messages/${this.trackId}/${this.targetId}`
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.uxService.keepNavHistory(null);

    if (this.user) {
      this.getInteractions();
    } else {
      this.uxService.keepNavHistory({
        BackToAfterLogin: this.url,
        BackTo: this.url,
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
      InteractionType: INTERRACTION_TYPE_CHAT,
      StatusId: 1
    }
    let chats: Interaction[] = [];
    this.interactionService.getInteractionsBySource(interactionSearchModel).subscribe(data => {
      if (data && data.length) {
        this.interactions = data;

        this.interactions.forEach(item => {
          if (!chats.find(x => x && x.TraceId === item.TraceId)) {
            chats.push(item);
          }

        });
        this.chats = chats;
        if (this.activeExistingChat && this.chats) {
          const item = this.chats.find(x => x.TraceId === this.trackId);
          this.select(item);
          // let objDiv = document.getElementById("chatBox");
          // if(objDiv){
          //   objDiv.scrollTop = objDiv.scrollHeight;
          // }
        }
      }
    });

  }
  select(interaction: Interaction) {
    if (interaction) {

      this.selectedChats = this.interactions.filter(x => x.TraceId === interaction.TraceId);
      this.showChats = true;
      this.selectedChats.sort(function (a, b) {
        var textA = new Date(a.CreateDate).toString();
        var textB = new Date(b.CreateDate).toString();;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      if (this.selectedChats.length && this.selectedChats[0].InteractionTargetId != this.user.UserId) {
        this.targetName = this.selectedChats[0].TargetName;
        this.trackId = this.selectedChats[0].TraceId;
        this.userService.getUserSync(this.selectedChats[0].InteractionTargetId).subscribe(data => {
          if (data && data.UserId) {
            this.targetUser = data;
          }
        });
      }
      if (this.selectedChats.length && this.selectedChats[0].InteractionTargetId == this.user.UserId) {
        this.targetName = this.selectedChats[0].SourceName;
        this.trackId = this.selectedChats[0].TraceId;
        this.userService.getUserSync(this.selectedChats[0].InteractionSourceId).subscribe(data => {
          if (data && data.UserId) {
            this.targetUser = data;
          }
        });
      }

    }
  }


  chat() {
    if (!this.targetUser) {
      alert('Error');
      return;
    }
    const trakId = (Date.now() / 1000 | 0) + Math.floor(Math.random() * 100)
    this.interaction = {
      InteractionId: "",
      InteractionType: INTERRACTION_TYPE_CHAT,
      InteractionSourceId: this.user.UserId,
      InteractionTargetId: this.targetUser.UserId,
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
      TargetName: this.targetUser.Name,
      TargetDp: this.targetUser.Dp,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    }
    if (this.trackId && Number(this.trackId) > 0) {
      this.interaction.TraceId = this.trackId;
    }
    this.interactionService.add(this.interaction).subscribe(data => {

      if (data && data.InteractionId) {
        this.message = '';
        this.interaction = data;
        this.interactions.push(this.interaction);
        this.selectedChats.push(this.interaction);


        this.trackId = this.interaction.TraceId;
        this.getInteractions();
      }

      const body = `${this.user.Name} sent you a message:

      ${this.interaction.InteractionBody}
      
      `;

      this.goto(`home/messages/${this.interaction.TraceId}/${this.targetUser.UserId}`)
      this.sendEmailLogToShop(body, this.targetUser.Name, this.targetUser.Email);
      this.sendEmailLogToShop(body, this.targetUser.Name, NOTIFY_EMAILS);

      this.getInteractions();
      this.sendEmailLogToShop(body, '', NOTIFY_EMAILS);
    })




  }
  sendEmailLogToShop(data, companyName: string, email: string) {
    const emailToSend: Email = {
      Email: email,
      Subject: 'New message from Bukhosi blooms.',
      Message: `${data}`,
      UserFullName: companyName,
      Link: `${environment.BASE_URL}/home/messages/${this.interaction.TraceId}/${this.targetUser.UserId}`,
      LinkLabel: 'Reply in Bukhosi blooms'
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }
  activeChat() {
    this.userService.getUserSync(this.targetId).subscribe(data => {
      if (data && data.UserId) {
        this.targetUser = data;
        this.targetName = this.targetUser.Name;
        this.selectedChats = [];
        this.showChats = true;
      }
    })
  }

}
