# TechTinder API

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET/profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connnectionReqRouter

- POST /request/send/:status/:userID
- POST /request/review/accepted/:requestID
- POST /request/review/rejected/:requestID

## userRouter

- GET /user/connections
- GET /user/requests
- GET /user/feeds - Gets profile of other Platform

Status : ignore, interested. accepted, rejected
