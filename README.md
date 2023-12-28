# yapi-gen README

The VSCode plugin is based on YAPI for code auto-generation.

# config

```json
{
  "yapi": {
    "domain": "https://yapi.xxx.com",
    "projects": [
      {
        "name": "资产管理",
        "token": "your yapi token",
        "domain": "https://yapi.xxx.com"
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