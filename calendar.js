
/**
 * 格式化时间对象
 * @param  {Object} date 时间对象
 * @param  {String} str  'YYYY-MM-SS' 'MM-SS' 'YYYY-MM'
 * @return {String}
 */
function formatDate(date, str) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    if (str === 'MM-SS') {
        return month + '-' + day;
    }
    else if (str === 'YYYY-MM') {
        return year + '-' + month;
    }
    else {
        return year + '-' + month + '-' + day;
    }
}

/**
 * 获得一个月第一天是第几天
 * @param  {Object} date 时间对象
 * @return {Number}      第几天
 */
function getMonthFirstDay(date) {
    return new Date(formatDate(date, 'YYYY-MM')+'-01').getDay();
}

/**
 * 获得一个月的天数
 * @param  {Object} date 时间对象
 * @return {Number}      总天数
 */
function getDayCount(date) {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    return new Date(year, month, 0).getDate();
}

/**
 * 获得一个月星期数
 */
function getWeekCount(date) {
    var count = getMonthFirstDay(date) + getDayCount(date);
    return Math.ceil(count / 7);
}

function DatePicker(options) {
    this.host = document.querySelector(options.host);
    this.oncheck = options.oncheck || '';
    this.init();
}

DatePicker.prototype.init = function() {
    var showDate = new Date();
    this.preComplie(showDate);
};

DatePicker.prototype.preComplie = function(showDate) {
    this.updateShowData(showDate);
    this.complie(showDate);
};

DatePicker.prototype.updateShowData = function(showDate) {
    this.showYear = showDate.getFullYear();
    this.showMonth = showDate.getMonth() + 1;
};
/**
 * 改变月份的方向
 * @param  {String} direction next下个月 prev上个月
 * @return {[type]}           [description]
 */
DatePicker.prototype.change = function(direction) {

};

DatePicker.prototype.complie = function(showDate) {

    var day = showDate.getDay();
    var dayLen = getDayCount(showDate);
    var firstDay = getMonthFirstDay(showDate);
    var title = this.showYear + '年' + this.showMonth + '月';
    // 一个月的第一天是星期几？
    var arr = [];
    var disabled = false;
    for (var i = 0; i < 42; i++) {
        if (i < firstDay || i >= (dayLen+firstDay)) {
            arr.push({
                content: '',
                disabled: true
            });
        }
        else {
            // day%7 得到当前天所属星期几 从0星期天开始
            disabled = this.oncheck(day%7);
            day++;
            arr.push({
                content: i - firstDay + 1,
                disabled: disabled
            });
        }
    }
    this.render({dataList: arr, title: title});
};

DatePicker.prototype.render = function(data) {
    var tpl = document.getElementById('tpl').innerHTML;
    var html = baidu.template(tpl, data);
    this.host.innerHTML = html;
    this.bindEvent();
};

DatePicker.prototype.bindEvent = function() {
    var _this = this;
    this.host.querySelector('.action-btn').addEventListener('click', function(e) {
        var target = e.target || e.srcElement;
        var action = target.dataset.action;
        if (target.nodeName.toLowerCase() !== 'a') return;
        if (action === 'prev') {
            _this.showMonth--;
        }
        else {
            _this.showMonth++;
        }
        _this.preComplie(new Date(_this.showYear, _this.showMonth-1));

    }, false);
};



