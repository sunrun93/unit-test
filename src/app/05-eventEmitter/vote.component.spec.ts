import { VoteComponent } from './vote.component';

describe('voteComponent', () => {
  let component: VoteComponent;
  beforeEach(() => {
    component = new VoteComponent();
  });
  it('should trigger voteChanged with totalVotes when upVotes', () => {
    let totalVotes = null;
    component.voteChanged.subscribe(tv => totalVotes = tv);

    component.upVote();

    expect(totalVotes).toBe(1);
  });
});
