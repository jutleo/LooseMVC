﻿LooseMVC
========
# mvc框架实现思路 v1.0.0
========
## 运作步骤
========
1. 获取scriptTag
* 以xml解析命名空间
* 按照优先级解析自定义标签
* 获取并解析自定义标签的命名空间(默认为scriptTag的命名空间)
* 获取并解析自定义标签内的逻辑块(使用View逻辑块解析器，传入命名空间，传入待解析语句，返回String字符，按自然顺序解析，此处有Model层参与)
* 添加唯一标识id号
* 生成并缓存监听事件(命名空间解析器-监听缓存器，传入命名空间，传入运行函数，生成监听缓存)
* 生成html数据(替换所有xml命名空间关键字，View解析完毕)
* 在页面内插入html数据
* 销毁scriptTag
* 运行命名空间解析器内的监听

## MVC分工介绍
========
* View层主要实现逻辑块解析器(逻辑语法规则)与命名空间解析器(命名空间语法规则)
* Control层用于调取View解析器与Model数据进行逻辑处理，辅助View生成(视图与功能)。带有绑定器，实现View自动刷新，数据绑定，数据逻辑通讯。
* Model层用于缓存所有应用程序数据，包括页面dom，数据库的json数据，元素监听事件，子元素。json解析器

> 框架应按照分离式JavaScript编程风格实现，使得框架的松散性易于拓展第三方库。
