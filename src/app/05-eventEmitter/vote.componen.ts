import { EventEmitter, Output } from "@angular/core";

export class VoteComponent {
  totalVotes = 0;
  @Output() voteChanged = new EventEmitter();

  upVote() {
    this.totalVotes ++;
    this.voteChanged.emit(this.totalVotes);
  }
}

