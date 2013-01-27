console = console || {
    log: function (str) {
        document.body.innerHTML += "<h6>" + str + "</h6>";
    },
    info: function () {
        document.body.innerHTML += "<h6 style='color:#0FF;background-color:#ddd;'>" + str + "</h6>";
    },
    err: function () {
        document.body.innerHTML += "<h6 style='color:#F00;'>" + str + "</h6>";
    }
}

var Tools = {
    ArrayCopy: function (copyer, newer) {
        newer = newer || [];
        try {
            var Length = copyer.length;
        } catch (e) {
            console.log("error copy:" + e);
            return null;
        }
        for (var i = 0; i < Length; i++) {
            newer[i] = copyer[i];
        }
        return newer;
    },
    TimeOut: function (fn, time, objarr)//要定时运行的函数，[定时时间]，[fn（）内的参数，数组形式传递]
    {
        time = time || 0;

        setTimeout(function () {
            if (typeof objarr === "object") {
                for (var i in objarr) {
                    arguments[arguments.length] = objarr[i];
                    arguments.length++;
                }
            } else {
                arguments[0] = objarr;
                arguments.length++;
            }
            fn.apply(fn, arguments);
        }, time);
    }
};



//value||innerHTML||innerText||attrsName...
var Binder = function (data, value) {

    this.$$id = (this.$$id + 1) || 0; //绑定仓库计数器
    //console.log(this.$$id);
    var $$; //存放绑定器
    var b = function () {
        var dataType = (typeof data).toLowerCase();
        var privates, publics;
        privates = {
            _content: data,
            _type: dataType,
            _data: value || "value", //关键字，用于object默认更新的对象
            _binders: [], //存储绑定信息
            _bindersId: "|", //存储绑定着ID
            _fn_set: function () {
                privates._content.apply(publics, arguments);
            },
            _sin_set: function () {
                if (arguments.length) {
                    var c = arguments[0];
                    if ((typeof c).toLowerCase() == "string") {
                        privates._content = c;
                        var id = publics.id;
                        privates._update({ Sponsors: id, Participants: [id] });
                    } else {
                        try {
                            privates._content = c.get(true); //获取默认关键字内容
                            var id = publics.id;
                            privates._update({ Sponsors: id, Participants: [] });
                        }
                        catch (e) {
                            console.log("set error:" + e);
                        }
                    }
                }
            },
            _obj_set: function () {
                if (arguments.length) {
                    if (!arguments[1]) {//是否深赋值，默认false
                        if ((typeof arguments[0]).toLowerCase() === "object") {
                            privates._content = arguments[0];
                        } else {//如果传入非object对象，则只更新关键字
                            privates._content[privates._data] = arguments[0];
                        }
                    }
                    else {//深赋值

                    }
                }
            },
            _update: function (con) {//更新
                //con:Sponsors:int(更新发起者),Participants:[int](已参与者),argus:object(附带参数)
                var BindersID = privates._bindersId + "";
                BindersID = BindersID.substr(1, BindersID.length - 2).split('|');
                var Binders = privates._binders;
                var Length = BindersID.length;

                con.Participants[con.Participants.length] = publics.id; //将自身写入参与者id

                for (var i = 0; i < Length; ++i) {
                    var id = BindersID[i];
                    if (id === "") {
                        break;
                    }
                    var binder = allBinders[id];
                    var BindersMessage = Binders[id];
                    if (("|" + con.Participants.join('|') + "|").indexOf('|' + id + '|') === -1 || BindersMessage.forceUpdate) {
                        //不重复更新，除非配置信息为强制更新
                        var newCon = {
                            Sponsors: publics.id,
                            Participants: Tools.ArrayCopy(con.Participants),
                            argus: BindersMessage
                        }
                        Tools.TimeOut(function (B, BM, C) {
                            B.publics.set(publics.get(BM["key"])); //索取绑定关键字,默认为null
                            B.privates._update(C); //更新被更新者的绑定
                        }, newCon.argus.weights, [binder, BindersMessage, newCon]);
                    }
                }
            }
            /*privates*/
        }

        publics = {
            info: "binders", //绑定器标实
            id: this.$$id,
            init: function () {
                switch (dataType) {
                    case "string":
                        this.set = privates._sin_set;
                        break;
                    case "number":
                        this.set = privates._sin_set;
                        break;
                    case "boolean":
                        this.set = privates._sin_set;
                        break;
                    case "object":
                        this.set = privates._obj_set;
                        break;
                    case "function":
                        this.set = privates._fn_set;
                        break;

                    default:
                        this.set = privates._sin_set;
                        break;
                }
                return this;
            },
            set: privates._sin_set,
            get: function () {
                var result = privates._content;
                if (arguments.length) {
                    var con = arguments[0];
                    if (con != null) {
                        var contype = (typeof con).toLowerCase();
                        if (privates._type === "object" && (contype === "number" || contype === "string")) {//返回索取的字符
                            result = privates._content[con]
                        } else {
                            if (!con[0]) {//返回默认的关键字内容
                                result = privates._content[privates._data];
                            } else {//获取复合对象
                                try {
                                    var Length = con.length;
                                    result = {};
                                    for (var i = 0; i < Length; ++i) {
                                        result[con[i]] = privates._content[con[i]];
                                    }
                                }
                                catch (e) {
                                    console.log("get error:" + e);
                                }
                            }
                        }
                    }
                }
                return result;
            },
            binding: function (obj, key, config) {//单向绑定//绑定器对象，[绑定关键字]，[绑定·配置]
                bindkey = key || null;
                if (typeof bindkey === "object") {
                    config = key;
                    bindkey = null;
                }
                config = config || { weights: 0, forceUpdate: 0, compromise: false };
                var binderobj;
                if (!(obj.info && obj.info === "binders")) {//如果绑定对象不是绑定器
                    binderobj = Binder(obj, value);
                } else {
                    binderobj = obj;
                }
                var BindersMessage = {
                    id: binderobj.id,
                    key: bindkey,
                    weights: config["weights"] || 0, //更新的权值
                    forceUpdate: config["forceUpdate"] || false, //是否强制更新
                    compromise: config["compromise"] || false//权限相等时是否妥协更新，默认 不妥协
                }
                privates._binders[binderobj.id] = BindersMessage;
                privates._bindersId += binderobj.id + "|";
            },
            monitor: function () {//单向监听

            },
            twoway: function () {//双向绑定

            }
            /*privates*/
        }
        $$ = {//存储绑定器
            privates: privates,
            publics: publics
        }
        try//绑定仓库，用于统一管理绑定元素
		{
            //this.allBinders[this.$$id] = $$;
            allBinders[this.$$id] = $$; //私有化
        }
        catch (e) {
            allBinders = [$$];
        }
        return publics;
    };


    return b();
}


////RUN


var test = Binder("hello word");
//console.log(test.get());
//test.set("hill my love");
//console.log(test.get());
var test2 = Binder("???");
var test3 = Binder("???");
test.binding(test2);
test.set("?????");
console.log(test2.get());
//console.log(test.get());

////END_RUN