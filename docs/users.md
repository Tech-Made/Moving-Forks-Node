### Statuses

✅ 🚧 ✨ 📲 ⁉️

## User Process

✅ User can fill out a form to request an invite to join Moving Forks. 

✅ Upon submitting the form, a User object is created in our database ....


Sticking with LocalStorage for login auth to events page... this is a later priority item to be revamped.


## Admin Views

admin has a form where he can create an event
`POST /create`

admin can view all events

admin should be able to sign up and then login so i'll have to imlpement jwt auth one time for a signup, then disable it and only allow login then we can properly check that the user type is in fact admin.

[ ] when users hit the events page, all events should be loaded


## Events

[ ] when users hit the specific event page, all event specific details should be found and loaded.

[ ] when users hit the specific event page, all event specific details should be found and loaded.

[ ] When user purchases ticket for a specific event, the event details are updated and the user object is updated and sent an email with details through SendGrid.

️️️⁉️ How to send data from route to local storage we can send back and fourth the user ID's this is an insecure way of doing thigns however.

## Views

Copy paste over the events dashboard