var calendar = new DatePicker({
    host: '#container',
    filter: function(day) {
    	// 禁用周六周日
    	return day % 6 === 0;
    },
    onselected: function(date) {
    	// 选中可选日期的回调
    	console.log(date);
    },
    weekName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    startDate: new Date(2016, 3, 25), //如果指定起始日期，那么表示今天，之前不可选
    endDate: '2016-6-23', // '2016-04-10' 4月10号后不可选
    isTodayValid: true, // 控制今日是否可选的配置项，一般如果系统中提供实时或者今天的日期相关功能，则设置为true，默认是false
});
