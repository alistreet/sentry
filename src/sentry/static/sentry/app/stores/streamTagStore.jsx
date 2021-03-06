import Reflux from "reflux";
import _ from "underscore";

import StreamTagActions from "../actions/streamTagActions";
import MemberListStore from "./memberListStore";
var StreamTagStore = Reflux.createStore({
  listenables: StreamTagActions,

  init: function() {
    this.listenTo(MemberListStore, this.onMemberListStoreChange);

    this.tags = {
      is: {
        key: 'is',
        name: 'Status',
        values: [
          'resolved',
          'unresolved',
          'muted'
        ],
        predefined: true
      },
      assigned: {
        key: 'assigned',
        name: 'Assigned To',
        values: MemberListStore.getAll().map(user => user.username),
        predefined: true
      }
    };
  },

  getTag(tagName) {
    return this.tags[tagName];
  },

  getAllTags() {
    return this.tags;
  },

  getTagKeys() {
    return Object.keys(this.tags);
  },

  getTagValues(tagKey, query) {
    return this.tags[tagKey].values || [];
  },

  onLoadTagsSuccess(data) {
    Object.assign(this.tags, _.reduce(data, (obj, tag) => {
      tag = Object.assign({
        values: []
      }, tag);

      obj[tag.key] = tag;

      return obj;
    }, {}));

    this.trigger(_.map(this.tags, (tag) => {
      return tag;
    }));
  },

  onMemberListStoreChange(members) {
    let assignedTag = this.tags.assigned;
    assignedTag.values = MemberListStore.getAll().map(user => user.email);
    this.trigger([assignedTag]);
  }
});

export default StreamTagStore;
