var app = app || {};

app.ExpenseView = Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#expense-template').html()),
	initialize: function () {
		this.listenTo(this.model, 'change:description change:amount', this.render);
	},
	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});