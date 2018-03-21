# demoPanel

# Installation
* run `npm install`
* create empty MySQL database 
* update storage section in *./modules/config.js* accordingly
* run `npm run db_install`
* *(optional)* update HTTP port in *./modules/config.js*
* run `npm start` to launch app
* run `npm test` to test started app 

#  API
Requests with payloads must have JSON in body and header `Content-type: application/json`. 
Set token in header `Authorization: Bearer <token>` if needed.

## Users and tokens
| Operation | Method | URL | Need token? | Request JSON | Response  JSON on success (200)| 
| ------------- | ------------- | ------------- | ------------- | ------------- |  ------------- |
| Signup user | POST | /users  | no |  `UserData`  | {id: `{number}`} |
| Create token for user | POST | /tokens  | no |  `UserData`  | {token: `{string}`} |

## Tasks
| Operation | Method | URL | Need token? | Request JSON | Response  JSON  on success (200)| 
| ------------- | ------------- | ------------- | ------------- | ------------- |  ------------- |
| Get all tasks | GET | /tasks  | yes |   | {tasks: `{Task[]}`} |
| Get task by id| GET | /task/:id  | yes |  | {task: `{Task}`}  |
| Create task | POST | /tasks  | yes |  `TaskData`   | {id: `{number}`} |
| Delete task | DELETE | /task/:id  | yes |    |  |
| Update task | PUT | /task/:id | yes |  `UpdateTaskData`   | |

# Type definitions
| Type |  | 
| ------------- | ------------- |
|Task| {id: `{number}`, authorId: `{number}`, title: `{string}`, body: `{string}`, allowedUserIds: `{number[]}`}|
|CreateTaskData| {title: `{string}`, body: `{string}`, allowedUserIds: `{number[]=}`} |
|UpdateTaskData| {title: `{string=}`, body: `{string=}`, allowedUserIds: `{number[]=}`} |
|UserData| {name:`{string}`, password: `{string}`} |
