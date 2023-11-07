推送条件 push_condition
推送渠道 push_channel
推送时间 push_time
推送对象 push_obj
{
"push_condition": [
{
"type": 1,
"description": "bug_description",
"cond_conf": 3,
"send_description": "推送阀值描述",
"send_conf": 4,
"is_enable": 0
},
{
"type": 2,
"description": "bug_description",
"cond_conf": 3,
"send_description": "推送阀值描述",
"send_conf": 4,
"is_enable": 0
},
{
"type": 3,
"description": "bug_description",
"cond_conf": 3,
"send_description": "推送阀值描述",
"send_conf": 4,
"is_enable": 0
},
{
"type": 4,
"description": "bug_description",
"cond_conf": 3,
"send_description": "推送阀值描述",
"send_conf": 4,
"is_enable": 0
},
],
"push_channel": [
{
"type": "system",
"description": "xx",
"other_config": {},
"is_enable": 0
},
{
"type": "dd",
"description": "xx",
"other_config": {
"group_name": "钉钉群名",
"web_hook": ""
},
"is_enable": 0
},
],
"push_time": {
"day": [
0,
1,
2,
3,
4,
5,
6
],
"is_holiday": 0,
"time": {
"begin": "12:00",
"end": "20:00"
}
},
"push_obj": [
{
"id": 1,
"name": "xxx",
"account_id": 1
}
],
"is_open": 0,
}
获取项目 id 方法
const { projectId } = useProjectId()
