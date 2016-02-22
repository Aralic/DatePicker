var calendar = new DatePicker({
    host: '#container',
    oncheck: function(day) {
    	// 禁用周六周日
    	return day % 6 === 0;
    },
    onselected: function(date) {
    	// 选中可选日期的回调
    	console.log(date);
    }
});
