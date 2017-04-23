# FETCHMAN

HTTP接口调试命令行工具

## FEATURES

实现部分 curl 功能 , 并

1. 保存请求供下次直接调用

2. 添加公共 header 及 cookie

3. 辅助登录

## USAGE

### fetchman create project_name

创建一个 fetchman 工程目录

### fetchman new request_option_items

创建一个请求配置文件

### fetchman request(rq) request_option_items [-i] [-I]

发起 request 请求并返回 body

#### -i

返回 head 与 body

#### -I

仅返回 head

### 配置公共请求参数

编辑项目根目录 .fetchman 文件

### 清除 cookie

删除根目录下 .cookie 文件

## TO DO

1. 按条件执行请求 (如服务器返回401自动执行登录)
2. 文件上传
