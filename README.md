# dwz-server
提供一个短链接服务


## config目录下配置数据库，redis

##建表语句
CREATE TABLE `shorturl_1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `long_url` text NOT NULL COMMENT '长链接',
  `head` varchar(45) NOT NULL COMMENT '地址头',
  `short_index` varchar(45) NOT NULL COMMENT '短链接序号',
  `random_str` varchar(45) NOT NULL COMMENT '链接中随机字符串',
  PRIMARY KEY (`id`),
  UNIQUE KEY `short_index_UNIQUE` (`short_index`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;


##接口调用说明
##获取短链接接口
   curl -k -X POST \
     --header "Content-Type:application/json" \
     -d '{"longUrl": "http://econtract.12301e.com/cloud/viewsopen/contract_view_p.html?contractId=1710211230530074&companyId=C_32439&touristPhone=18911488028&handlerId=S_13722233333"}' \
      http://127.0.0.1:8309/dwz/query

##短链接转换为长链接接口
   curl -k -X POST \
     --header "Content-Type:application/json" \
     -d '{"shortUrl": "http://1/ecwzzCdRt/6"}' \
      http://127.0.0.1:8309/dwz/transf