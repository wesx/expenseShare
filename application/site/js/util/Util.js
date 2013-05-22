var app = app || {};


app.Util = {
	pad: function (str, l, pad) {
		pad = pad || ' ';
		return Array(l - str.length + 1).join(pad) + str;
	},
	formatNumber: function(nr, l) {
		return app.Util.pad(parseInt(nr, 10).toString(), l, "0");
	},
	randomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	parseMonthId: function (mid) {
		var sp;
		if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(mid)) {
			throw new TypeError('Not correctly formatted!');
		}
		sp = mid.split('-');

		return {
			year: parseInt(sp[0], 10),
			month: parseInt(sp[1], 10)
		};
	},
	randomPam: function(personCids, max, iterations) {
		var pam = {}, change, p1, p2;

		for (var i = 0; i < iterations; i++) {
			p1 = personCids[app.Util.randomInt(0, personCids.length - 1)];
			do {
				p2 = personCids[app.Util.randomInt(0, personCids.length - 1)];
			} while (p2 === p1);

			change = Math.round(max * Math.random());

			pam[p1] = (pam[p1] || 0) + change;
			pam[p2] = (pam[p2] || 0) - change;
		}

		return pam;
	}
};