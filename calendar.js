
var slice = Array.prototype.slice;
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
    else if (str === 'YYYY-MM-SS') {
        return year + '-' + month + '-' + day;
    }
    else {
        return {
            year: year,
            month: parseInt(month, 10),
            day: parseInt(day, 10)
        }
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

/**
 * 检查是否是时间对象。如果不是则转换成时间对象
 * @param  {String|Date Object} args 
 * @return {[type]}      时间对象
 */
function transDate(args) {
    if (args && typeof args === 'string') {
        return new Date(args);
    }
    else if (args) {
        return args;
    }
    else {
        return new Date();
    } 
}


function DatePicker(options) {
    this.config = {
        weekName: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    }
    this.checkArgs(options);
    this.init();
}

DatePicker.prototype.checkArgs = function(options) {
    this.host = document.querySelector(options.host);
    this.filter = options.filter || function() {};
    this.onselected = options.onselected || function() {};
    // 星期名称
    this.weekName = options.weekName || this.config.weekName;
    // 今天是否可选
    this.isTodayValid = options.isTodayValid || true;
    // 用户选择的开始日期
    this.startDate = transDate(options.startDate);
    // 结束日期默认为空
    this.endDate = transDate(options.endDate).getTime() !== new Date().getTime() ? transDate(options.endDate) : null;

};

DatePicker.prototype.init = function() {
    var showDate = this.startDate;
    this.settingDate = showDate.getDate();
    this.preComplie(showDate);
};

DatePicker.prototype.preComplie = function(showDate) {
    this.updateShowData(showDate);
    this.complie(showDate);
};

DatePicker.prototype.updateShowData = function(showDate) {
    // 起始年月日
    this.showYear = showDate.getFullYear();
    this.showMonth = showDate.getMonth() + 1;
    this.showDate = showDate.getDate();
};
/**
 * 改变月份的方向
 * @param  {String} direction next下个月 prev上个月
 * @return {[type]}           [description]
 */
DatePicker.prototype.change = function(direction) {

};

DatePicker.prototype.complie = function(showDate) {
    // 一个月的第一天是星期几？
    var day = new Date(this.showYear, this.showMonth-1).getDay();
    var dayLen = getDayCount(showDate);
    var firstDay = getMonthFirstDay(showDate);
    var title = this.showYear + '年' + this.showMonth + '月';
    var length = Math.ceil((firstDay+dayLen)/7) * 7;
    var arr = [];
    var content = '';
    var disabled = false;
    var value = '';
    var startDate = formatDate(this.startDate);
    var endDate = this.endDate ? formatDate(this.endDate) : null;
    for (var i = 0; i < length; i++) {
        if (i < firstDay || i >= (dayLen + firstDay)) {
            content = '';
            disabled = true;
            value = '';
        }
        else {
            value = this.showYear + '-' + this.showMonth + '-' + (i - firstDay + 1);
            content = i - firstDay + 1;
            disabled = false;
            //day%7 得到当前天所属星期几 从0星期天开始
            // 当前展示年月小于起始年月
            if (startDate.year > this.showYear
                || this.showYear > endDate.year
                || (startDate.year === this.showYear && startDate.month > this.showMonth)
                || (endDate.year === this.showYear && this.showMonth > endDate.month)) {
                
                disabled = true;
                
            }
            // 当前展示日小于起始日
            else if (startDate.year === this.showYear
                && startDate.month === this.showMonth
                && (i - firstDay + 1) <= startDate.day) {
                day++;
                if (this.isTodayValid && (i - firstDay + 1) === this.settingDate) {                    
                    disabled = false;
                }
                else {
                    disabled = true;
                }
            }
            else if (endDate.year === this.showYear
                && endDate.month === this.showMonth
                && endDate.day < (i - firstDay + 1)) {
                disabled = true;
            }
            else {
                disabled = this.filter(day%7);    
                day++;
            }
        }

        arr.push({
            content: content,
            value: value,
            disabled: disabled
        });
    }

    this.render({dataList: arr, title: title, weekName: this.weekName});
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

    this.host.querySelector('.calendar table').addEventListener('click', function(e) {
        var target = e.target || e.srcElement;
        if (target.nodeName.toLowerCase() === 'table') return false;
        while(target.nodeName.toLowerCase() !== 'td') {
            target = target.parentNode;
        }
        if (slice.call(target.classList, 0).indexOf('disabled') > -1) return;
        _this.onselected(new Date(target.dataset.value));
    }, false);
};

