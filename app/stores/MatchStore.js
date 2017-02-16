import {observable, action, transaction} from 'mobx'
import {PersonStore} from './PersonStore'
import {MessageStore} from './MessageStore'
import last from 'lodash/last'

export class MatchStore {
	@observable _id;
	@observable createdDate;
	@observable lastActivityDate;
	@observable person;
	messages = observable.shallowArray([]);

	constructor(match) {
		this.init({
			_id: match._id,
			lastActivityDate: match.lastActivityDate,
			person: new PersonStore(match.person)
		});
		this.setMessages(match.messages);
	}

	@action init = (matchData) => {
		Object.assign(this, matchData);
	};

	@action setPerson = (person) => {
		this.person = new PersonStore(person);
	};

	@action setMessages = (messages) => {
		messages.forEach(message => {
			this.messages.push(new MessageStore(message));
		});
	};

	@action updateMatch = (match) => {
		this.init({
			lastActivityDate: match.lastActivityDate
		});
		this.setMessages(match.messages);
	};
}