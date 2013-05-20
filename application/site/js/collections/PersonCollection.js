var app = app || {};

app.PersonCollection = Backbone.Collection.extend({
	model: app.Person,
	url: '/api/persons',
	comparator: function (person) {
		// TODO fix handeling of umlauts
		return person.get('name').toLowerCase();
	}
});