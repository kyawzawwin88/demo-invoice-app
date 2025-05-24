# How I plan

  - Requirement breakdowns
  - High level tech stacks decision
  - Developer Notes

## Requirement breakdowns
  - General (Domain & Usecases)
    - Build internal invoice application for accounting department
    - Manage invoices such as CRUD
    - Invoice ID format > 2 uppercase random character + 4 random number
    - Invoice ID is unique (Loop and generate new invoice until we find unique. Circuit breaker up to 3 times or throw error)
    - Invoice can be saved as draft or pending
      - Draft: All field are not required, new random invoice ID will be created. 
      - Pending: All fields are required, new random invoice ID will be created. 
    - User can edit both draft and pending invoice
      - All field required regardless of draft of pending
      - If draft, invoice status should change to pending
    - User can delete both draft and pending invoice
    - User can mark pending invoice as paid
  - Data
    - follow schema based on sample from data.json
    - Issue Date is createdAt
    - Payment Terms are in day (enum 1,7,30 as per sample data) 
    - PaymentDue = Issue Date + Payment Terms in day
    - Total is sum of items.total
    - All senderAddress is same
    - No uuid for ID
    - All fields are optional except for id and status (draft/pending/deleted/paid)
    - One invoice can have multiple items, one sender and/or one client
    - Store date timezone in UTC
    - Database seeding based on data.json
  - Backend
    - No authentication required. Single user will use from localhost. No need to worry about concurrency and high traffic. Invoice application will be available publicly at local URL.
    - Validate form on create/edit invoice action at server side
    - Keep track of each event / activity, audit log. I will track in database instead of localstorage.
  - Frontend UI
    - Follow provided design system
    - Use icon from assets
    - No need mobile responsive (Only for desktop version)
    - Filter invoice list by status
    - Paginate invoice list
    - Validate form on create/edit invoice action at client side

## High level tech stacks decision
  - NestJS for Restful api backend (It is one of powerful nodejs framework designed for full stack development), apply clean architecture pattern
  - ReactJS and tailwindcss + headlessui for UI (highly scalable and powerful framework and library combo for building scalable and maintainable design components), apply atomic design pattern
  - MySQL as relational database (selected this based on recent interview)
  - Dockerfile on slim-node base image for production deployment

## Developer Notes

  - api docs can be found here http://localhost:3000/api
  - run the demo using docker, mysql server will also install in same container
    docker build -t invoicing_app .
    docker run -p 3000:3000 invoicing_app

  - development notes
    - npm run start:dev (command to start api and ui on same port with watcher)
    - npm run test:cov (to see unit test coverage)
    - cd automated-test && pytest -v (to run test automation for save as draft and save as pending happy flow)


