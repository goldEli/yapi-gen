# yapi-gen README

The VSCode plugin is based on YAPI for code auto-generation.

### config

/yapi-gen/config.json

```json
{
    "yapi": {
      "domain": "https://ops-yapi.staryuntech.com",
      "projects": [
        {
          "name": "资产管理",
          "basePath": "/api/assets",
          "token": "69f477b003f1d8669d4304ddf86a46e159ef2709cf28c0b6e62e59c33",
          "domain": "https://ops-yapi.staryuntech.com"
        }
      ]
    },
    "mock": {
      "mockNumber": "Random.natural(1000,1000)",
      "mockBoolean": "false",
      "mockString": "Random.cword(5, 7)",
      "mockKeyWordEqual": [],
      "mockKeyWordLike": []
    },
    "commonlyUsedBlock": [],
    "syncFolder": ""
  }
  
```

### template

/yapi-gen/template.ejs

```ejs
<%= type %>  
<% if (api.req_query.length > 0 || api.req_params.length > 0 || api.query_path.params.length > 0) { %>
export interface I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Params {
<% api.req_query.map(query => { %><%= query.name %>: string;<% }) %>
<% api.req_params.map(query => { %><%= query.name %>: string;<% }) %>
<% api.query_path.params.map(query => { %><%= query.name %>: string;<% }) %>
}
<% } %> 
<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) { %>
<%= requestBodyType %> 
<% } %> 

/**
* <%= api.title %> 
* /project/<%= api.project_id %>/interface/api/<%= api._id %> 
* @author <%= api.username %>  
* 
<% if (api.req_query.length > 0 || api.req_params.length > 0 || api.query_path.params.length > 0) { -%>* @param {I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Params} params<%- "\n" %><% } _%>
<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) { -%>* @param {I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Data} data<%- "\n" %><% } _%>
* @returns
*/
export function <%= rawSelectedText %> (
<% if (api.req_query.length>0 || api.req_params.length > 0 || api.query_path.params.length > 0) { %>
params: I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Params,
<% } _%>
<% if (requestBodyType) { %> 
data: I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Data
<% } %> 
) {
return request<I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Result>({
	    url: `<%= api.query_path.path.replace(/\{/g,"${params.") %>`, 
		method: '<%= api.method %>',
		<% if(api.req_query.length>0 || api.req_params.length > 0) { %>params,<% } _%>
<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) {%>data,<% } %> 
	})
}
```